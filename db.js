const { MongoClient } = require("mongodb");

const client = new MongoClient(
  "mongodb+srv://todoAppUser:Passw0rd@cluster0.ne7tk.mongodb.net/TwitterCloneApp?retryWrites=true&w=majority"
);

async function start() {
  await client.connect();
  module.exports = client.db();

  //To listen to the port 3000 only after we established connection with db
  const app = require("./app");
  app.listen(3000);
}

start();
