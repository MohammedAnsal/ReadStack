import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    email: z.string().email("Invalid email format"),

    phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),

    dob: z
      .string()
      .or(z.date())
      .refine(
        (value) => {
          const date = typeof value === "string" ? new Date(value) : value;
          return !isNaN(date.getTime());
        },
        { message: "Invalid date of birth" }
      )
      .transform((value) =>
        typeof value === "string" ? new Date(value) : value
      ),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Password must contain at least one letter and one number"
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),

    preferences: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
      "Password must contain at least one letter and one number"
    ),
});
