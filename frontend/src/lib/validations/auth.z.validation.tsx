import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),

    email: z.string().email("Invalid email format"),

    phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),

    dob: z
      .string()
      .refine(
        (value) => !isNaN(new Date(value).getTime()),
        "Invalid date of birth"
      ),

    preferences: z.string().optional(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
        "Password must contain at least one number"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
