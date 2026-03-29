"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCustomers } from "@/lib/models/profileModel";
import { getPurchasesByCustomer } from "@/lib/models/purchaseModel";
import BottomNav from "@/components/admin/BottomNav";
import { ArrowLeft, Milk, ChevronRight, IndianRupee } from "lucide-react";
import type { Profile } from "@/types/database";

interface CustomerWithBalance extends Profile {
  outstanding: number;
  total_billed: number;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const profiles = await getAllCustomers();
      // Fetch balance for each customer in parallel
      const withBalances = await Promise.all(
        profiles.map(async (p) => {
          const purchases = await getPurchasesByCustomer(p.id);
          const total_billed = purchases.reduce(
            (s, x) => s + Number(x.total_amount),
            0,
          );
          const total_paid = purchases
            .filter((x) => x.payment_status === "paid")
            .reduce((s, x) => s + Number(x.total_amount), 0);
          return { ...p, outstanding: total_billed - total_paid, total_billed };
        }),
      );
      setCustomers(withBalances);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search),
  );

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[420px] bg-gray-100 min-h-screen relative px-4 py-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Customers</h1>
        </div>

        {/* SEARCH */}
        <input
          className="w-full bg-gray-200 rounded-full px-4 py-3 text-sm outline-none mb-4"
          placeholder="Search by name, phone or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto mb-4">
          {["All Customers", "Pending Payment", "Active Deliveries", "VIP"].map(
            (tab, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-full text-xs whitespace-nowrap ${
                  i === 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}>
                {tab}
              </div>
            ),
          )}
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-4">
          {filtered.map((c) => {
            const isPending = c.outstanding > 0;

            return (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm">
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                    {(c.full_name?.slice(0, 2) || "NA").toUpperCase()}
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      isPending
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                    {isPending ? "PENDING" : "PAID"}
                  </span>
                </div>

                {/* BODY */}
                <div className="mt-3">
                  <h2 className="font-semibold text-base">
                    {c.full_name || "—"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Route: {c.address || "No route"}
                  </p>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gray-200 my-3" />
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-400">TOTAL PURCHASE</p>
                    <p className="text-lg font-bold text-blue-700">
                      ₹{c.total_billed}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-400">DUE AMOUNT</p>
                    <p className="text-lg font-bold text-blue-700">
                      ₹{c.outstanding}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xl ml-2">›</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
