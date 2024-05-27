import Fingerprint from "../../../Schema/Fingerprint.js";
import Student from "../../../Schema/Student.js";
import { hashPassword } from "../../utils/index.js";

export class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
    }
  }

class StudentService {
  constructor(data = {}) {
    this.data = data;
  }

  async create() {
    try {
      const existingEmail = await Student.findOne({ email: this.data.email });
      if (existingEmail) {
        throw new Error("Email already exists");
      }
      const existingPhone = await Student.findOne({ phone: this.data.phone });
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
        password: this.data.password,
      });
      const student = new Student({
        ...this.data,
        password: hashedPassword,
        fingerPrint: this.data.fingerPrintId,
      });
      const fingerPrintUpdate = await Fingerprint.findOneAndUpdate(
          {
              _id: this.data.fingerPrintId,
            },
            { $set: { studentId: student._id } }
        );
        student.save()
      return student;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // CHECK IF A STUDENT WITH UNIQUES FIELDS ALREADY EXIST
  async checkStudentExistence() {
    try {
      const { email, phone, matricNumber } = this.data;
      
      const [existingEmail, existingPhone, existingMatricNumber] = await Promise.all([
        email ? Student.findOne({ email }) : null,
        phone ? Student.findOne({ phone }) : null,
        matricNumber ? Student.findOne({ matricNumber }) : null
      ]);
  
      if (existingEmail) {
        throw new ValidationError("Email already exists");
      } else if (existingPhone) {
        throw new ValidationError("Phone number already exists");
      } else if (existingMatricNumber) {
        throw new ValidationError("Matric number already exists");
      }
  
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`Validation error: ${error.message}`);
        throw error; // Re-throw the validation error to be handled by the frontend
      } else {
        console.log(`Internal server error: ${error.message}`);
        throw new Error('Internal server error'); // Throw a generic error to avoid exposing internal details
      }
    }
  }
}

export default StudentService;