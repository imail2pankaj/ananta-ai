-- SQL Schema Migration for Ananta User Tables and pgvector Search

-- 1. Enable vector extension (should be enabled for verse_interpretations already)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. Create Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id UUID NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, verse_id)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 6. Setup RLS Policies

-- Conversations: Users can manage only their own conversations
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: Users can manage messages in their own conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages into their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Bookmarks: Users can manage only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Database performance indexes
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);

-- 8. Create pgvector Cosine Distance Search function for Ananta Ask Experience
CREATE OR REPLACE FUNCTION match_verses(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  verse_id uuid,
  verse_number int,
  chapter_number int,
  scripture_name text,
  speaker text,
  sanskrit_text text,
  transliteration text,
  translation text,
  commentary text,
  author_name text,
  similarity float
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id AS verse_id,
    v.verse_number,
    c.chapter_number,
    s.name AS scripture_name,
    v.speaker,
    v.sanskrit_text,
    v.transliteration,
    vi.translation,
    vi.commentary,
    a.name AS author_name,
    1 - (vi.embedding <=> query_embedding) AS similarity
  FROM verse_interpretations vi
  JOIN verses v ON vi.verse_id = v.id
  JOIN chapters c ON v.chapter_id = c.id
  JOIN scriptures s ON c.scripture_id = s.id
  JOIN authors a ON vi.author_id = a.id
  WHERE vi.embedding IS NOT NULL AND 1 - (vi.embedding <=> query_embedding) > match_threshold
  ORDER BY vi.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
