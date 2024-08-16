//blogs.ts here add the function which upload a new blog

import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";


export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});


export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogs").collect();
  },
});

export const getBlogByTitle = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);

    return await ctx.db
      .query("blogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("title"), blog?.title),
          q.neq(q.field("_id"), args.blogId)
        )
      )
      .collect();
  },
});

export const getBlogBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("blogs").order("desc").collect();
    }
    const authorSearch = await ctx.db
      .query("blogs")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }
    const titleSearch = await ctx.db
      .query("blogs")
      .withSearchIndex("search_title", (q) => q.search("title", args.search))
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }
    return await ctx.db
      .query("blogs")
      .withSearchIndex("search_body", (q) =>
        q.search("content" || "podcastTitle", args.search)
      )
      .take(10);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    author: v.string(),
    published: v.boolean(),
    category:v.string(), 
    images: v.array(
      v.object({
        url: v.string(),
        storageId: v.id("_storage"),
      })
    ),
  },
  handler: async (ctx, args) => {
    const newBlog = await ctx.db.insert("blogs", args);
    return newBlog;
  },
});

export const deleteBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    // Delete associated images from storage
    for (const image of blog.images) {
      await ctx.storage.delete(image.storageId);
    }
    await ctx.db.delete(args.blogId);
  },
});

export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    published: v.optional(v.boolean()),
    category:v.string(), 
    images: v.optional(
      v.array(
        v.object({
          url: v.string(),
          storageId: v.id("_storage"),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    const existingBlog = await ctx.db.get(id);
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // If new images are provided, delete old ones from storage
    if (updateData.images) {
      for (const oldImage of existingBlog.images) {
        const imageStillExists = updateData.images.some(
          (newImage) => newImage.storageId === oldImage.storageId
        );
        if (!imageStillExists) {
          await ctx.storage.delete(oldImage.storageId);
        }
      }
    }

    await ctx.db.patch(id, updateData);
  },
});


export const getBlog = query({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new ConvexError("Blog not found");
    }
    return blog;
  },
});


export const getBlogsNew = query({
  args: {
    limit: v.number(),
    cursor: v.optional(v.id("blogs")),
  },
  handler: async (ctx, args) => {
    const { limit, cursor } = args;

    let queryBuilder = ctx.db.query("blogs").order("desc");

    if (cursor) {
      queryBuilder = queryBuilder.filter((q) => q.lt(q.field("_id"), cursor));
    }

    const blogs = await queryBuilder.take(limit + 1);

    let nextCursor: Id<"blogs"> | null = null;
    if (blogs.length > limit) {
      const nextItem = blogs.pop();
      nextCursor = nextItem?._id ?? null;
    }

    return {
      blogs,
      nextCursor,
    };
  },
});

// ... (other functions remain the same)