import { Response } from "express";
import { AuthRequest } from "../../interfaces/api.interface";

export interface IUserController {
  getProfile(req: AuthRequest, res: Response): Promise<Response | void>;
  updateProfile(req: AuthRequest, res: Response): Promise<Response | void>;
  changePassword(req: AuthRequest, res: Response): Promise<Response | void>;
  updatePreferences(req: AuthRequest, res: Response): Promise<Response | void>;
}
