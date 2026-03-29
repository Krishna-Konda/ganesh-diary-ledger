"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addMultipleEntriesAction } from "@/actions/purchaseActions";
import { getAllCustomers } from "@/lib/models/profileModel";
import { getAllProducts } from "@/lib/models/productModel";
import { ArrowLeft, Milk, Plus, Trash2 } from "lucide-react";
import type { Profile, Product } from "@/types/database";

// ── One product row ──────────────────────────────────────────
interface EntryRow {
  rowKey: string;
  product_id: string;
  quantity: string;
  unit_price: number;
  unit: string;
  product_name: string;
}

function makeRow(): EntryRow {
  return {
    rowKey: Math.random().toString(36).slice(2),
    product_id: "",
    quantity: "",
    unit_price: 0,
    unit: "",
    product_name: "",
  };
}

export default function AddEntryPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState<EntryRow[]>([makeRow()]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllCustomers(), getAllProducts()]).then(([c, p]) => {
      setCustomers(c);
      setProducts(p);
    });
  }, []);

  function isBuffaloMilk(productName: string) {
    return productName.toLowerCase().includes("buffalo");
  }

  function handleProductChange(rowKey: string, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setRows((prev) =>
      prev.map((r) =>
        r.rowKey === rowKey
          ? {
              ...r,
              product_id: productId,
              unit_price: product.unit_price,
              unit: product.unit,
              product_name: product.name,
            }
          : r,
      ),
    );
  }

  function handleQuantityChange(rowKey: string, qty: string) {
    setRows((prev) =>
      prev.map((r) => (r.rowKey === rowKey ? { ...r, quantity: qty } : r)),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()]);
  }

  function removeRow(rowKey: string) {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.rowKey !== rowKey));
  }

  const validRows = rows.filter((r) => r.product_id && Number(r.quantity) > 0);

  const grandTotal = rows.reduce((sum, r) => {
    if (!r.product_id) return sum;

    const isBuffalo = isBuffaloMilk(r.product_name);

    if (isBuffalo) {
      return sum + (Number(r.quantity) || 0); // treat as ₹
    }

    return sum + (Number(r.quantity) || 0) * r.unit_price;
  }, 0);

  async function handleSave() {
    setError("");

    if (!customerId) {
      setError("Please select a customer");
      return;
    }
    if (!date) {
      setError("Please select a date");
      return;
    }
    if (validRows.length === 0) {
      setError("Add at least one product with a quantity");
      return;
    }

    setIsPending(true);

    const formData = new FormData();

    formData.set("customer_id", customerId);
    formData.set("purchase_date", date);
    formData.set(
      "rows",
      JSON.stringify(
        validRows.map((r) => {
          const isBuffalo = r.product_name?.toLowerCase().includes("buffalo");

          return {
            product_id: r.product_id,
            quantity: isBuffalo ? 1 : Number(r.quantity),
            unit_price: isBuffalo
              ? Number(r.quantity) // treat input as ₹
              : r.unit_price,
          };
        }),
      ),
    );

    const result = await addMultipleEntriesAction(null, formData);
    setIsPending(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin/dashboards");
    }
  }

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        {/* Header — identical to your original */}
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
          {error && <div style={s.errBox}>{error}</div>}

          <div style={s.form}>
            {/* Customer — same as your original */}
            <label style={s.label}>Customer *</label>
            <select
              style={s.select}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} — {c.phone || c.email}
                </option>
              ))}
            </select>

            {/* Date — same as your original */}
            <label style={s.label}>Date *</label>
            <input
              type="date"
              style={s.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* Products header with Add button */}
            <div style={s.rowsHeader}>
              <label style={s.label}>Products *</label>
              <button style={s.addRowBtn} onClick={addRow} type="button">
                <Plus size={14} />
                Add Product
              </button>
            </div>

            {/* One card per product row */}
            {rows.map((row, idx) => (
              <div key={row.rowKey} style={s.productRow}>
                {/* Row number circle */}
                <div style={s.rowNum}>{idx + 1}</div>

                <div style={s.rowFields}>
                  {/* Product dropdown */}
                  <select
                    style={s.select}
                    value={row.product_id}
                    onChange={(e) =>
                      handleProductChange(row.rowKey, e.target.value)
                    }>
                    <option value="">Select product…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.unit_price}/{p.unit}
                      </option>
                    ))}
                  </select>

                  {/* Quantity + line total shown only after product picked */}
                  {row.product_id && (
                    <div style={s.qtyRow}>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder={`Qty (${row.unit})`}
                        style={{ ...s.input, flex: 1 }}
                        value={row.quantity}
                        onChange={(e) =>
                          handleQuantityChange(row.rowKey, e.target.value)
                        }
                      />
                      {Number(row.quantity) > 0 && (
                        <div style={s.lineTotal}>
                          <span style={s.lineTotalLabel}>
                            @ ₹{row.unit_price}
                          </span>
                          <span style={s.lineTotalAmt}>
                            ₹
                            {(isBuffaloMilk(row.product_name)
                              ? Number(row.quantity)
                              : Number(row.quantity) * row.unit_price
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Remove button — only when more than 1 row */}
                {rows.length > 1 && (
                  <button
                    style={s.removeBtn}
                    onClick={() => removeRow(row.rowKey)}
                    type="button">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            {/* Grand total — same style as your original totalPreview */}
            {grandTotal > 0 && (
              <div style={s.totalPreview}>
                <span style={s.totalLbl}>
                  Grand Total ({validRows.length}{" "}
                  {validRows.length === 1 ? "item" : "items"})
                </span>
                <span style={s.totalAmt}>
                  ₹
                  {grandTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {/* Save button — same style as your original */}
            <button
              type="button"
              disabled={isPending}
              style={s.btn}
              onClick={handleSave}>
              {isPending
                ? "Saving…"
                : `Save ${validRows.length > 0 ? validRows.length : ""} ${
                    validRows.length === 1 ? "Entry" : "Entries"
                  }`}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Styles — your originals kept exactly + new ones appended ──
const s: Record<string, React.CSSProperties> = {
  // your original styles — untouched
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
    width: "100%",
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

  // new styles — match your existing look
  rowsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -4,
  },
  addRowBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#e6f4ed",
    color: "#1a7a4a",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  productRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "#fff",
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "12px 10px",
  },
  rowNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#1a7a4a",
    color: "#fff",
    fontSize: 11,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 12,
  },
  rowFields: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  lineTotal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    flexShrink: 0,
  },
  lineTotalLabel: { fontSize: 10, color: "#999" },
  lineTotalAmt: { fontSize: 14, fontWeight: 800, color: "#1a7a4a" },
  removeBtn: {
    background: "#fff0f0",
    border: "none",
    borderRadius: 8,
    padding: 7,
    cursor: "pointer",
    color: "#c0392b",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 10,
  },
};
