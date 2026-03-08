"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Use service role to bypass RLS for profile fetching
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    return null;
  }

  if (!data) return null;

  return { id: user.id, email: user.email, ...data };
}

export async function getUserRole() {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function checkRoleAdmin() {
  const role = await getUserRole();
  return role === "admin";
}

export async function checkIsAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

export async function setUserRole(userId: string, role: "admin" | "customer") {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, role });

  if (error) {
    console.error("Error setting user role:", error);
    return false;
  }

  return true;
}
