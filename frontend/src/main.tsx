import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers/UserRouters";
import { Toaster } from "react-hot-toast";
import Snowfall from 'react-snowfall'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Snowfall color="#82C3D9"/>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />
  </StrictMode>
);
