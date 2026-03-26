"use server";
// ============================================================
// AGENT 8 — actions/purchaseActions.ts
// CONTROLLER: Server Actions for purchase/entry mutations
// Admin-only operations — guarded by role check
// ============================================================
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Add a new sale entry ─────────────────────────────────────
export async function addEntryAction(
  _prevState: { error: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error: string; success?: boolean }> {
  const supabase = await createClient();

  // Guard: must be admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const customer_id = formData.get("customer_id") as string;
  const product_id = formData.get("product_id") as string;
  const quantity = Number(formData.get("quantity"));
  const unit_price = Number(formData.get("unit_price"));
  const purchase_date = formData.get("purchase_date") as string;

  if (
    !customer_id ||
    !product_id ||
    !quantity ||
    !unit_price ||
    !purchase_date
  ) {
    return { error: "All fields are required" };
  }

  const { error } = await supabase.from("purchases").insert({
    customer_id,
    product_id,
    quantity,
    unit_price,
    purchase_date,
    payment_status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboards");
  revalidatePath("/admin/add-entry");
  return { error: "", success: true };
}

// ── Toggle payment status (paid ↔ pending) ───────────────────
export async function togglePaymentStatusAction(
  purchaseId: string,
  currentStatus: "paid" | "pending",
): Promise<{ error: string }> {
  const supabase = await createClient();

  const newStatus = currentStatus === "paid" ? "pending" : "paid";
  const { error } = await supabase
    .from("purchases")
    .update({ payment_status: newStatus })
    .eq("id", purchaseId);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboards");
  revalidatePath("/admin/customers");
  return { error: "" };
}

// ── Delete a purchase entry ──────────────────────────────────
export async function deleteEntryAction(
  purchaseId: string,
): Promise<{ error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("purchases")
    .delete()
    .eq("id", purchaseId);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboards");
  return { error: "" };
}
// ── ADD THIS FUNCTION AT THE BOTTOM OF purchaseActions.ts ────
// No other changes needed in this file

export async function addMultipleEntriesAction(
  _prevState: { error: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error: string; success?: boolean }> {
  const supabase = await createClient();

  // Auth guard — same as your existing addEntryAction
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const customer_id = formData.get("customer_id") as string;
  const purchase_date = formData.get("purchase_date") as string;
  const rowsJson = formData.get("rows") as string;

  if (!customer_id || !purchase_date || !rowsJson) {
    return { error: "Missing required fields" };
  }

  // Parse the rows array sent from the page
  let rows: { product_id: string; quantity: number; unit_price: number }[];
  try {
    rows = JSON.parse(rowsJson);
  } catch {
    return { error: "Invalid row data" };
  }

  if (!rows.length) {
    return { error: "No products selected" };
  }

  // Build the batch insert — one row per product
  const inserts = rows.map((r) => ({
    customer_id,
    product_id: r.product_id,
    quantity: r.quantity,
    unit_price: r.unit_price,
    purchase_date,
    payment_status: "pending" as const,
  }));

  const { error } = await supabase.from("purchases").insert(inserts);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/add-entry");
  return { error: "", success: true };
}
