import "dotenv/config";
import mongoose from "mongoose"

let conn

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to the database");
    return;
  }


  // MongoDB connection URL 
  const mongoURI = process.env.DATABASE_URL;

  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");

    conn = mongoose.connect(mongoURI);

    conn.then(() => {
      console.log("Connected to MongoDB");
    })
    // Event listeners
    // conn.on("error", (error) => console.error(error));
    // conn.once("open", () => {
    //   console.log("Connected to MongoDB");
    // });
    // conn.on("disconnected", () => console.log("Disconnected from Database"));
    // conn.on("reconnected", () => console.log("Reconnected to Database"));
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}


