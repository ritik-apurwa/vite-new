import { Id } from "@convex/_generated/dataModel";
import { z } from "zod";

export type languageTypes =
  | "css"
  | "typescript"
  | "React"
  | "node-repl"
  | "javascript";

export type CodeCategories = "CSS" | "HTML" | "JS" | "React" | "Next.js";
export interface CodeFile {
  filename: string;
  code: string;
  language: string;
}

export interface CodeFileArray {
  id: string | number;
  file: CodeFile[];
  title: string;
  description: string;
  category: string;
  createdAt?: number;
}


const codeFileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Language is required"),
});
export const codeSchemaZod = z.object({
  file: z.array(codeFileSchema).min(1, "At least one file is required"),
  title: z.string().min(10, "Title must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

export const blogSchemaZod = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(150, "Title should not exceed 50 characters"),
  content: z
    .string()
    .min(50, "Content must be at least 50 characters long")
    .max(2000, "Content should not exceed 2000 characters"),
  author: z
    .string()
    .min(3, "Author name must be at least 3 characters long")
    .max(50, "Author name should not exceed 50 characters"),
  published: z.boolean(),
});
