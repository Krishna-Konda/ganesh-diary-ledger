"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRoleAdmin } from "./auth";

export async function getAllCustomers() {
  const admin = await checkRoleAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
export async function createCustomer(
  email: string,
  name: string,
  phone?: string,
  address?: string,
) {
  const admin = await checkRoleAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      email,
      full_name: name,
      phone: phone || null,
      address: address || null,
      role: "customer",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(
  customerid: string,
  updates: { full_name?: string; phone?: string; address?: string },
) {
  const admin = await checkRoleAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", customerid)
    .select()
    .single();

  if (error) throw error;
  return data;
}
