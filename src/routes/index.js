import express from "express";
import uploadRouter from "../api/upload/index.js";
import registerRouter from "../api/students/index.js";
import StudentService, { ValidationError } from "../api/students/student.service.js";
import { connectToDatabase } from "../db/index.js";

const rootRouter = express.Router();
const allowedIPs = ['192.168.56.1', '192.168.0.178', '192.168.75.70', '192.168.0.187', "192.168.49.13"];

rootRouter.use("/upload", uploadRouter);
rootRouter.use("/register", registerRouter);

rootRouter.post("/check", async (req, res) => {
  const data = await req.body;
  try {
    const SSV = new StudentService(data)
    await SSV.checkStudentExistence()
  } catch(error) {
    console.log(error);
    if(error instanceof ValidationError){
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(500).json("Something went wrong.")
    }
  }
})
rootRouter.post("/checkEmail", async (req, res) => {
  const data = await req.body;
  try {
    const SSV = new StudentService(data)
    const result = await SSV.checkEmail()
    if(result){
      res.status(200).json({ message: "Student exists", result });
    }
  } catch(error) {
    console.log(error);
    if(error instanceof ValidationError){
      return res.status(404).json({ msg: error.message });
    } else {
      return res.json("Something went wrong.")
    }
  }
})
rootRouter.post("/checkMatricNumber", async (req, res) => {
  const data = await req.body;
  try {
    const SSV = new StudentService(data)
    const result = await SSV.checkMatricNumber()
    if(result){
      res.status(200).json({ message: "Student exists", result });
    }
  } catch(error) {
    console.log(error);
    if(error instanceof ValidationError){
      return res.status(404).json({ msg: error.message });
    } else {
      return res.json("Something went wrong.")
    }
  }
})
rootRouter.post("/checkPhone", async (req, res) => {
  const data = await req.body;
  try {
    const SSV = new StudentService(data)
    const result = await SSV.checkPhone()
    if(result){
      res.status(200).json({ message: "Student exists", result });
    }
  } catch(error) {
    console.log(error);
    if(error instanceof ValidationError){
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(500).json("Something went wrong.")
    }
  }
})
rootRouter.get("/check-access", (req, res) => {
  const userIP = req.headers['x-user-ip'] || req.ip;
  console.log(userIP)
  if (allowedIPs.includes(userIP)) {
    res.status(200).json("Checked!")
  } else {
    res.status(403).send('Access Denied');
  }
});

export default rootRouter;
