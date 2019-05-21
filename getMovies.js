const fs = require('fs');
const request = require('request');


const discoverUrl = "https://api.themoviedb.org/3/discover/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=";

let totalPages = 1;
let movies = [];
const moviesFile = './movies.json'

const init = async () => {
	await getFirstPage();

 	await getAllMovies();

	await toJson();

 	console.log(movies.length);	
}

const toJson = async () => {
	try {
		fs.writeFileSync(moviesFile, JSON.stringify(movies));
	} catch (err) {
		console.error(err);
	}
}

const getAllMovies = async () => {
	for (let page = 2; page <= totalPages; page++) {
    	await getMoviesPage(page);

    	if (page % 100 === 0) {
			console.log(`Movies for page ${page} already parsed`);
    	}
    }
}

const getJson = (url) => {
	url = `${discoverUrl + 1}`;

	const options = {
		url: url,
		method: 'GET',
	};

	// Return new promise
	return new Promise(function(resolve, reject) {
		// Do async job
		request.get(options, function(err, resp, body) {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(body));
			}
		});
	});
}

const getFirstPage = async () => {
	url = `${discoverUrl + 1}`
	let json = await getJson(url);
	movies = json.results;

	totalPages = json.total_pages;
}

const getMoviesPage = async (page) => {
	url = `${discoverUrl + page}`
	let json = await getJson(url);

	json.results.map(movie => {
		movies.push(movie);
	});
}


// Init
(() => {
	init();
})();

