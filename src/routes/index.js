import express from "express";
import uploadRouter from "../api/upload/index.js";
import registerRouter from "../api/students/index.js";

const rootRouter = express.Router();
const allowedIPs = ['192.168.56.1', '192.168.0.178', '192.168.0.187'];

rootRouter.use("/upload", uploadRouter);
rootRouter.use("/register", registerRouter);
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
