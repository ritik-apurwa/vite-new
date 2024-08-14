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
  published: v.boolean(),
});

export const newBlogSchema = defineTable({
  user: v.id("user"),
  blogTitle: v.string(),
  blogDescription: v.string(),
  blogAuthor: v.string(),
  blogCategory: v.string(),
  blogViews: v.number(),
  imageUrl: v.optional(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
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
  codes: codes,
  blogs: blogsSchema
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_body", { searchField: "content" }),
});
