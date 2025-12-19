import express from "express";
import { authController } from "../controllers/implementations/auth.controller";

const authRouter = express.Router();

authRouter.post("/signUp", authController.signUp.bind(authController));
authRouter.patch(
  "/verify-email",
  authController.verifyEmail.bind(authController)
);

authRouter.post("/signIn", authController.signIn.bind(authController));
authRouter.post(
  "/forgot-password",
  authController.requestPasswordReset.bind(authController)
);
authRouter.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);
authRouter.post("/logout", authController.logout.bind(authController));

export default authRouter;
