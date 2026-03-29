"use server";
// ============================================================
// AGENT 9 — actions/profileActions.ts
// CONTROLLER: Server Actions for profile & approval management
// ============================================================
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Approve a pending customer signup ────────────────────────
export async function approveCustomerAction(
  customerId: string,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({ is_approved: true })
    .eq("id", customerId);

  if (error) return { error: error.message };

  revalidatePath("/admin/approvals");
  revalidatePath("/admin/customers");
  return { error: "" };
}

// ── Reject (delete) a pending customer ───────────────────────
export async function rejectCustomerAction(
  customerId: string,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", customerId);

  if (error) return { error: error.message };

  revalidatePath("/admin/approvals");
  return { error: "" };
}

// ── Update customer contact details ─────────────────────────
export async function updateCustomerAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone, address })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/customers");
  return { error: "" };
}

// ── Update product price — admin only ────────────────────────
export async function updateProductPriceAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const unit_price = Number(formData.get("unit_price"));

  if (!id || isNaN(unit_price)) return { error: "Invalid data" };

  const { error } = await supabase
    .from("products")
    .update({ unit_price })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { error: "" };
}

// ── Delete product — admin only ────────────────────────────
export async function deleteProductAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  if (!id) return { error: "Invalid product id" };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { error: "" };
}

// ── Create product — admin only ────────────────────────────
export async function createProductAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const unit = (
    (formData.get("unit") as string)?.trim() || "liter"
  ).toLowerCase();
  const unit_price = Number(formData.get("unit_price"));

  if (!name || !category || !unit_price || isNaN(unit_price)) {
    return { error: "Invalid product data" };
  }

  const { error } = await supabase.from("products").insert({
    name,
    category,
    unit,
    unit_price,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { error: "" };
}
