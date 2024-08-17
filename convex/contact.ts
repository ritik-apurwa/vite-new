import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const CreateContactForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contactForm = await ctx.db.insert("contacts", args);
    return contactForm;
  },
});

export const GetContactFormById = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    const contactForm = await ctx.db.get(args.id);
    if (!contactForm) {
      throw new ConvexError("contact form not found");
    }
  },
});

export const GetAllContactForms = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("contacts").order("desc").collect();
  },
});



export const GetLimitedContactForms = query({
  args: {
    limit: v.number(),
    cursor: v.optional(v.id("contacts")),
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit, cursor, search } = args;

    let queryBuilder = ctx.db.query("contacts").order("desc");

    if (cursor) {
      queryBuilder = queryBuilder.filter((q) => q.lt(q.field("_id"), cursor));
    }

    if (search) {
      const searchResults = await Promise.all([
        ctx.db
          .query("contacts")
          .withSearchIndex("search_contact_name", (q) =>
            q.search("name", search)
          )
          .take(limit),
        ctx.db
          .query("contacts")
          .withSearchIndex("search_contact_email", (q) =>
            q.search("email", search)
          )
          .take(limit),
        ctx.db
          .query("contacts")
          .withSearchIndex("search_contact_body", (q) =>
            q.search("message", search)
          )
          .take(limit),
      ]);

      const combinedResults = searchResults.flat();
      const uniqueResults = Array.from(
        new Map(combinedResults.map((item) => [item._id, item])).values()
      );

      const sortedResults = uniqueResults.sort(
        (a, b) => b._creationTime - a._creationTime
      );

      const contact_forms = sortedResults.slice(0, limit + 1);
      let nextCursor: Id<"contacts"> | null = null;
      if (contact_forms.length > limit) {
        const nextItem = contact_forms.pop();
        nextCursor = nextItem?._id ?? null;
      }

      return {
        contact_forms,
        nextCursor,
      };
    }

    const contact_forms = await queryBuilder.take(limit + 1);
    let nextCursor: Id<"contacts"> | null = null;
    if (contact_forms.length > limit) {
      const nextItem = contact_forms.pop();
      nextCursor = nextItem?._id ?? null;
    }

    return {
      contact_forms,
      nextCursor,
    };
  },
});
export const DeleteContactForm = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});