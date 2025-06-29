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
    // Daily tracking for free tier
    searchesUsedToday: v.optional(v.number()),
    lastSearchDate: v.optional(v.string()),
    // Meter-based billing tracking for pro tier
    monthlySearchCredits: v.optional(v.number()), // Total credits for the month
    searchCreditsUsed: v.optional(v.number()), // Credits used this month
    creditsResetDate: v.optional(v.string()), // When credits reset (ISO date)
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

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    lastMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_updated_at", ["userId", "updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.optional(v.id("users")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.optional(v.string()),
      content: v.optional(v.string()),
      favicon: v.optional(v.string()),
    }))),
    followUpQuestions: v.optional(v.array(v.string())),
    timestamp: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_timestamp", ["conversationId", "timestamp"]),
});
