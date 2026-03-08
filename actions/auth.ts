"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const {
    data: { profile },
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return { id: user.id, email: user.email, ...profile };
}

export async function getUserRole() {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function checkRoleAdmin() {
  const role = await getUserRole();
  return role === "admin";
}

export async function signOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}
