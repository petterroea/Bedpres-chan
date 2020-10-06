import mongoose from "mongoose";

let database: mongoose.Connection;

const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL

if(typeof MONGO_CONNECTION_URL === "undefined") {
  throw new Error("MONGO_CONNECTION_URL is not defined")
}

export const connect = () => {  // add your own uri below
  if (database) {
    return;
  }  
  mongoose.connect(MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  database = mongoose.connection;

  database.once("open", async () => {
    console.log("Connected to database");
  });  
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};

export const disconnect = () => {  
  if (!database) {
    return;
  }
  mongoose.disconnect();
};