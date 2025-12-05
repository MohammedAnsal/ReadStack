import { z } from "zod";

export const ARTICLE_CATEGORIES = [
  "Technology",
  "Health",
  "Education",
  "Lifestyle",
  "Finance",
  "Food",
  "Sports",
  "Travel",
] as const;

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(150, "Title is too long"),

  content: z
    .string()
    .min(10, "Content is too short")
    .refine((value) => value.replace(/<[^>]*>/g, "").trim().length > 0, {
      message: "Content cannot be empty",
    }),

  category: z
    .string()
    .refine((cat) => ARTICLE_CATEGORIES.includes(cat as any), {
      message: "Invalid category",
    }),

  image: z.string().optional().nullable(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  content: z.string().optional(),
  category: z
    .string()
    .refine((cat) => ARTICLE_CATEGORIES.includes(cat as any), {
      message: "Invalid category",
    })
    .optional(),
  image: z.string().optional().nullable(),
});

