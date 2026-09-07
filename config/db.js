const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'growthos';

// Fail fast when MongoDB is not configured. Routes that support demo/fallback
// data can continue instead of making the whole API appear unavailable.
const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS || 2000),
  connectTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS || 2000),
});
let db;
let connectPromise;

async function connectDB() {
  if (db) return db;
  if (!connectPromise) {
    connectPromise = client.connect()
      .then(() => {
        db = client.db(dbName);
        console.log('Connected to MongoDB:', dbName);
        return db;
      })
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }
  return connectPromise;
}

module.exports = connectDB;
