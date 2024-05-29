import "dotenv/config";
import mongoose from "mongoose"
mongoose.set({ strictQuery: false, strictPopulate: false })

let conn

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to the database");
    return;
  }


  // MongoDB connection URL 
  const mongoURI = process.env.DATABASE_URL;

  try {
    const conn = mongoose.connection

    conn.once("connected", () => {
      console.log("MongoDB Connected")
    })
    conn.once("disconnected", () => {
      console.log("Disconnected from mongoDB")
    })
    return mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}


