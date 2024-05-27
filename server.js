import "dotenv/config";
import express from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import { connectToDatabase } from "./src/db/index.js";
import router from "./src/routes/index.js";
import { verifyJWT } from "./src/middleware/verifyJWT.js";
import morgan from "morgan"
import bodyParser from "body-parser"


const server = express();
let PORT = 3000;

server.use(morgan("dev"))
server.use(express.json({ limit: '50mb'}));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.use(cors());

/** POST: http://localhost:8080/uploads  */
server.use("/api/", router)

const generateUserName = async (email) => {
  let username = email.split("@")[0];
  let user = await User.exists({ "personal_info.username": username });
  user ? (username += nanoid()) : "";
  return username;
};

const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};





server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase()
});
