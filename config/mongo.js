import { MongoClient } from "mongodb";

// create configuration object for Mongo instance
const mongoConfig = {
  host: "127.0.0.1",
  port: 27017,
  database: "yellow_pages_database",
  // user: "Heisenberg",
  // password: "737",
};
// Connect to the MongoDB database.
const connectionString =
  process.env.MONGODB_URL ||
  `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`;
// `mongodb+srv://yellow_pages_user:yellow_pages_password@cluster0.rld2sga.mongodb.net/yellow_pages_database`;
// `mongodb+srv://yellow_pages_user:yellow_pages_password@cluster0.rld2sga.mongodb.net/yellow_pages_database`

export const client = new MongoClient(connectionString);
export const connectToMongo = async () => {
  client
    .connect()
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) =>
      console.log("error while connecting to database", err.message)
    );
};

// data directory
// C:\Program Files\MongoDB\Server\7.0\data\
