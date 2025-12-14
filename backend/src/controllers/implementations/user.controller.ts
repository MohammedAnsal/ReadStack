import Container, { Service } from "typedi";
import { IUserController } from "../interfaces/user.Icontroller";
import { Response } from "express";
import { AuthRequest } from "../../interfaces/api.interface";
import { userService } from "../../services/implementions/user.service";
import { AppError } from "../../utils/customError.utils";
import { HttpStatus } from "../../enums/httpStatus.enum";
import { responseMessage } from "../../enums/responseMessage.enum";

@Service()
export class UserController implements IUserController {
  constructor() {}

  async getProfile(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const response = await userService.getProfile(userId);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Get Profile Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const response = await userService.updateProfile(userId, req.body);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Update Profile Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }

  async changePassword(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const response = await userService.changePassword(userId, req.body);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Change Password Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }

  async updatePreferences(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const { preferences } = req.body;
      if (!Array.isArray(preferences)) {
        throw new AppError("Preferences must be an array", HttpStatus.BAD_REQUEST);
      }

      const response = await userService.updatePreferences(userId, preferences);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Update Preferences Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }
}

export const userController = Container.get(UserController);
