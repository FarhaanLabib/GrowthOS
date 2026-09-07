const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');
let dbInstance;

async function getDb() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('growthos');
  }
  return dbInstance;
}

module.exports = { getDb };