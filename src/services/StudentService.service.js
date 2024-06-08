import Fingerprint from "../Schema/Fingerprint.js";
import Registrar from "../Schema/Registrar.js";
import Student from "../Schema/Student.js";
import { connectToDatabase } from "../db/index.js";
import { MatchFingerPrint } from "../utils/FingerPrintMatcher.js";
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

  static async create(data, rUserId) {
    try {
      
      const existingMatricNumber = await Student.findOne({
        matricNumber: data.matricNumber,
      });
      if (existingMatricNumber) {
        throw new ValidationError("Matric number already exists");
      }
      const registrar = await Registrar.findById(rUserId);
      if (!registrar) {
        throw new ValidationError("Registrar user not found");
      }
      
      const student = new Student({
        ...data,
        registrar: registrar._id,
      });
      await registrar.students.push(student._id);
      registrar.save();
      student.save();
      return student;
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

  static async checkStudentExistence(data) {
    try {
      const { matricNumber } = data;

      if (!matricNumber) {
        throw new ValidationError(
          "Matric number must be provided."
        );
      }

      const existingStudent = await Student.findOne({matricNumber});
      if (existingStudent) {
        throw new ValidationError(
          "Student already exists with provided matric number."
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
      return {
        message: "Email is available",
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
  static async checkPhone(data) {
    try {
      const { phone } = data;

      const existingPhone = await Student.findOne({ phone });

      if (existingPhone) {
        throw new ValidationError("Phone number already exists");
      }
      return {
        message: "Phone number is available",
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
  static async checkMatricNumber(data) {
    try {
      const { matricNumber } = data;
      const existingMatricNumber = await Student.findOne({ matricNumber });
      console.log(existingMatricNumber);
      if (existingMatricNumber) {
        throw new ValidationError("Matric number already exists");
      }
      return {
        message: "Matric number is available",
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
  static async verifyFingerPrint(data) {
    const { sample } = data;
    try {
      if (!sample) {
        throw new ValidationError("Fingerprint data is required.");
      }

      const fingerPrints = await Fingerprint.find({}).populate("studentId")
      
      let matchedStudent = null;

      for (let fingerprint of fingerPrints) {
          const isMatch = await MatchFingerPrint([sample, fingerprint.sample]);
          if (isMatch) {
              matchedStudent = fingerprint;
              break;
          }
      }
      if (!matchedStudent) {
        throw new ValidationError("No matching fingerprint found.");
        }
        return {matchedStudent};
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error}`);
        throw new Error("Internal server error"); // Throw a generic error to avoid exposing internal details
      }
    }
  }
}
