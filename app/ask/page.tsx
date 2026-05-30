import { createClient } from "@/lib/supabase";
import AskChatInterface from "@/components/AskChatInterface";

interface AskPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const revalidate = 0; // Dynamic server page

export default async function AskPage({ searchParams }: AskPageProps) {
  const { q = "" } = await searchParams;

  const supabase = await createClient();

  // RSC level Auth check
  const { data: { user } } = await supabase.auth.getUser();

  let conversations: any[] = [];

  if (user) {
    // Fetch historical conversations
    const { data } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    conversations = data || [];
  }

  return (
    <AskChatInterface
      user={user}
      conversations={conversations}
      initialQuery={q}
    />
  );
}
