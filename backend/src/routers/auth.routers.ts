import express from "express";
import { authController } from "../controllers/implementations/auth.controller";

const authRouter = express.Router();

authRouter.post("/signUp", authController.signUp.bind(authController));

export default authRouter;
