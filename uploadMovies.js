require('dotenv').config();
const fs = require('fs');

const mongo = require('mongodb').MongoClient;

const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds155606.mlab.com:55606/kayakui`

const moviesFile = './movies.json';

const init = () => {
	let string = loadJson();

	if (!string) {
		return
	}

	let json = JSON.parse(string)

	mongo.connect(url,  { useNewUrlParser: true }, (err, client) => {
		if (err) {
			console.error(err);
			return
		} else {
			console.log('Successfully connected to MongoDB!');
		}

		const db = client.db('kayakui');
	  
		const collection = db.collection('Movies');

		// collection.find().toArray((err, items) => {
		// 	console.log(items);
		// });


		// collection.find().forEach(movie => {
		// 	collection.update(
		// 		{ 
		// 			title: movie.title,
		// 			id: movie.id
		// 		},
		// 		movie,
		// 		{ upsert: true }
		// 	);
		// });

		// collection.deleteMany({}, function(err, results){
		// 	console.log(results.result);
		// });

		try {
   			collection.insertMany(json.slice(354617, json.length), (err, result) => {
				if (err) {
					console.error(err);
					return
				} else {
					console.log('Successfully inserted movies to MongoDB!\n', result);
				}
			});
		} catch (e) {
		   console.log(e);
		}

		// client.close();
	})

}

const loadJson = () => {
  try {
    return fs.readFileSync(moviesFile, 'utf8');
  } catch (err) {
    console.error(err);
    return false
  }
}

// Init
(() => {
	init();
})();