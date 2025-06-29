import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSearch = mutation({
  args: {
    userId: v.id("users"),
    query: v.string(),
    response: v.string(),
    sources: v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.optional(v.string()),
    })),
    followUpQuestions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const searchId = await ctx.db.insert("searches", {
      userId: args.userId,
      query: args.query,
      response: args.response,
      sources: args.sources,
      followUpQuestions: args.followUpQuestions,
      timestamp: Date.now(),
    });

    return searchId;
  },
});

export const getUserSearches = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    return await ctx.db
      .query("searches")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

export const getSearchById = query({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.searchId);
  },
});

export const getUserSearchCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const searches = await ctx.db
      .query("searches")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
    
    return searches.length;
  },
});
