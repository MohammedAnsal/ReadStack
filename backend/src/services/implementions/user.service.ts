import Container, { Service } from "typedi";
import { IUserService } from "../interfaces/user.Iservice";
import { IUserRepository } from "../../repositories/interfaces/user.Irepositroy";
import { userRepository } from "../../repositories/implementations/user.repository";
import { AppError } from "../../utils/customError.utils";
import { HttpStatus } from "../../enums/httpStatus.enum";
import { hashPassword } from "../../utils/password.utils";
import bcrypt from "bcryptjs";

@Service()
export class UserService implements IUserService {
  private userRepo: IUserRepository;

  constructor() {
    this.userRepo = userRepository;
  }

  private handleError(message: string, error: unknown): never {
    console.error(message, error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Something went wrong. Please try again later.",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async getProfile(userId: string) {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User not found", HttpStatus.NOT_FOUND);
      }

      // Exclude password from response
      const { password, ...userWithoutPassword } = user.toObject();

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      this.handleError("Get Profile Error:", error);
    }
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      dob?: Date;
    }
  ) {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User not found", HttpStatus.NOT_FOUND);
      }

      const updated = await this.userRepo.update(userId, data);

      if (!updated) {
        throw new AppError("Failed to update profile", HttpStatus.BAD_REQUEST);
      }

      const { password, ...userWithoutPassword } = updated.toObject();

      return {
        success: true,
        message: "Profile updated successfully",
        user: userWithoutPassword,
      };
    } catch (error) {
      this.handleError("Update Profile Error:", error);
    }
  }

  async changePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User not found", HttpStatus.NOT_FOUND);
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new AppError("Current password is incorrect", HttpStatus.BAD_REQUEST);
      }

      // Hash new password
      const hashedPassword = await hashPassword(data.newPassword);

      // Update password
      await this.userRepo.update(userId, { password: hashedPassword });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      this.handleError("Change Password Error:", error);
    }
  }

  async updatePreferences(userId: string, preferences: string[]) {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User not found", HttpStatus.NOT_FOUND);
      }

      const updated = await this.userRepo.update(userId, { preferences });

      if (!updated) {
        throw new AppError("Failed to update preferences", HttpStatus.BAD_REQUEST);
      }

      const { password, ...userWithoutPassword } = updated.toObject();

      return {
        success: true,
        message: "Preferences updated successfully",
        user: userWithoutPassword,
      };
    } catch (error) {
      this.handleError("Update Preferences Error:", error);
    }
  }
}

export const userService = Container.get(UserService);
