"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/lib/models/productModel";
import { updateProductPriceAction } from "@/actions/profileAction";
import { ArrowLeft, Milk, Edit2, Check } from "lucide-react";
import type { Product } from "@/types/database";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [state, formAction, isPending] = useActionState(
    updateProductPriceAction,
    null,
  );

  useEffect(() => {
    getAllProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!state?.error && state !== null) {
      setEditingId(null);
      getAllProducts().then(setProducts);
    }
  }, [state]);

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        <header style={s.header}>
          <button style={s.back} onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <span style={s.title}>Products</span>
          <div style={s.logo}>
            <Milk size={18} color="#fff" />
          </div>
        </header>

        <main style={s.body}>
          <p style={s.hint}>
            Tap the edit icon to update a product's price. All new entries will
            use the updated price.
          </p>

          {loading ? (
            <p style={s.empty}>Loading…</p>
          ) : (
            <div style={s.list}>
              {products.map((p) => (
                <div key={p.id} style={s.card}>
                  <div style={s.pIcon}>
                    <Milk size={20} color="#1a7a4a" />
                  </div>
                  <div style={s.info}>
                    <p style={s.name}>{p.name}</p>
                    <p style={s.cat}>
                      {p.category} · per {p.unit}
                    </p>
                  </div>

                  {editingId === p.id ? (
                    <form action={formAction} style={s.editForm}>
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        name="unit_price"
                        type="number"
                        step="0.5"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={s.priceInput}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isPending}
                        style={s.saveBtn}>
                        <Check size={16} />
                      </button>
                    </form>
                  ) : (
                    <div style={s.priceRow}>
                      <span style={s.price}>₹{p.unit_price}</span>
                      <button
                        style={s.editBtn}
                        onClick={() => {
                          setEditingId(p.id);
                          setEditPrice(String(p.unit_price));
                        }}>
                        <Edit2 size={14} color="#1a7a4a" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
  body: { flex: 1, padding: "16px" },
  hint: {
    fontSize: 12,
    color: "#999",
    background: "#f0f0f0",
    borderRadius: 10,
    padding: "10px 12px",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  empty: {
    textAlign: "center",
    padding: "40px 0",
    color: "#bbb",
    fontSize: 14,
  },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  pIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#e6f4ed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 },
  cat: { fontSize: 11, color: "#999" },
  priceRow: { display: "flex", alignItems: "center", gap: 8 },
  price: { fontSize: 16, fontWeight: 800, color: "#1a7a4a" },
  editBtn: {
    background: "#e6f4ed",
    border: "none",
    borderRadius: 8,
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  editForm: { display: "flex", alignItems: "center", gap: 6 },
  priceInput: {
    width: 70,
    border: "1.5px solid #1a7a4a",
    borderRadius: 8,
    padding: "6px 8px",
    fontSize: 14,
    fontWeight: 700,
    outline: "none",
    textAlign: "center",
  },
  saveBtn: {
    background: "#1a7a4a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
};
