import mongoose, { Schema } from "mongoose";

const fingerPrints = mongoose.Schema(
  {
    template: {
      type: String,
      required: [true, "Template url is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FingerPrint", fingerPrints);
