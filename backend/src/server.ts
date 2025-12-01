import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.routers";
import { dbConnection } from "./config/db.connetion";

dotenv.config({ debug: true });
dbConnection();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 6002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
