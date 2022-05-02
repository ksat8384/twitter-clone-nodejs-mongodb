//To access mongodb connection string from .env file, we use dotenv package
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.CONNECTIONSTRING);

async function start() {
  await client.connect();
  module.exports = client.db();

  //To listen to the port 3000 only after we established connection with db
  const app = require("./app");
  app.listen(process.env.PORT);
}

start();
