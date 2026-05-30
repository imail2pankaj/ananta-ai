import { createClient } from "@/lib/supabase";
import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export const maxDuration = 30; // Max time on Vercel hobby

export async function POST(request: Request) {
  try {
    const { query, conversationId } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 });
    }

    // 1. Generate query embedding using OpenAI text-embedding-3-small
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Query Supabase vector similarity RPC function
    const supabase = await createClient();
    const { data: matchedVerses, error: rpcError } = await supabase.rpc("match_verses", {
      query_embedding: queryEmbedding,
      match_threshold: 0.3,
      match_count: 3,
    });

    if (rpcError) {
      console.error("Vector RPC search error:", rpcError);
      return NextResponse.json({ error: "Failed to perform database search" }, { status: 500 });
    }

    // 3. Construct rich context text for the LLM (truncating long commentaries to save massive tokens)
    let contextText = "";
    if (matchedVerses && matchedVerses.length > 0) {
      contextText = matchedVerses
        .map((row: any) => {
          const cleanCommentary = row.commentary && row.commentary.length > 700
            ? row.commentary.substring(0, 700) + "..."
            : row.commentary || "";

          return `
Verse: ${row.scripture_name} Chapter ${row.chapter_number}, Verse ${row.verse_number}
Speaker: ${row.speaker}
Sanskrit Text: ${row.sanskrit_text}
Transliteration: ${row.transliteration}
Commentary/Translation (${row.author_name}):
${row.translation || ""}
${cleanCommentary}
-------------------------------------------------------`;
        })
        .join("\n");
    } else {
      contextText = "No direct vector matches found. Please fallback to core Bhagavad Gita concepts (like duty/Karma, detachment, self-realization, and devotion).";
    }

    // 4. Formulate the system prompt based on Ananta's AI identity rules
    const systemPrompt = `You are Ananta, a wise, deeply warm, and compassionate AI scripture guide focusing on the Bhagavad Gita.
Act as a comforting, experienced spiritual mentor who understands emotional struggles (anxiety, grief, failure, stress)—never robotic, cold, or academic.
Avoid dogma, predictions, or replacing professional medical/mental therapy. Relate ancient truths to modern struggles naturally.

Ground answers strictly in the retrieved context. Cite sources.
Structure your output exactly as follows with clean Markdown headers:

### Summary
[Warm, highly human-like overview addressing the user's struggle from the heart.]

### Relevant Guidance
[A comforting mentor breakdown of teachings and commentaries, translating Sanskrit truths to modern life.]

### Key Verse
**Sanskrit Slok:**
[Most relevant original Sanskrit text]

**Transliteration:**
[Transliteration]

**Translation:**
[Standard English translation]

### Practical Reflection
* [Self-reflection question to reframe thoughts today.]
* [Another reflection prompt.]

### Suggested Action
* [Simple, highly actionable practice for today (e.g., breathing check, reframe, boundary).]

### Referenced Verses
* [Bhagavad Gita Chapter X, Verse Y]
`;

    const userPrompt = `User's modern life challenge: "${query}"

Here is the retrieved authentic scripture context to base your response on:
${contextText}`;

    // 5. Query OpenAI Chat Completion (using gpt-4o for highest quality grounded outputs with token optimization)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 800, // Safe output token ceiling to optimize response cost
    });

    const answer = completion.choices[0].message.content;

    // 6. Save message history to Supabase if authenticated and a conversation ID is present
    const { data: { user } } = await supabase.auth.getUser();
    if (user && conversationId) {
      // Save User message
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: query,
      });

      // Save Assistant response
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: answer || "",
      });
    }

    return NextResponse.json({
      answer,
      matchedVerses: matchedVerses || [],
    });
  } catch (error: any) {
    console.error("Ask API error:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
