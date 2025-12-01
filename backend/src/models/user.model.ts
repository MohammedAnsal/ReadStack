import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  preferences: string[];
  is_verified: boolean;
}

export const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  preferences: { type: [String], required: true },
  is_verified: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>("User", userSchema);
