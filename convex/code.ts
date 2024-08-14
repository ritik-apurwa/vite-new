import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCodes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("codes").collect();
  },
});

export const createCode = mutation({
  args: {
    file: v.array(
      v.object({
        fileName: v.string(),
        code: v.string(),
        language: v.string(),
      })
    ),
    title: v.string(),

    category: v.string(),
  },
  handler: async (ctx, args) => {
    const newBlog = await ctx.db.insert("codes", args);
    return newBlog;
  },
});

export const deleteCode = mutation({
  args: {
    codeId: v.id("codes"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.codeId);

    if (!podcast) {
      throw new ConvexError("Blog not found");
    }
    await ctx.db.delete(args.codeId);
  },
});

export const updateCode = mutation({
  args: {
    id: v.id("codes"),
    file: v.array(
      v.object({
        fileName: v.string(),
        code: v.string(),
        language: v.string(),
      })
    ),
    title: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
  },
});
export const getCode = query({
  args: { id: v.id("codes") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new ConvexError("Code Not  found");
    }
    return blog;
  },
});
