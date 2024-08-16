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

export const getCodeBySearch = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("codes").order("desc").collect();
    }

    const codeTitleSearch = await ctx.db
      .query("codes")
      .withSearchIndex("search_code_title", (q) =>
        q.search("title", args.search)
      )
      .take(10);

    if (codeTitleSearch.length > 0) {
      return codeTitleSearch;
    }
   

    const codeCategorySearch = await ctx.db
      .query("codes")
      .withSearchIndex("search_code_category", (q) =>
        q.search("category", args.search)
      )
      .take(10);

    if (codeCategorySearch.length > 0) {
      return codeCategorySearch;
    }

    return await ctx.db
      .query("codes")
      .withSearchIndex("search_code_body", (q) => q.search("file", args.search))
      .take(10);
  },
});




















export const getCodeByCategory = query({
  args: {
    codeId: v.id("codes"),
  },
  handler: async (ctx, args) => {
    const codeCategory = await ctx.db.get(args.codeId);

    return await ctx.db
      .query("codes")
      .filter((q) =>
        q.and(
          q.eq(q.field("category"), codeCategory?.category),
          q.neq(q.field("_id"), args.codeId)
        )
      ).collect();
  },
});


export const getCodesWithFileCode = query({
  args: {},
  handler: async (ctx) => {
    const codesWithFileCode = await ctx.db
      .query("codes")
      .collect();

    // Process the results to extract the desired fields
    return codesWithFileCode.map(doc => ({
      _id: doc._id,
      title: doc.title,
      category: doc.category,
      fileCodes: doc.file.map(f => f.code)
    }));
  },
});