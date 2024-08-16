import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const codes = defineTable({
  file: v.array(
    v.object({
      fileName: v.string(),
      code: v.string(),
      language: v.string(), // Language type (CSS, TypeScript, React, etc.)
    })
  ),
  title: v.string(),
  category: v.string(),
});

export const blogsSchema = defineTable({
  title: v.string(),
  content: v.string(),
  author: v.string(),
  category: v.string(),
  images: v.array(
    v.object({
      url: v.string(),
      storageId: v.id("_storage"),
    })
  ),
  published: v.boolean(),
});

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    tokenIdentifier: v.string(),
    isAdmin: v.boolean(),
    lastSignIn: v.string(), // Store the last sign-in time as an ISO string
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_email", ["email"]),
  codes: codes
    .searchIndex("search_code_title", { searchField: "title" })
    .searchIndex("search_code_category", { searchField: "category" })
    .searchIndex("search_code_body", { searchField: "file" }),
  blogs: blogsSchema
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_body", { searchField: "content" }),
});
