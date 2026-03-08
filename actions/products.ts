"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRoleAdmin } from "./auth";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createProduct(
  name: string,
  category: string,
  unitprice: number,
  unit: string = "liter",
) {
  const admin = await checkRoleAdmin();
  if (!admin) throw new Error("Only admin can create new products");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ name, category, unit_price: unitprice, unit })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upadateProduct(
  productid: string,
  updates: {
    name?: string;
    category?: string;
    unit_price?: number;
    unit?: string;
  },
) {
  const admin = await checkRoleAdmin();
  if (!admin) throw new Error("Only admin can update the product");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productid)
    .select()
    .single();

  if (!error) throw error;
  return data;
}
