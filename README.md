# ETLs
ETL stands for Extract Load Transform

This code does not have to be in the common repository but to keep everything in one place, we will leave it here. This has some advantages because the libraries either from npm or written by ourselves can be shared between the etls and other code.

External libraries that we need to perform this ETL are:

* request
* mongodb
* dotenv

We will install these libraries by running

* `npm i request --save-dev`
* `npm i mongodb --save-dev`
* `npm i dotenv --save-dev`

These libraries would be added to devDependencies in our package.json.

However, this would be needed if these libraries were not in our package.json. Since the code that you pull already has it, just run `npm i` to install all of the dependencies.

***

We will need to create an `.env` file in our main repository.

*Such information should never be included in the documentation but since all of this code is for learning purposes, we will add it here.*

For security reasons we do not want to commit our login credentials to the repository. Therefore, we added the `.env` file in our `.gitignore` file.

Add these two lines in the .env file:

```
MONGO_USERNAME=kayakui
MONGO_PASSWORD=kayakui1
```

The `dotenv` will parse this file and we will be able to access these variables by calling

```
process.env.MONGO_USERNAME
process.env.MONGO_PASSWORD
```

***

*Such information should never be included in the documentation but since all of this code is for learning purposes, we will add it here.*

You can login to the Mongo database with these credentials

```
mongodb://kayakui:kayakui1@ds155606.mlab.com:55606/kayakui
```

***

In order to download all of the movies, first run the **getMovies.js** from our main repository where we have our *packagage.json* and *node_modules* (if `npm i` was performed).

* `node getMovies.js`

Later to upload the movies to Mongo database run **uploadMovies.js**. 

* `node uploadMovies.js`

Yet the database has the movies already uploaded, so you don't really need to. If you do not want to duplicate movies in the Movies, you can change the name of the name collection. You can also delete the movies from the `Movies` collection and the upload them. This Mongo database can be replaced with your own. Either local or remote database.

***

In order to be able to search by text in movie *title* and *overview*, add a text index on *title* and *overview* fields for the collection. You can do it in the MongoDB client or shell via terminal by running this command:

```
db.Movies.createIndex( 
	{ title: "text", overview: "text" } 
)
```

To be able to perform a text search by one field only, text index can be added on one field only, e.g.

```
db.Movies.createIndex( 
	{ title: "text" } 
)
```

To delete the text (full text search) index just replace *createIndex* by *dropIndex* and `{ "_fts" : "text", "_ftsx" : 1 }` add this key:

```
db.collection.dropIndex(
	{ "_fts" : "text", "_ftsx" : 1 }
)

```

More info on text indexes: [https://docs.mongodb.com/manual/core/index-text/](https://docs.mongodb.com/manual/core/index-text/)
