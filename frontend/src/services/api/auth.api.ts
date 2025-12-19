import { publicAxiosInstance } from "../../services/axios";
import type { SignupSchemaType } from "../../lib/validations/auth.z.validation";

function extractErrorMessage(error: any): string {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export const authService = {
  signup: async (data: SignupSchemaType) => {
    try {
      const res = await publicAxiosInstance.post("/auth/signUp", data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  signin: async (email: string, password: string) => {
    try {
      const res = await publicAxiosInstance.post("/auth/signIn", {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  verifyEmail: async (email: string, token: string) => {
    try {
      const res = await publicAxiosInstance.patch(
        `/auth/verify-email?email=${email}&token=${token}`
      );
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await publicAxiosInstance.post("/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  resetPassword: async (
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      const res = await publicAxiosInstance.post("/auth/reset-password", {
        email,
        token,
        newPassword,
        confirmPassword,
      });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  logout: async () => {
    try {
      const res = await publicAxiosInstance.post("/auth/logout");
      return res.data;
    } catch (error) {
      // Even if the API call fails, we still want to logout on the frontend
      throw new Error(extractErrorMessage(error));
    }
  },
};
