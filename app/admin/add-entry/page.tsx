"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addEntryAction } from "@/actions/purchaseActions";
import { getAllCustomers } from "@/lib/models/profileModel";
import { getAllProducts } from "@/lib/models/productModel";
import { ArrowLeft, Milk } from "lucide-react";
import type { Profile, Product } from "@/types/database";

export default function AddEntryPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addEntryAction, null);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    Promise.all([getAllCustomers(), getAllProducts()]).then(([c, p]) => {
      setCustomers(c);
      setProducts(p);
      if (p[0]) setSelectedPrice(String(p[0].unit_price));
    });
  }, []);

  useEffect(() => {
    if (state?.success) router.push("/admin/dashboard");
  }, [state]);

  const total = Number(quantity) * Number(selectedPrice) || 0;

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        <header style={s.header}>
          <button style={s.back} onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <span style={s.title}>New Entry</span>
          <div style={s.logo}>
            <Milk size={18} color="#fff" />
          </div>
        </header>

        <main style={s.body}>
          {state?.error && <div style={s.errBox}>{state.error}</div>}

          <form action={formAction} style={s.form}>
            {/* Customer */}
            <label style={s.label}>Customer *</label>
            <select name="customer_id" required style={s.select}>
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} — {c.phone || c.email}
                </option>
              ))}
            </select>

            {/* Product */}
            <label style={s.label}>Product *</label>
            <select
              name="product_id"
              required
              style={s.select}
              onChange={(e) => {
                const p = products.find((p) => p.id === e.target.value);
                if (p) setSelectedPrice(String(p.unit_price));
              }}>
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.unit_price}/{p.unit}
                </option>
              ))}
            </select>

            {/* Hidden unit price */}
            <input type="hidden" name="unit_price" value={selectedPrice} />

            {/* Quantity */}
            <label style={s.label}>Quantity (litres) *</label>
            <input
              name="quantity"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="e.g. 2.5"
              required
              style={s.input}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            {/* Date */}
            <label style={s.label}>Date *</label>
            <input
              name="purchase_date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              style={s.input}
            />

            {/* Total preview */}
            {total > 0 && (
              <div style={s.totalPreview}>
                <span style={s.totalLbl}>Total Amount</span>
                <span style={s.totalAmt}>
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <button type="submit" disabled={isPending} style={s.btn}>
              {isPending ? "Saving…" : "Save Entry"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    background: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  phone: {
    width: "100%",
    maxWidth: 430,
    minHeight: "100vh",
    background: "#f7f8fa",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans','Nunito',sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },
  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#1a1a1a",
    padding: 4,
  },
  title: { fontSize: 16, fontWeight: 700, color: "#1a1a1a" },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, padding: "20px 16px" },
  errBox: {
    background: "#fff0f0",
    border: "1px solid #ffc5c5",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 16,
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 12, fontWeight: 700, color: "#444", marginBottom: -6 },
  input: {
    border: "1.5px solid #e0e0e0",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
    color: "#1a1a1a",
  },
  select: {
    border: "1.5px solid #e0e0e0",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
    color: "#1a1a1a",
  },
  totalPreview: {
    background: "#e6f4ed",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLbl: { fontSize: 13, fontWeight: 600, color: "#1a7a4a" },
  totalAmt: { fontSize: 20, fontWeight: 800, color: "#1a7a4a" },
  btn: {
    background: "linear-gradient(135deg,#1a7a4a,#25a366)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "15px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 4px 12px rgba(26,122,74,0.25)",
  },
};
