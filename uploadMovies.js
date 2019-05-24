require('dotenv').config();
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;


const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds155606.mlab.com:55606/kayakui`

const moviesDir = './movies/';

const init = async () => {
	const client = new MongoClient(url, { useNewUrlParser: true });

	try {
		await client.connect();
		console.log('Successfully connected to MongoDB!');

		const db = client.db('kayakui');

		// If you do not want to duplicate movies in the Movies, you can change the name of the name collection
		const collection = db.collection('Movies');

		await uploadFiles(collection);

		client.close();
	} catch (e) {
		console.error(e);
	}
}

const uploadFiles = async (collection) => {

	fs.readdirSync(moviesDir).forEach(async (filename) => {
		if (!filename.endsWith('.json') || !filename.startsWith('movies')) {
			console.log('Filename does not start with "movies" or does not end with ".json". Filename: ', filename);
			return;
		}

		let content = fs.readFileSync(moviesDir + filename, 'utf-8');

		try {
			let json = JSON.parse(content);
	    	await insertMovies(json, collection, filename);
		} catch (e) {
			console.error(e);
		}

	})
}

const insertMovies = async (json, collection, filename) => {
	try {
		r = await collection.insertMany(json);
    	console.log(`Movies from ${filename} inserted`);
	} catch (e) {
   		console.error(e);
	}
}


// Init
(() => {
	init();
})();
