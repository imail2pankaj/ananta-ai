"use server";

import { createClient } from "@/lib/supabase";

export async function toggleBookmarkAction(verseId: string, shouldBookmark: boolean): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  if (shouldBookmark) {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ user_id: user.id, verse_id: verseId });
    if (error && error.code !== "23505") { // Ignore unique constraint violation error
      console.error("Bookmark insertion error:", error);
      return false;
    }
    return true;
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("verse_id", verseId);
    if (error) {
      console.error("Bookmark deletion error:", error);
      return false;
    }
    return true;
  }
}
