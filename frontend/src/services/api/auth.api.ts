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
};
