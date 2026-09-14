// convex/functions/users/updateAvatar.js
import { mutation } from "convex/dev";

export default mutation(async ({ db, auth }, { avatarUrl }) => {
  const userId = auth.userId;
  if (!userId) throw new Error("Not authenticated");

  // Patch the user record with the avatarUrl. Replace 'users' with your users table name if different.
  await db.patch("users", userId, { avatarUrl });

  // Return the updated user so the client query will reflect the change
  return await db.get("users", userId);
});