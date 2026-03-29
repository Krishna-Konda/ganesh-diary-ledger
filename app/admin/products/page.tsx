"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/lib/models/productModel";
import {
  createProductAction,
  updateProductPriceAction,
} from "@/actions/profileAction";
import { Plus, Edit2, Check } from "lucide-react";
import type { Product } from "@/types/database";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("liter");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [addError, setAddError] = useState("");

  const [state, formAction, isPending] = useActionState(
    updateProductPriceAction,
    null,
  );
  const [createState, createAction, isCreatePending] = useActionState(
    createProductAction,
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

  useEffect(() => {
    if (createState === null) return;

    if (createState.error) {
      setAddError(createState.error);
      return;
    }

    setAddError("");
    setShowAddForm(false);
    setNewProductName("");
    setNewProductCategory("");
    setNewProductUnit("liter");
    setNewProductPrice("");
    getAllProducts().then(setProducts);
  }, [createState]);

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[420px] bg-gray-100 min-h-screen px-4 py-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-blue-900">Products</h1>
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center"
            aria-label="Add product">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* HERO CARD */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-3xl p-5 mb-6">
          <p className="text-xs tracking-widest opacity-80">
            INVENTORY OVERVIEW
          </p>
          <h2 className="text-2xl font-bold mt-2 leading-snug">
            Manage Your <br /> Dairy Essentials
          </h2>
        </div>

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-blue-900">All Products</h2>
            <p className="text-sm text-gray-500">
              {products.length} active items in catalog
            </p>
          </div>

          <button className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            Filter
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Add New Product
            </p>
            <form action={createAction} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                  placeholder="Name"
                  className="border rounded-lg p-2"
                />
                <input
                  name="category"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  required
                  placeholder="Category"
                  className="border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="unit"
                  value={newProductUnit}
                  onChange={(e) => setNewProductUnit(e.target.value)}
                  placeholder="Unit"
                  className="border rounded-lg p-2"
                />
                <input
                  name="unit_price"
                  type="number"
                  step="0.5"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  required
                  placeholder="Price"
                  className="border rounded-lg p-2"
                />
              </div>
              {addError ? (
                <p className="text-sm text-red-600">{addError}</p>
              ) : null}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreatePending}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2">
                  {isCreatePending ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 rounded-lg py-2">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading…</p>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                {/* ICON */}
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  🥛
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">per {p.unit}</p>
                </div>

                {/* PRICE / EDIT */}
                {editingId === p.id ? (
                  <form action={formAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      name="unit_price"
                      type="number"
                      step="0.5"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-20 border border-blue-500 rounded-lg px-2 py-1 text-center font-semibold outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-green-500 text-white p-2 rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{p.unit_price}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setEditPrice(String(p.unit_price));
                      }}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <Edit2 className="w-4 h-4 text-blue-700" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
