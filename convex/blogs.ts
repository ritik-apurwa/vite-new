//blogs.ts here add the function which upload a new blog

import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const GetStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const GetAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogs").collect();
  },
});

export const GetBlogByTitle = query({
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

export const CreateBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    author: v.string(),
    category: v.string(),
    imageId: v.array(
      v.object({
        url: v.string(),
        storageId: v.id("_storage"),
      })
    ),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const newBlog = await ctx.db.insert("blogs", args);
    return newBlog;
  },
});

export const UpdateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.string(),
    content: v.string(),
    author: v.string(),
    category: v.string(),
    imageId: v.array(
      v.object({
        url: v.string(),
        storageId: v.id("_storage"),
      })
    ),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    const existingBlog = await ctx.db.get(id);
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // Remove any fields that are not in the schema
    const { _creationTime, _id, ...cleanUpdateData } = updateData as any;

    await ctx.db.patch(id, cleanUpdateData);
    return await ctx.db.get(id);
  },
});

export const DeleteBlog = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Delete associated images from storage
    for (const image of blog.imageId) {
      await ctx.storage.delete(image.storageId);
    }

    await ctx.db.delete(args.id);
  },
});
export const SearchBlogsQuery = query({
  args: {
    search: v.string(),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db.query("blogs");

    if (args.author) {
      queryBuilder = queryBuilder.filter((q) => q.eq(q.field("author"), args.author));
    }
    if (args.category) {
      queryBuilder = queryBuilder.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.search !== "") {
      // Use the appropriate search index based on your schema
      const authorResults = await queryBuilder
        .withSearchIndex("search_author", (q) => q.search("author", args.search))
        .collect();

      if (authorResults.length > 0) {
        return authorResults;
      }

      const titleResults = await queryBuilder
        .withSearchIndex("search_title", (q) => q.search("title", args.search))
        .collect();

      if (titleResults.length > 0) {
        return titleResults;
      }

      const contentResults = await queryBuilder
        .withSearchIndex("search_body", (q) => q.search("content", args.search))
        .collect();

      return contentResults;
    }

    // If no search term, return all results
    return await queryBuilder.collect();
  },
});
export const GetLimitedBlogs = query({
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

export const GetBlogID = query({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new ConvexError("Blog not found");
    }
    return blog;
  },
});

export const GetUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});


export const DeleteUnusedImages = mutation({
  args: { imageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    for (const imageId of args.imageIds) {
      await ctx.storage.delete(imageId);
    }
  },
});

export const GetUniqueAuthors = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();
    const uniqueAuthors = Array.from(new Set(blogs.map(blog => blog.author)));
    return uniqueAuthors;
  },
});

export const GetUniqueCategories = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();
    const uniqueCategories = Array.from(new Set(blogs.map(blog => blog.category)));
    return uniqueCategories;
  },
});