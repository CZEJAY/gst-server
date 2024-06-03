import express from "express";
import uploadRouter from "../api/upload/index.js";
import { StudentController } from "../controller/studentController.js";
import { verifyJWT } from "../middleware/verifyJWT.js"
const rootRouter = express.Router();

rootRouter.use("/upload", uploadRouter);
rootRouter.post("/register", verifyJWT, StudentController.createStudent);
rootRouter.post("/signin", StudentController.signin);
rootRouter.post("/signup", StudentController.signup);
rootRouter.post("/verify/fingerPrint", StudentController.verifyFingerPrint);

rootRouter.post("/check", StudentController.check);
rootRouter.post("/checkEmail", StudentController.checkEmail);
rootRouter.post("/checkMatricNumber", StudentController.checkMatricNumber);
rootRouter.post("/checkPhone", StudentController.checkPhone);
rootRouter.get("/check-access", StudentController.check_access);

export default rootRouter;
