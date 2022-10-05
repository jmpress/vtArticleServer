const { MongoClient } = require("mongodb");
const connectionString = process.env.DATABASE_URL;
/*const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

async function connectToCluster() {
    let mongoClient;
 
    try {
        mongoClient = new MongoClient(connectionString);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }

module.exports = {connectToCluster};