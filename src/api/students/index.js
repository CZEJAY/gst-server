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

router.post("/check", async (req, res) => {
  const data = await req.body;
  try {
    const SSV = new StudentService(data)
    const result = await SSV.checkStudentExistence()
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

export default router;
