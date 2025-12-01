import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/api.interface";
import { User } from "../models/user.model";
import { HttpStatus } from "../enums/httpStatus.enum";
import { responseMessage } from "../enums/responseMessage.enum";

export const authorization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: responseMessage.LOGIN_REQUIRED,
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: responseMessage.NOT_FOUND,
      });
    }

    if (!currentUser.is_verified) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "User not verified. Please verify your email to continue.",
      });
    }

    next();
  } catch (error) {
    console.error("Authorization Middleware Error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: responseMessage.ERROR_MESSAGE,
    });
  }
};
