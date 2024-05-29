import Fingerprint from "../Schema/Fingerprint.js";
import Registrar from "../Schema/Registrar.js";
import Student from "../Schema/Student.js";
import { connectToDatabase } from "../db/index.js";
import { hashPassword } from "../utils/index.js";
import bcrypt from "bcrypt";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class StudentService {
  constructor() {}

  static async create(data) {
    try {
      const existingEmail = await Student.findOne({ email: data.email });
      if (existingEmail) {
        throw new Error("Email already exists");
      }
      const existingPhone = await Student.findOne({ phone: data.phone });
      if (existingPhone) {
        throw new Error("Phone number already exists");
      }
      const existingMatricNumber = await Student.findOne({
        matricNumber: this.data.matricNumber,
      });
      if (existingMatricNumber) {
        throw new Error("Matric number already exists");
      }
      const hashedPassword = await hashPassword({
        password: data.password,
      });
      const student = new Student({
        ...data,
        password: hashedPassword,
        fingerPrint: data.fingerPrintId,
      });
      const fingerPrintUpdate = await Fingerprint.findOneAndUpdate(
        {
          _id: data.fingerPrintId,
        },
        { $set: { studentId: student._id } }
      );
      student.save();
      return student;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async checkStudentExistence(data) {
    try {
      const { email, phone, matricNumber } = data;
  
      if (!email && !phone && !matricNumber) {
        throw new ValidationError(
          "At least one of email, phone, or matric number must be provided."
        );
      }
  
      const query = { $or : [{ email }, { phone }, { matricNumber }] };
      const existingStudent = await Student.findOne(query);
      if (existingStudent) {
        throw new ValidationError(
          "Student already exists with provided email, phone, or matric number."
        );
      }
  
      return {
        message: "Student does not exist",
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error;
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error("Internal server error");
      }
    }
  }
  

  // CHECK IF A STUDENT WITH UNIQUES FIELDS ALREADY EXIST
  static async checkEmail(data) {
    try {
      const { email } = data;

      const existingEmail = await Student.findOne({ email });

      if (existingEmail) {
        throw new ValidationError("Email already exists");
      }
      return existingEmail;
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error("Internal server error"); // Throw a generic error to avoid exposing internal details
      }
    }
  }
  static async checkPhone(data) {
    try {
      const { phone } = data;

      const existingPhone = await Student.findOne({ phone });

      if (existingPhone) {
        throw new ValidationError("Phone number already exists");
      }
      return existingPhone;
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error("Internal server error"); // Throw a generic error to avoid exposing internal details
      }
    }
  }
  static async checkMatricNumber(data) {
    try {
      const { matricNumber } = data;
      const existingMatricNumber = await Student.findOne({ matricNumber });
      console.log(existingMatricNumber)
      if(existingMatricNumber){
        throw new ValidationError("Matric number already exists");
      }
      return {
        message: "Matric number is available"
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error("Internal server error"); // Throw a generic error to avoid exposing internal details
      }
    }
  }

  static async signin(data) {
    const { username, password } = data;
    try {
      if (!username) {
        throw new ValidationError("Username is required.");
      }
      if (!password) {
        throw new ValidationError("Password is required.");
      }

      const user = await Registrar.findOne({
        username,
      });
      if (!user) {
        throw new ValidationError("User not found.");
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new ValidationError("Invalid password.");
      }
      return user;
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error("Internal server error"); // Throw a generic error to avoid exposing internal details
      }
    }
  }
  static async signup(data) {
    const { username, password } = data;
    try {
      if (!username || !password) {
        throw new ValidationError("Username and Password is required.");
      }

      const user = await Registrar.findOne({
        username,
      });
      if (user) {
        throw new ValidationError("Username already exist.");
      }
      const hashedPassword = await hashPassword({ password });
      const newUser = new Registrar({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error("Internal server error"); // Throw a generic error to avoid exposing internal details
      }
    }
  }
}
