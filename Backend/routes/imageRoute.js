import express from "express";
import { generateImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";

const imageRouter = express.Router();

imageRouter.post("/generateimage", userAuth, generateImage);

export default imageRouter;
