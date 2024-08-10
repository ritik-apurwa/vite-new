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
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    const lastSignIn = new Date().toISOString();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        image: args.image,
        tokenIdentifier: args.tokenIdentifier,
        lastSignIn,
      });
      return { userId: existingUser._id, isAdmin: existingUser.isAdmin };
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        ...args,
        lastSignIn,
        isAdmin: false, // Default new users to non-admin
      });
      return { userId, isAdmin: false };
    }
  },
});

export const updateUser = internalMutation({
  args: { email: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      image: args.image,
    });
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const email = identity.email;
    if (!email) {
      throw new Error("User has no email");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const lastSignIn = new Date().toISOString();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        tokenIdentifier: identity.tokenIdentifier,
        name: identity.name ?? existingUser.name,
        image: identity.pictureUrl ?? existingUser.image,
        lastSignIn,
      });
      return { userId: existingUser._id, isAdmin: existingUser.isAdmin };
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        email,
        name: identity.name ?? "",
        image: identity.pictureUrl ?? "",
        isAdmin: false,
        lastSignIn,
      });
      return { userId, isAdmin: false };
    }
  },
});

export const isAdmin = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    
    return user?.isAdmin ?? false;
  },
});