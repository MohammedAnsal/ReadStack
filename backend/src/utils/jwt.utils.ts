import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN =
  process.env.ACCESS_TOKE ||
  "5b31b8a136aea4e77156c90072185cc0bc2f31e784129b569f8b8dc2082ce8cd";

const REFRESH_SECRET =
  process.env.REFRESH_SECRET ||
  "39769aee2efe8ef7df54a4c4e4f0f5161e657fd0c8cffbae50afee9c6df53cc1";

const VERIFY_EMAIL_SECRET =
  process.env.VERIFY_EMAIL_SECRET || "yV9rZlD5rQsG3T2nH7uXpJk4SvWtMnBb";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "24h" });
};

export const generateRefreashToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

//  For generating email verification :-

export const generateEmailVerificationToken = (email: string) => {
  return jwt.sign({ email }, VERIFY_EMAIL_SECRET, { expiresIn: "1d" });
};

//  Verify token :-

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN);
  } catch (error) {
    return null;
  }
};

//  Verify Email Token :-

export const verifyEmailToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET!) as {
      email: string;
    };
    return decoded.email;
  } catch (error) {
    throw new Error("Invalid or expired verification token");
  }
};
