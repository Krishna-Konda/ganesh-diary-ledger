// ============================================================
// AGENT 1 — types/database.ts
// TypeScript interfaces matching your exact Supabase schema
// + new payment_status column on purchases
// ============================================================

export type Role = "admin" | "customer";
export type PaymentStatus = "paid" | "pending";

// ── profiles ────────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: Role;
  address: string | null;
  created_at: string;
  is_approved: boolean; // NEW: admin approves new signups
}

// ── products ────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string; // "Buffalo Milk"
  category: string; // "milk"
  unit_price: number; // price per litre
  unit: string; // "liter"
  created_at: string;
}

// ── purchases ───────────────────────────────────────────────
export interface Purchase {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number; // generated: quantity * unit_price
  purchase_date: string;
  payment_status: PaymentStatus; // NEW COLUMN
  created_at: string;
  // Joined
  profiles?: Pick<Profile, "full_name" | "phone" | "email">;
  products?: Pick<Product, "name" | "unit" | "unit_price">;
}

// ── Computed UI types ────────────────────────────────────────
export interface CustomerBalance {
  total_billed: number;
  total_paid: number;
  outstanding: number;
}

export interface MonthGroup {
  key: string; // "2026-03"
  label: string; // "March 2026"
  purchases: Purchase[];
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  total_litres: number;
}

export interface AdminStats {
  today_sales: number;
  month_sales: number;
  customer_count: number;
  pending_amount: number;
  entries_today: number;
}
