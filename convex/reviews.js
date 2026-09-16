import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const createReview = mutation({
  args: {
    userName: v.string(),
    occasion: v.string(),
    rating: v.number(),
    quote: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to post a review");
    }

    const user = await ctx.db.get(userId);
    const authorName =
      args.userName.trim() ||
      user?.name ||
      user?.username ||
      "Verified Customer";

    const reviewId = await ctx.db.insert("reviews", {
      userId,
      userName: authorName,
      occasion: args.occasion.trim() || "Everyday",
      rating: Math.max(1, Math.min(5, args.rating)),
      quote: args.quote.trim(),
      images: args.images || [],
      createdAt: Date.now(),
    });
    return reviewId;
  },
});

export const deleteReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reviewId);
  },
});

export const deleteLatestReview = mutation({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("reviews")
      .withIndex("by_created_at")
      .order("desc")
      .first();
    if (latest) {
      await ctx.db.delete(latest._id);
      return latest._id;
    }
    return null;
  },
});
