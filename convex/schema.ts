import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
});