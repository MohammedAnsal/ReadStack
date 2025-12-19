import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "../../dtos/auth.dto";
import {
  SignInResponse,
  SignUpResponse,
} from "../../interfaces/auth.interfaces";

export interface IAuthService {
  signUp(data: SignUpDTO): Promise<SignUpResponse>;
  verifyEmail(email: string, token: string): Promise<SignInResponse>;
  signIn(data: SignInDTO): Promise<SignInResponse>;
  requestPasswordReset(
    data: ForgotPasswordDTO
  ): Promise<{ status: boolean; message: string }>;
  resetPassword(
    data: ResetPasswordDTO
  ): Promise<{ status: boolean; message: string }>;
}
