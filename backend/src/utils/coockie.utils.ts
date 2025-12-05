import { Response } from "express";
import dotenv from "dotenv";

dotenv.config({ debug: true });

export const setCookie = (res: Response, type: string, token: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(type, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};
