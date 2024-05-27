import "dotenv/config"
import mongoose from "mongoose";
import GridFsStorage from "multer-gridfs-storage";
import { conn } from "../db/index.js";

export const uploadController = async (req, res, next) => {
  try {
    
    return res.status(200).json({ message: "Ok" });
  } catch (err) {
    next(err);
  }
};
