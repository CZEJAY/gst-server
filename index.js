import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin  from "firebase-admin";
import {getAuth} from "firebase-admin/auth"
import serviceAccountKey from "./serviceAccountKey.json" with {type: "json"};
import { connectToDatabase } from "./src/db/index.js";
import router from "./src/routes/index.js";
import { verifyJWT } from "./src/middleware/verifyJWT.js";
import Registrar from "./src/Schema/Registrar.js";


const server = express();
let PORT = 3020;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// regex for email validation
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

server.use(express.json());
server.use(cors());

/** POST: http://localhost:8080/uploads  */
server.use("/api/upload", router)

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

// server.post("/api/signup", (req, res) => {
//   let { fullname, email, password } = req.body;

//   // validate the data from frontend
//   if (!fullname || !email || !password) {
//     res.status(400).json({ error: "Please fill in all fields" });
//   }
//   if (!emailRegex.test(email)) {
//     res.status(400).json({ error: "Invalid email" });
//   }
//   if (!passwordRegex.test(password)) {
//     res
//       .status(400)
//       .json({ error: "Password should be 6 to 20 characters long" });
//   }

//   bcrypt.hash(password, 10, (err, hash) => {
//     if (err) {
//       console.log(err);
//     }
//     let username = email.split("@")[0];
//     let user = new User({
//       personal_info: {
//         fullname,
//         username,
//         email,
//         password: hash,
//       },
//     });
//     user
//       .save()
//       .then((user) => {
//         console.log(user);
//         res.status(200).json({ data: formatDataToSend(user) });
//       })
//       .catch((err) => {
//         if (err.code === 11000) {
//           res.status(400).json({ error: "User already exists" });
//         }
//         console.log(err);
//       });
//   });

//   // create a new user
//   // let newUser = new User({fullname, email, password})

//   // save the user to the database
// });

server.post("/api/signin", async (req, res) => {
  let { username, password } = req.body;

  const user = await Registrar.findOne({ username });

  if (!user) {
    return res.status(405).json({ error: "User not found" });
  }

    res.status(200).json({ data: formatDataToSend(user) });
  
});


server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase()
});
