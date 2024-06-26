import {
  StudentService,
  ValidationError,
} from "../services/StudentService.service.js";
import { allowedIPs, formatDataToSend } from "../utils/index.js";

export class StudentController {
  constructor() {
    // this.studentService = new StudentService();
  }

  static async createStudent(req, res) {
    const data = await req.body;
    try {
      const result = await StudentService.create(data, req.user);
      if (result) {
        res
          .status(201)
          .json({ message: "Student registered successfully", result });
      }
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "Something went wrong.", msg: error.message });
    }
  }

  static async check(req, res) {
    const data = await req.body;
    // console.log("LINE 28: ", data)
    try {
     const {message} = await StudentService.checkStudentExistence(data);
     if(message){
        res.json({msg:message})
     }
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }

  static async checkEmail(req, res) {
    const data = await req.body;
    try {
     const {message} = await StudentService.checkEmail(data);
     if(message){
        res.json({msg:message})
     }
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }

  static async checkMatricNumber(req, res) {
    const data = await req.body;
    try {
      const { message } = await StudentService.checkMatricNumber(data);
      if (message) {
        return res.json({ msg: message });
      } 
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }

  static async checkPhone(req, res) {
    const data = await req.body;
    try {
      const {message} = await StudentService.checkPhone(data);
      if(message){
        res.json({msg:message})
      }
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }
  static async signin(req, res) {
    const data = await req.body;
    try {
      const user = await StudentService.signin(data);
      if (user) {
        res.json({ data: formatDataToSend(user) });
      }
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }
  static async signup(req, res) {
    const data = await req.body;
    console.log(data);
    try {
      const user = await StudentService.signup(data);
      if (user) {
        res.json({ data: formatDataToSend(user) });
        console.log(user);
      }
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }
  static async verifyFingerPrint(req, res) {
    const data = await req.body;
    try {
      const {matchedStudent} = await StudentService.verifyFingerPrint(data);
      if (matchedStudent) {
        res.json({ student: matchedStudent });
    } else {
        res.status(404).json({ err: 'No matching fingerprint found' });
    }
    } catch (error) {
      console.log(error.message);
      if (error instanceof ValidationError) {
        return res.status(404).json({ msg: error.message });
      } else {
        return res.status(500).json("Something went wrong.");
      }
    }
  }

  static check_access(req, res) {
    const userIP = req.headers["x-user-ip"] || req.ip;
    console.log(userIP);
    if (allowedIPs.includes(userIP)) {
      res.status(200).json("Checked!");
    } else {
      res.status(403).send("Access Denied");
    }
  }
}
