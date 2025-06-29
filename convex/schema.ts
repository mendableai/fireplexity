import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    workosId: v.optional(v.string()),
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    subscriptionTier: v.optional(v.union(v.literal("free"), v.literal("pro"))),
    subscriptionStatus: v.optional(v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    )),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
    searchesUsedToday: v.optional(v.number()),
    lastSearchDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workos_id", ["workosId"])
    .index("by_email", ["email"])
    .index("by_polar_customer_id", ["polarCustomerId"]),

  searches: defineTable({
    userId: v.id("users"),
    query: v.string(),
    response: v.string(),
    sources: v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.optional(v.string()),
    })),
    followUpQuestions: v.array(v.string()),
    timestamp: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    polarSubscriptionId: v.string(),
    polarCustomerId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    tier: v.union(v.literal("free"), v.literal("pro")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_polar_subscription_id", ["polarSubscriptionId"])
    .index("by_polar_customer_id", ["polarCustomerId"]),
});
