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
    role: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
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
  products: defineTable({
    id: v.string(),
    name: v.string(),
    price: v.number(),
    desc: v.string(),
    type: v.string(),
    occasion: v.optional(v.string()),
    category: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    image: v.string(),
    images: v.array(v.string()),
    careTips: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    palette: v.optional(v.string()), // "blush" | "amber" | "moody" | "botanical"
    space: v.optional(v.string()),   // "dining" | "bedside" | "living" | "desk"
    mood: v.optional(v.string()),    // "romantic" | "celebration" | "solace" | "everyday"
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_type", ["type"])
    .index("by_id", ["id"])
    .index("by_occasion", ["occasion"]),
});

