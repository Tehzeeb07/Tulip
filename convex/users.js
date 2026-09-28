import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const emailLower = (user.email || "").toLowerCase().trim();
    const usernameLower = (user.username || "").toLowerCase().trim();

    // Auto-detect admin status:
    // 1. Explicit database property: isAdmin === true or role === "admin"
    // 2. Email contains "admin" (e.g. admin@tulip.com, ammad.admin@gmail.com, etc.)
    // 3. Username is "admin"
    const isAdmin =
      user.isAdmin === true ||
      user.role === "admin" ||
      emailLower.includes("admin") ||
      usernameLower === "admin";

    const role = isAdmin ? "admin" : user.role || "customer";

    return {
      ...user,
      isAdmin,
      role,
    };
  },
});

export const setRole = mutation({
  args: {
    role: v.string(), // "admin" | "customer"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    const isAdmin = args.role === "admin";
    await ctx.db.patch(userId, {
      role: args.role,
      isAdmin,
    });
    return { success: true, role: args.role, isAdmin };
  },
});