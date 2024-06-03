import mongoose, { Schema } from "mongoose";

const fingerPrints = mongoose.Schema(
  {
    template: {
      type: String,
      required: [true, "Template url is required"],
    },
    sample: {
      type: String,
      required: [true, "Sample url is required"],
    },
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: "Student"
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FingerPrint", fingerPrints);
