"use server";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = formData.get("next") as string || "/";

  if (!email || !password) {
    const errorUrl = `/auth/login?error=All fields are required${next ? `&next=${encodeURIComponent(next)}` : ""}`;
    return redirect(errorUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorUrl = `/auth/login?error=${encodeURIComponent(error.message)}${next ? `&next=${encodeURIComponent(next)}` : ""}`;
    return redirect(errorUrl);
  }

  return redirect(next);
}

export async function signupWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = formData.get("next") as string || "/";

  if (!email || !password) {
    const errorUrl = `/auth/login?error=All fields are required${next ? `&next=${encodeURIComponent(next)}` : ""}`;
    return redirect(errorUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.SUPABASE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const errorUrl = `/auth/login?error=${encodeURIComponent(error.message)}${next ? `&next=${encodeURIComponent(next)}` : ""}`;
    return redirect(errorUrl);
  }

  return redirect(`/auth/login?message=Check your email for validation link${next ? `&next=${encodeURIComponent(next)}` : ""}`);
}

export async function loginWithGoogle(formData: FormData) {
  const next = formData.get("next") as string || "/";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.SUPABASE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const errorUrl = `/auth/login?error=${encodeURIComponent(error.message)}${next ? `&next=${encodeURIComponent(next)}` : ""}`;
    return redirect(errorUrl);
  }

  if (data?.url) {
    redirect(data.url);
  }
}
