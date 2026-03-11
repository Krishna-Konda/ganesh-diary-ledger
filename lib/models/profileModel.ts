import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

// ── Get the logged-in user's own profile ────────────────────
export async function getMyProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ── Get all customer profiles — admin only ──────────────────
export async function getAllCustomers(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// ── Get pending approval customers — admin only ─────────────
export async function getPendingCustomers(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .eq("is_approved", false)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ── Get total approved customer count ───────────────────────
export async function getCustomerCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer")
    .eq("is_approved", true);

  if (error) throw new Error(error.message);
  return count || 0;
}

// ── Approve a customer — admin only ─────────────────────────
export async function approveCustomer(customerId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_approved: true })
    .eq("id", customerId);

  if (error) throw new Error(error.message);
}

// ── Reject/delete a pending customer — admin only ───────────
export async function rejectCustomer(customerId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", customerId);

  if (error) throw new Error(error.message);
}

// ── Get single customer by ID — admin only ──────────────────
export async function getCustomerById(id: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
