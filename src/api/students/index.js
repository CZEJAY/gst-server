import "dotenv/config";
import { Router } from "express";
import StudentService, { ValidationError } from "./student.service.js";

const router = Router();
router.post("", async function (req, res) {
  const data = await req.body;
  try {
    const SSV = new StudentService(data)
    const result = await SSV.create()
    if(result){
        res.status(201).json({ message: "Student registered successfully", result });
    }
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong.", msg: error.message });
  }
});






export default router;
