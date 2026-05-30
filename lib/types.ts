// TypeScript Types for Ananta Database Schema

export interface Scripture {
  id: string;
  slug: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  scripture_id: string;
  chapter_number: number;
  sanskrit_name: string;
  english_name: string;
  transliteration: string;
  meaning_en?: string;
  meaning_hi?: string;
  summary_en?: string;
  summary_hi?: string;
  verses_count: number;
  created_at: string;
}

export interface Verse {
  id: string;
  chapter_id: string;
  verse_number: number;
  external_id?: string;
  speaker: string;
  sanskrit_text: string;
  transliteration: string;
  created_at: string;
}

export interface Author {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface VerseInterpretation {
  id: string;
  verse_id: string;
  author_id: string;
  translation?: string;
  commentary?: string;
  language: string;
  embedding?: number[];
  created_at: string;
}

// User & AI Experience Types
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  verse_id: string;
  created_at: string;
}

// Joined Query Types
export interface VerseWithDetails {
  verse_id: string;
  verse_number: number;
  chapter_number: number;
  scripture_name: string;
  speaker: string;
  sanskrit_text: string;
  transliteration: string;
  translation?: string;
  commentary?: string;
  author_name: string;
  similarity?: number;
}
