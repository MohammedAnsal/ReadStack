import { publicAxiosInstance } from "../../services/axios";
import type { SignupSchemaType } from "../../lib/validations/auth.z.validation";

export const authService = {
  signup: async (data: SignupSchemaType) => {
    const res = await publicAxiosInstance.post("/auth/signUp", data);
    return res.data;
  },

  signin: async (email: string, password: string) => {
    const res = await publicAxiosInstance.post("/auth/signIn", {
      email,
      password,
    });
    return res.data;
  },

  verifyEmail: async (email: string, token: string) => {
    const res = await publicAxiosInstance.patch(
      `/auth/verify-email?email=${email}&token=${token}`
    );
    return res.data;
  },
};
