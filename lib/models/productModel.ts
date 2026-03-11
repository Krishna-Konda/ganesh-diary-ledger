import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

// ── Get all products (Buffalo Milk etc.) ─────────────────────
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// ── Get single product by ID ─────────────────────────────────
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ── Create a new product — admin only ────────────────────────
export async function createProduct(product: {
  name: string;
  category: string;
  unit_price: number;
  unit?: string;
}): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...product, unit: product.unit || "liter" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ── Update product price — admin only ────────────────────────
export async function updateProductPrice(
  id: string,
  unit_price: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ unit_price })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// ── Delete a product — admin only ────────────────────────────
export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
