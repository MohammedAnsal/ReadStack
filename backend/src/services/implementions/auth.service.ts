import Container, { Service } from "typedi";
import bcrypt from "bcryptjs";
import { HttpStatus } from "../../enums/httpStatus.enum";
import { responseMessage } from "../../enums/responseMessage.enum";
import {
  SignInResponse,
  SignUpResponse,
} from "../../interfaces/auth.interfaces";
import { userRepository } from "../../repositories/implementations/user.repository";
import { IUserRepository } from "../../repositories/interfaces/user.Irepositroy";
import { AppError } from "../../utils/customError.utils";
import { IAuthService } from "../interfaces/auth.Iservice";
import { hashPassword } from "../../utils/password.utils";
import { SignInDTO, SignUpDTO } from "../../dtos/auth.dto";
import { IUser } from "../../models/user.model";
import { sendVerificationEmail } from "../../utils/email.utils";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreashToken,
  verifyEmailToken,
} from "../../utils/jwt.utils";

@Service()
export class AuthService implements IAuthService {
  private userRepo: IUserRepository;

  constructor() {
    this.userRepo = userRepository;
  }

  async signUp(data: SignUpDTO): Promise<SignUpResponse> {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        password,
        confirmPassword,
        preferences,
      } = data;

      if (password !== confirmPassword) {
        throw new AppError("Password  do not match.", HttpStatus.BAD_REQUEST);
      }

      const existingUser = await this.userRepo.findByEmail(email);

      if (existingUser) {
        if (existingUser.is_verified) {
          throw new AppError(
            responseMessage.USER_ALREADY_EXISTS,
            HttpStatus.BAD_REQUEST
          );
        } else {
          throw new AppError(
            "User already registered but not verified. Please verify your email.",
            HttpStatus.BAD_REQUEST
          );
        }
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await this.userRepo.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        password: hashedPassword,
        preferences,
      } as IUser);

      const verificationEmailToken = generateEmailVerificationToken(email);

      await sendVerificationEmail({
        email,
        name: firstName + lastName,
        token: verificationEmailToken,
      });

      return {
        status: true,
        message: "Success! A verification link was sent to your inbox.",
        email: newUser.email,
      };
    } catch (error) {
      console.error("SignUp Error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyEmail(email: string, token: string): Promise<SignInResponse> {
    try {
      const existingUser = await this.userRepo.findByEmail(email);

      if (!existingUser) {
        throw new AppError(
          "User not found. Please register again.",
          HttpStatus.NOT_FOUND
        );
      }

      if (existingUser && existingUser.is_verified)
        throw new AppError(
          "Already verified email, please login",
          HttpStatus.BAD_REQUEST
        );

      const decodedEmail = verifyEmailToken(token);

      if (decodedEmail !== email)
        throw new AppError(
          "Verification link is invalid or expired. Please request a new one.",
          HttpStatus.UNAUTHORIZED
        );

      await this.userRepo.verifyUser(email, true);

      const accessToken = generateAccessToken({ id: existingUser._id });

      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: "Email verified successfully",
        email: existingUser.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Verify Email Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signIn(data: SignInDTO): Promise<SignInResponse> {
    try {
      const { email, password } = data;

      const existingUser = await this.userRepo.findByEmail(email);

      if (!existingUser)
        throw new AppError("Invalid Credentials", HttpStatus.BAD_REQUEST);

      if (!existingUser.is_verified)
        throw new AppError(
          "Email not verified. Please verify your email.",
          HttpStatus.UNAUTHORIZED
        );

      const comparePassword = await bcrypt.compare(
        password,
        existingUser?.password
      );
      if (!comparePassword)
        throw new AppError("Incorrect password", HttpStatus.BAD_REQUEST);

      const accessToken = generateAccessToken({ id: existingUser._id });

      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: "Sign in successfully completed",
        email: existingUser.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("SignIn Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = Container.get(AuthService);
