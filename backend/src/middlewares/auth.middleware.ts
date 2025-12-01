import { NextFunction, Response } from "express";
import { HttpStatus } from "../enums/httpStatus.enum";
import { verifyAccessToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../interfaces/api.interface";
import { responseMessage } from "../enums/responseMessage.enum";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Access denied. No token provided" });
    }

    const decodedToken = verifyAccessToken(token) as JwtPayload;
    const userId = decodedToken.id;

    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: responseMessage.ACCESS_DENIED });
    }

    req.user = { id: userId };
    return next();
  } catch (error) {
    console.error("Auth Middleware Error:", (error as Error).message);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: (error as Error).message });
  }
};
