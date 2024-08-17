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
    published: v.boolean(),
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

export const UpdateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.string(),
    content: v.string(),
    author: v.string(),
    category: v.string(),
    published: v.boolean(),
    images: v.array(
      v.object({
        url: v.string(),
        storageId: v.id("_storage"),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    const existingBlog = await ctx.db.get(id);
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // Delete removed images from storage
    const removedImages = existingBlog.images.filter(
      (oldImage) =>
        !args.images.some(
          (newImage) => newImage.storageId === oldImage.storageId
        )
    );
    for (const image of removedImages) {
      await ctx.storage.delete(image.storageId);
    }

    await ctx.db.replace(id, updateData);
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
    for (const image of blog.images) {
      await ctx.storage.delete(image.storageId);
    }

    await ctx.db.delete(args.id);
  },
});

export const DeleteBlogImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});

export const SearchBlogsQuery = query({
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
