import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all conversations for a user
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_updated_at", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    
    return conversations;
  },
});

// Get a single conversation with messages
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .collect();
    
    // Sort by timestamp or createdAt
    messages.sort((a, b) => {
      const aTime = a.timestamp || a.createdAt || 0;
      const bTime = b.timestamp || b.createdAt || 0;
      return aTime - bTime;
    });

    return {
      ...conversation,
      messages,
    };
  },
});

// Create a new conversation
export const createConversation = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    firstMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const conversationId = await ctx.db.insert("conversations", {
      userId: args.userId,
      title: args.title,
      lastMessage: args.firstMessage.substring(0, 100),
      createdAt: now,
      updatedAt: now,
    });

    // Add the first user message
    await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "user",
      content: args.firstMessage,
      timestamp: now,
    });

    return conversationId;
  },
});

// Add a message to a conversation
export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.optional(v.string()),
    }))),
    followUpQuestions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Add the message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      userId: args.userId,
      role: args.role,
      content: args.content,
      sources: args.sources,
      followUpQuestions: args.followUpQuestions,
      timestamp: now,
    });

    // Update conversation's last message and timestamp
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content.substring(0, 100),
      updatedAt: now,
    });

    return messageId;
  },
});

// Delete a conversation
export const deleteConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    // Delete all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the conversation
    await ctx.db.delete(args.conversationId);
  },
});

// Update conversation title
export const updateConversationTitle = mutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});