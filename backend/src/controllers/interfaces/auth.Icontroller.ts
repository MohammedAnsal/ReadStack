import { Request, Response } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<Response>;
  signIn(req: Request, res: Response): Promise<any>;
  verifyEmail(req: Request, res: Response): Promise<any>;
}
