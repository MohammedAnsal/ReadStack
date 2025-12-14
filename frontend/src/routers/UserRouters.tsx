import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../routers/authRoutes/ProtectRoute";
import LoginPage from "../pages/user/auth/SignIn";
import SignupPage from "../pages/user/auth/SignUp";
import { FeedPage } from "../pages/article/FeedPage";
import HomePage from "../pages/user/Home";
import { PublicRoute } from "./authRoutes/PublicRoute";
import VerifyEmailPage from "../pages/user/auth/VerifyEmail";
import SingleArticle from "../pages/article/SingleArticle";
import CreateArticle from "../pages/article/CreateArticle";
import EditArticle from "../pages/article/EditArticle";
import { Profile } from "../pages/user/profile/Profile";

export const UserRoutes: RouteObject[] = [
  { path: "/", element: <HomePage /> },

  {
    element: <PublicRoute />,
    children: [
      { path: "/auth/login", element: <LoginPage /> },
      { path: "/auth/signup", element: <SignupPage /> },
      { path: "/auth/verify-email", element: <VerifyEmailPage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/profile", element: <Profile /> },
      { path: "/articles/feed", element: <FeedPage /> },
      { path: "/articles/create", element: <CreateArticle /> },
      { path: "/articles/:id/edit", element: <EditArticle /> },
      { path: "/articles/:id", element: <SingleArticle /> },
    ],
  },

  { path: "*", element: <HomePage /> },
];

export const router = createBrowserRouter(UserRoutes);
