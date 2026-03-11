"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCustomers } from "@/lib/models/profileModel";
import { getPurchasesByCustomer } from "@/lib/models/purchaseModel";
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
    <div style={s.shell}>
      <div style={s.phone}>
        <header style={s.header}>
          <button style={s.back} onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <span style={s.title}>Customers ({customers.length})</span>
          <div style={s.logo}>
            <Milk size={18} color="#fff" />
          </div>
        </header>

        <main style={s.body}>
          <input
            style={s.search}
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <p style={s.empty}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p style={s.empty}>No customers found</p>
          ) : (
            <div style={s.list}>
              {filtered.map((c) => (
                <div key={c.id} style={s.card}>
                  <div style={s.avatar}>
                    {(c.full_name?.[0] || "?").toUpperCase()}
                  </div>
                  <div style={s.info}>
                    <p style={s.name}>{c.full_name || "—"}</p>
                    <p style={s.sub}>{c.phone || c.email}</p>
                    <p style={s.sub}>{c.address || "No address"}</p>
                  </div>
                  <div style={s.right}>
                    <div
                      style={{
                        ...s.balBadge,
                        background: c.outstanding > 0 ? "#fff0f0" : "#e6f4ed",
                        color: c.outstanding > 0 ? "#c0392b" : "#1a7a4a",
                      }}>
                      <IndianRupee size={11} />
                      {c.outstanding.toLocaleString("en-IN")}
                    </div>
                    <p style={s.balLbl}>
                      {c.outstanding > 0 ? "pending" : "settled"}
                    </p>
                    <ChevronRight size={14} color="#ccc" />
                  </div>
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
  search: {
    width: "100%",
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
    marginBottom: 16,
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box",
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
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#e6f4ed",
    color: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: 800,
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 },
  sub: { fontSize: 11, color: "#999", marginBottom: 1 },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  balBadge: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    fontSize: 12,
    fontWeight: 800,
    padding: "4px 8px",
    borderRadius: 8,
  },
  balLbl: { fontSize: 10, color: "#aaa" },
};
