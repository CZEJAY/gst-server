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
    gender: {
        type: String,
        required: [true, 'Gender is required']
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
