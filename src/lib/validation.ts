// Validation Schemas for signUp and signIn, use Zod on the frontend and backend for checks

import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().trim().min(1, "Required").email("Invalid email"),
  username: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, underscores and dashes are allowed",
    ),
  password: z
    .string()
    .trim()
    .min(1, "Required")
    .min(8, "Password must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Required"),
  password: z.string().trim().min(1, "Required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  // content: requiredString,
  content: z.string().nonempty({ message: "Required" }),
});
