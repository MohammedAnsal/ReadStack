import { IUser } from "../../models/user.model";

export interface IUserService {
  getProfile(userId: string): Promise<{
    success: boolean;
    user: Partial<IUser>;
  }>;

  updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      dob?: Date;
    }
  ): Promise<{
    success: boolean;
    message: string;
    user: Partial<IUser>;
  }>;

  changePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  updatePreferences(
    userId: string,
    preferences: string[]
  ): Promise<{
    success: boolean;
    message: string;
    user: Partial<IUser>;
  }>;
}
