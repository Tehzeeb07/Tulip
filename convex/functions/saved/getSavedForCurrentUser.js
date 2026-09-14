// convex/functions/saved/getSavedForCurrentUser.js
import { query } from "convex/dev";

/*
 Return an array of saved bouquet rows for the authenticated user.

 Adjust the table names or fallback logic if your schema differs.
 - Tries a "savedBouquets" table with an index "byUser".
 - Otherwise falls back to reading user.savedIds and fetching from "bouquets".
*/
export default query(async ({ db, auth }) => {
  const userId = auth.userId;
  if (!userId) return [];

  // Try a 'savedBouquets' table keyed by user (common pattern).
  try {
    const savedRows = await db
      .query("savedBouquets")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    if (savedRows.length > 0) return savedRows;
  } catch (e) {
    // ignore if table/index doesn't exist; fallback below
    console.debug("savedBouquets query failed or table missing:", e?.message ?? e);
  }

  // Fallback: load saved IDs from the user document and fetch bouquets
  try {
    const user = await db.get("users", userId);
    if (!user) return [];

    if (Array.isArray(user.savedIds) && user.savedIds.length > 0) {
      const bouquetPromises = user.savedIds.map((id) => db.get("bouquets", id));
      const bouquets = (await Promise.all(bouquetPromises)).filter(Boolean);
      return bouquets;
    }
  } catch (e) {
    console.debug("fallback user/bouquets fetch failed:", e?.message ?? e);
  }

  return [];
});