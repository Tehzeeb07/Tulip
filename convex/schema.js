import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  favorites: defineTable({
    userId: v.id("users"),
    productId: v.string(),
  }).index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
});