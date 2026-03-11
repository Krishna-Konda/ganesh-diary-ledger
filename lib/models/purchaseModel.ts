import { createClient } from "@/lib/supabase/client";
import type {
  Purchase,
  CustomerBalance,
  MonthGroup,
  AdminStats,
} from "@/types/database";

// ── My purchases (customer's own records) ───────────────────
export async function getMyPurchases(): Promise<Purchase[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name, unit, unit_price)")
    .eq("customer_id", user.id)
    .order("purchase_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ── My balance calculation ───────────────────────────────────
export async function getMyBalance(): Promise<CustomerBalance> {
  const purchases = await getMyPurchases();

  const total_billed = purchases.reduce(
    (s, p) => s + Number(p.total_amount),
    0,
  );
  const total_paid = purchases
    .filter((p) => p.payment_status === "paid")
    .reduce((s, p) => s + Number(p.total_amount), 0);

  return {
    total_billed,
    total_paid,
    outstanding: total_billed - total_paid,
  };
}

// ── All purchases for a specific customer — admin only ───────
export async function getPurchasesByCustomer(
  customerId: string,
): Promise<Purchase[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name, unit, unit_price)")
    .eq("customer_id", customerId)
    .order("purchase_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ── Recent purchases across all customers — admin only ───────
export async function getRecentPurchases(limit = 10): Promise<Purchase[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select(
      "*, products(name, unit, unit_price), profiles(full_name, phone, email)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

// ── Admin dashboard stats ────────────────────────────────────
export async function getAdminStats(): Promise<
  Omit<AdminStats, "customer_count">
> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];
  const monthStart = today.slice(0, 7) + "-01";

  const [todayRes, monthRes, pendingRes, entryCountRes] = await Promise.all([
    supabase
      .from("purchases")
      .select("total_amount")
      .eq("purchase_date", today),
    supabase
      .from("purchases")
      .select("total_amount")
      .gte("purchase_date", monthStart),
    supabase
      .from("purchases")
      .select("total_amount")
      .eq("payment_status", "pending"),
    supabase
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .eq("purchase_date", today),
  ]);

  return {
    today_sales: (todayRes.data || []).reduce(
      (s, r) => s + Number(r.total_amount),
      0,
    ),
    month_sales: (monthRes.data || []).reduce(
      (s, r) => s + Number(r.total_amount),
      0,
    ),
    pending_amount: (pendingRes.data || []).reduce(
      (s, r) => s + Number(r.total_amount),
      0,
    ),
    entries_today: entryCountRes.count || 0,
  };
}

// ── Mark a purchase as paid — admin only ─────────────────────
export async function markAsPaid(purchaseId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("purchases")
    .update({ payment_status: "paid" })
    .eq("id", purchaseId);

  if (error) throw new Error(error.message);
}

// ── Mark a purchase as pending — admin only ──────────────────
export async function markAsPending(purchaseId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("purchases")
    .update({ payment_status: "pending" })
    .eq("id", purchaseId);

  if (error) throw new Error(error.message);
}

// ── Create a new purchase entry — admin only ─────────────────
export async function createPurchase(entry: {
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  purchase_date: string;
}): Promise<Purchase> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("purchases")
    .insert({ ...entry, payment_status: "pending" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ── Delete a purchase — admin only ───────────────────────────
export async function deletePurchase(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("purchases").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

// ── Group purchases into monthly buckets (pure function) ─────
export function groupByMonth(purchases: Purchase[]): MonthGroup[] {
  const map: Record<string, Purchase[]> = {};
  for (const p of purchases) {
    const key = p.purchase_date.slice(0, 7);
    if (!map[key]) map[key] = [];
    map[key].push(p);
  }

  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => {
      const [year, month] = key.split("-");
      const label = new Date(Number(year), Number(month) - 1).toLocaleString(
        "default",
        { month: "long", year: "numeric" },
      );

      const total_amount = items.reduce(
        (s, p) => s + Number(p.total_amount),
        0,
      );
      const paid_amount = items
        .filter((p) => p.payment_status === "paid")
        .reduce((s, p) => s + Number(p.total_amount), 0);
      const total_litres = items.reduce((s, p) => s + Number(p.quantity), 0);

      return {
        key,
        label,
        purchases: items,
        total_amount,
        paid_amount,
        pending_amount: total_amount - paid_amount,
        total_litres,
      };
    });
}
