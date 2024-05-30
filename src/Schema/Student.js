import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
    firstName: {
        type: String,
        lowercase: true,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 3 characters long'],
    },
    surName: {
        type: String,
        lowercase: true,
        required: [true, 'Surname is required'],
        minlength: [3, 'Surname must be at least 3 characters long'],
    },
    otherName: {
        type: String,
        lowercase: true,
        required: [true, 'Other name is required'],
        minlength: [3, 'Other name must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        unique: true,
        index: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is required']
    },
    phone: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'Phone number is required']
    },
    faculty: {
        type: String,
        required: [true, 'Faculty is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    level: {
        type: String,
        required: [true, 'Level is required']
    },
    courses: {
        type: [String],
        required: [true, 'Courses are required']
    },
    matricNumber: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'Matric number is required']
    },
    image: {
        type: String,
        required: [true, 'Image URL is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    fingerPrint: {
        type: mongoose.Types.ObjectId,
        ref: "fingerPrints"
    },
    registrar: {
        type: mongoose.Types.ObjectId,
        ref: "Registrar"
    }
}, { 
    timestamps: true // This automatically handles createdAt and updatedAt fields
});

export default mongoose.model("Student", studentSchema);
