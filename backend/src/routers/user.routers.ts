import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userController } from "../controllers/implementations/user.controller";

const userRoute = express.Router();

userRoute.get(
  "/profile",
  authMiddleware,
  userController.getProfile.bind(userController)
);

userRoute.patch(
  "/profile",
  authMiddleware,
  userController.updateProfile.bind(userController)
);

userRoute.patch(
  "/password",
  authMiddleware,
  userController.changePassword.bind(userController)
);

userRoute.patch(
  "/preferences",
  authMiddleware,
  userController.updatePreferences.bind(userController)
);

export default userRoute;
