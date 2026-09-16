import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    username: v.optional(v.string()),
  }).index("email", ["email"]),
  favorites: defineTable({
    userId: v.id("users"),
    productId: v.string(),
  }).index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
  orders: defineTable({
    userId: v.id("users"),
    productId: v.string(),
    productName: v.string(),
    price: v.number(),
    size: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  reviews: defineTable({
    userId: v.optional(v.id("users")),
    userName: v.string(),
    occasion: v.string(),
    rating: v.number(),
    quote: v.string(),
    images: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
});