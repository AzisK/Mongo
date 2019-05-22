const fs = require('fs');
const request = require('request');


const discoverUrl = "https://api.themoviedb.org/3/discover/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=";

let totalPages = 1;
let movies = [];
let moviesCount = 0;
const moviesDir = './movies/'

const init = async () => {
	!fs.existsSync(moviesDir) && fs.mkdirSync(moviesDir);

	await getFirstPage();

 	await getAllMovies();

 	console.log(`Total downloaded movies ${moviesCount}`);
}

const getFirstPage = async () => {
	url = `${discoverUrl + 1}`
	let json = await getJson(url, 1);

	movies = json.results;

	totalPages = json.total_pages;

	saveMovies(1);
	emptyMovies();
}

const getAllMovies = async () => {
	console.log('Start querying the API page by page');

	for (let page = 2; page <= 1001; page++) {

		let isResponse = await getMoviesPage(page);

		if (!isResponse) {
			console.log('Breaking the querying by page because last page did not have proper response');
			break;
		}

    	if (page % 20 === 0) {
    		console.log(`${page} page last movie: ${movies[movies.length - 1].title}`);
			console.log(`Movies for page ${page} already parsed`);
    	}

    	emptyMovies();
    }
}

const getJson = (url, indetifier) => {
	const options = {
		url: url,
		method: 'GET',
	};

	// Return new promise
	return new Promise(function(resolve, reject) {
		// Do async job
		request.get(options, function(err, resp, body) {
			if (err) {
				console.log(`Response for ${indetifier} is: ${resp && resp.statusCode}`);
				console.log(`Error for ${url} is: ${err}`);
				reject(err);
			} else {
				console.log(`Response for ${indetifier} is: ${resp && resp.statusCode}`);
				resolve(JSON.parse(body));
			}
		});
	});
}

const getMoviesPage = async (page) => {
	url = `${discoverUrl + page}`
	let json = await getJson(url, page);

	if (json.results) {
		movies = json.results;
		saveMovies(page);
		return true;
	} else {
		console.log(`Could not map results for page ${page}. Response: %j`, json);
		return false;
	}
}

const toJson = async (file) => {
	try {
		fs.writeFileSync(file, JSON.stringify(movies));
	} catch (e) {
		console.error(e);
	}
}

const saveMovies = (page) => {
	toJson(`${moviesDir}movies${page}.json`);
}

const emptyMovies = () => {
	moviesCount += movies.length;
	movies = [];
}

// Init
(() => {
	init();
})();

