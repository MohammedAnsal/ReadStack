import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.routers";
import { dbConnection } from "./config/db.connetion";
import articleRouter from "./routers/article.routers";

dotenv.config({ debug: true });
dbConnection();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/articles", articleRouter);

const PORT = process.env.PORT || 6002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
