import "dotenv/config";
import express from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import { connectToDatabase } from "./db/index.js";
import apiRouter from "./routes/index.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import morgan from "morgan"
import bodyParser from "body-parser"
import compression from "compression"
import errorHandler from "./middleware/errorHandler.js";


const app = express();

app.use(morgan("dev"))
app.use(express.json({ limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
app.use(compression())

/** POST: http://localhost:8080/uploads  */
app.use("/api/", apiRouter)
app.use(errorHandler)

export default app
