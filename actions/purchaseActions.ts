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

  revalidatePath("/admin/dashboard");
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

  revalidatePath("/admin/dashboard");
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

  revalidatePath("/admin/dashboard");
  return { error: "" };
}
