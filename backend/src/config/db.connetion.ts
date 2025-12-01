import { connect } from "mongoose";

export const dbConnection = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    if (!mongoUri) {
      throw new Error("MONGO_URL is not defined in the environment variables");
    }

    connect(mongoUri)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("Error while connecting to MongoDB:", err));
  } catch (error) {
    console.log("error when connecting DB...!");
  }
};
