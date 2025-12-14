import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  userName: string | null;
  email: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (data: { userName: string; email: string; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userName: null,
      email: null,
      accessToken: null,
      isAuthenticated: false,

      login: ({ userName, email, token }) =>
        set({
          userName,
          email,
          accessToken: token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          userName: null,
          email: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    { name: "auth-storage" }
  )
);
