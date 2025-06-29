import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    workosId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      if (!existingUser.workosId) {
        await ctx.db.patch(existingUser._id, {
          workosId: args.workosId,
          subscriptionTier: existingUser.subscriptionTier || "free",
          subscriptionStatus: existingUser.subscriptionStatus || "active",
          searchesUsedToday: existingUser.searchesUsedToday || 0,
          lastSearchDate: existingUser.lastSearchDate || new Date().toISOString().split('T')[0],
          updatedAt: Date.now(),
        });
      }
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      workosId: args.workosId,
      email: args.email,
      name: args.name,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      searchesUsedToday: 0,
      lastSearchDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const getUserByWorkosId = query({
  args: { workosId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email")
      .filter((q) => q.eq(q.field("workosId"), args.workosId))
      .first();
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateUserSubscription = mutation({
  args: {
    userId: v.id("users"),
    subscriptionTier: v.union(v.literal("free"), v.literal("pro")),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      subscriptionTier: args.subscriptionTier,
      subscriptionStatus: args.subscriptionStatus,
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
      updatedAt: Date.now(),
    });
  },
});

export const incrementSearchCount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split('T')[0];
    const currentSearches = user.searchesUsedToday || 0;
    const searchesUsedToday = user.lastSearchDate === today ? currentSearches + 1 : 1;

    await ctx.db.patch(args.userId, {
      searchesUsedToday,
      lastSearchDate: today,
      updatedAt: Date.now(),
    });

    return searchesUsedToday;
  },
});

export const canUserSearch = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return false;

    if (user.subscriptionTier === "pro" && user.subscriptionStatus === "active") {
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    const currentSearches = user.searchesUsedToday || 0;
    const searchesUsedToday = user.lastSearchDate === today ? currentSearches : 0;
    
    return searchesUsedToday < 10;
  },
});
