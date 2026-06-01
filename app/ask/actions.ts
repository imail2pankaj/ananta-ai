"use server";

import { createClient } from "@/lib/supabase";

export async function createConversationAction(title: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Conversation creation error:", error);
    return null;
  }

  return data.id;
}

export async function getConversationMessagesAction(conversationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Messages fetch error:", error);
    return [];
  }

  return data || [];
}

export async function checkUserSessionAction(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

