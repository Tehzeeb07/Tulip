import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    productId: v.string(),
    productName: v.string(),
    price: v.number(),
    size: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to place an order");
    }

    const orderId = await ctx.db.insert("orders", {
      userId,
      productId: args.productId,
      productName: args.productName,
      price: args.price,
      size: args.size,
      notes: args.notes,
      status: "confirmed",
      createdAt: Date.now(),
    });

    return orderId;
  },
});

export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
