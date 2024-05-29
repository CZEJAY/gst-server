import mongoose, { Schema } from "mongoose";

const registrarSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, 'username is required'],
        minlength: [3, 'username must be at least 3 characters long'],
    },
    
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    students: {
        type: [mongoose.Types.ObjectId],
        ref: "Students"
    }
}, { 
    timestamps: true // This automatically handles createdAt and updatedAt fields
});

export default mongoose.model("Registrar", registrarSchema);
