import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const emailLower = (params.email || "").toLowerCase().trim();
        const usernameLower = (params.username || "").toLowerCase().trim();
        const isAdmin =
          emailLower.includes("admin") ||
          usernameLower === "admin";

        return {
          email: params.email,
          username: params.username,
          role: isAdmin ? "admin" : "customer",
          isAdmin,
        };
      },
    }),
  ],
});