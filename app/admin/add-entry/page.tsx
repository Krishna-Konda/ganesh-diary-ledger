"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addMultipleEntriesAction } from "@/actions/purchaseActions";
import { getAllCustomers } from "@/lib/models/profileModel";
import { getAllProducts } from "@/lib/models/productModel";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Profile, Product } from "@/types/database";

// ── Types ─────────────────────────────────────
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

// ── Page ─────────────────────────────────────
export default function AddEntryPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState<EntryRow[]>([makeRow()]);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    Promise.all([getAllCustomers(), getAllProducts()]).then(([c, p]) => {
      setCustomers(c);
      setProducts(p);
    });
  }, []);

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

    const isBuffalo = r.product_name?.toLowerCase().includes("buffalo");

    if (isBuffalo) {
      return sum + (Number(r.quantity) || 0); // 💥 direct ₹
    }

    return sum + (Number(r.quantity) || 0) * r.unit_price;
  }, 0);

  async function handleSave() {
    setError("");

    if (!customerId) return setError("Select customer");
    if (!validRows.length) return setError("Add items");

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
              ? Number(r.quantity) // 💥 store ₹ here
              : r.unit_price,
          };
        }),
      ),
    );

    const res = await addMultipleEntriesAction(null, formData);
    setIsPending(false);

    if (res?.error) setError(res.error);
    else router.push("/admin/dashboards");
  }

  // ── UI ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold">New Entry</h1>
          <div className="text-xs text-gray-400">DRAFT</div>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Customer */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">CUSTOMER</p>
            <select
              className="w-full border rounded-lg p-2"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">DATE</p>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Products */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">ORDER ITEMS</p>
              <button
                onClick={addRow}
                className="text-sm flex items-center gap-1 text-blue-600">
                <Plus size={14} /> Add
              </button>
            </div>

            {rows.map((row) => {
              const isBuffalo = row.product_name
                ?.toLowerCase()
                .includes("buffalo");

              return (
                <div
                  key={row.rowKey}
                  className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                  {/* Product */}
                  <select
                    className="w-full border rounded-lg p-2"
                    value={row.product_id}
                    onChange={(e) =>
                      handleProductChange(row.rowKey, e.target.value)
                    }>
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ₹{p.unit_price}/{p.unit}
                      </option>
                    ))}
                  </select>

                  {/* Stepper */}
                  <div className="flex items-center justify-between bg-gray-100 rounded-full px-3 py-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          row.rowKey,
                          String(
                            Math.max(
                              0,
                              Number(row.quantity) - (isBuffalo ? 10 : 0.5),
                            ),
                          ),
                        )
                      }>
                      -
                    </button>

                    <div className="font-semibold">
                      {row.quantity || 0} {row.unit}
                    </div>

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          row.rowKey,
                          String(
                            Number(row.quantity || 0) + (isBuffalo ? 10 : 0.5),
                          ),
                        )
                      }>
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>

                    <span className="font-semibold">
                      ₹
                      {(isBuffalo
                        ? Number(row.quantity || 0)
                        : Number(row.quantity || 0) * row.unit_price
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.rowKey)}
                      className="text-red-500 text-xs flex items-center gap-1">
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {grandTotal > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Items Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹0.00</span>
              </div>

              <div className="text-2xl font-bold mt-2">
                ₹{grandTotal.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Button */}
        <div className="p-4 bg-white border-t">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold">
            {isPending ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}
