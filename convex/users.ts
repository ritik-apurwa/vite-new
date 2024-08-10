import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const upsertUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        image: args.image,
        isOnline: true,
      });
      return { userId: existingUser._id, isAdmin: existingUser.isAdmin };
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        tokenIdentifier: args.tokenIdentifier,
        email: args.email,
        name: args.name,
        image: args.image,
        isOnline: true,
        isAdmin: false, // Default new users to non-admin
      });
      return { userId, isAdmin: false };
    }
  },
});

export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      image: args.image,
    });
  },
});

export const setUserOnline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, { isOnline: true });
  },
});

export const setUserOffline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, { isOnline: false });
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    try {
      // Wrap the logic in a transaction to avoid race conditions
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();

      if (existingUser) {
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          name: identity.name ?? existingUser.name,
          email: identity.email ?? existingUser.email,
          image: identity.pictureUrl ?? existingUser.image,
          isOnline: true,
        });
        return { userId: existingUser._id, isAdmin: existingUser.isAdmin };
      } else {
        // Create new user
        const userId = await ctx.db.insert("users", {
          tokenIdentifier: identity.tokenIdentifier,
          email: identity.email ?? "",
          name: identity.name ?? "",
          image: identity.pictureUrl ?? "",
          isOnline: true,
          isAdmin: false, // Default new users to non-admin
        });
        return { userId, isAdmin: false };
      }
    } catch (error) {
      // Handle potential errors, such as uniqueness constraint violations
      console.error("Error storing user:", error);
      throw new Error("Failed to store user");
    }
  },
});

export function isAdmin(user: any): boolean {
  return user?.isAdmin ?? false;
}