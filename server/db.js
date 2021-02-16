/*const { MongoClient } = require('mongodb');

const dbName = 'tareas';
const url = 'mongodb+srv://reto-tareas.v2lfs.mongodb.net/tareas';

const client = new MongoClient(url,{
    useUnifiedTopology: true
});

module.exports = async () => {
    await client.connect();

    return client.db(dbName);
}*/

/*
const MongoClient = require('mongodb').MongoClient;


const client = new MongoClient(uri, { useNewUrlParser: true });
module.exports = async () => {
    await client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
}
*/
require('dotenv').config();

const uri = process.env.uri;

const mongoose = require('mongoose');

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(db => console.log('Db is connected'))
.catch(err => console.error(err));

module.exports = mongoose;


/*
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('mongo DB success');
});*/


