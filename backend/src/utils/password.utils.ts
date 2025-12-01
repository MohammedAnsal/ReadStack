import bcryptjs from "bcryptjs";
import { AppError } from "./customError.utils";
import { HttpStatus } from "../enums/httpStatus.enum";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    if (!password) {
      throw new AppError(
        "Password didn't reach the hashing function!",
        HttpStatus.BAD_REQUEST
      );
    }

    return await bcryptjs.hash(password, 10);
  } catch (error) {
    throw new AppError(
      "Failed to hash password",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const generateRandomPassword = (): string => {
  return Math.random().toString(36).slice(-8);
};

export const hashRandomPassword = async (): Promise<{
  raw: string;
  hashed: string;
}> => {
  const raw = generateRandomPassword();
  const hashed = await bcryptjs.hash(raw, 10);
  return { raw, hashed };
};
