"use client";

import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ShieldCheck,
  Package,
  LogOut,
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  ChevronRight,
  Milk,
} from "lucide-react";
import type { AdminStats, Purchase } from "@/types/database";

interface Props {
  stats: AdminStats;
  recentEntries: Purchase[];
  loading: boolean;
  currentMonth: string;

  onNewEntry: () => void;
  onTogglePayment: (id: string, status: "paid" | "pending") => void;
}

export default function AdminDashboardView({
  stats,
  recentEntries,
  loading,
  currentMonth,

  onNewEntry,
  onTogglePayment,
}: Props) {
  const cards = [
    {
      label: "TODAY",
      value: `₹${stats.today_sales.toLocaleString("en-IN")}`,
      icon: <IndianRupee size={20} />,
      color: "#1a7a4a",
      bg: "#e6f4ed",
    },
    {
      label: "THIS MONTH",
      value: `₹${stats.month_sales.toLocaleString("en-IN")}`,
      icon: <TrendingUp size={20} />,
      color: "#b85c00",
      bg: "#fff3e6",
    },
    {
      label: "CUSTOMERS",
      value: stats.customer_count,
      icon: <Users size={20} />,
      color: "#2d4bb5",
      bg: "#eaedfa",
    },
    {
      label: "PENDING DUE",
      value: `₹${stats.pending_amount.toLocaleString("en-IN")}`,
      icon: <AlertCircle size={20} />,
      color: "#c0392b",
      bg: "#fff0f0",
    },
  ];

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.hLeft}>
            <div style={s.logo}>
              <Milk size={20} color="#fff" />
            </div>
            <span style={s.brand}>Ganesh Dairy</span>
          </div>
          <span style={s.badge}>Admin</span>
        </header>

        {/* Body */}
        <main style={s.body}>
          {/* Stat Cards */}
          <div style={s.grid2}>
            {cards.map((c) => (
              <div key={c.label} style={{ ...s.statCard, background: c.bg }}>
                <div
                  style={{ ...s.statIcon, color: c.color, background: c.bg }}>
                  {c.icon}
                </div>
                <div>
                  <p style={{ ...s.statLabel, color: c.color }}>{c.label}</p>
                  <p style={{ ...s.statVal, color: c.color }}>
                    {loading ? "—" : c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* New Entry CTA */}
          <button style={s.newBtn} onClick={onNewEntry}>
            <PlusCircle size={20} color="#fff" />
            <span>New Entry</span>
          </button>

          {/* Recent Entries */}
          <div style={s.secRow}>
            <span style={s.secTitle}>Recent Entries</span>
            <span style={s.secDate}>{currentMonth}</span>
          </div>

          {loading ? (
            <p style={s.empty}>Loading…</p>
          ) : recentEntries.length === 0 ? (
            <p style={s.empty}>No entries yet</p>
          ) : (
            <div style={s.list}>
              {recentEntries.map((e) => (
                <div key={e.id} style={s.entryCard}>
                  <div style={s.eLeft}>
                    <div style={{ ...s.eDot, background: "#e6f4ed" }}>
                      <Milk size={14} color="#1a7a4a" />
                    </div>
                    <div>
                      <p style={s.eName}>
                        {e.profiles?.full_name || "Customer"}
                      </p>
                      <p style={s.eMeta}>
                        {e.quantity}L · {e.purchase_date}
                      </p>
                    </div>
                  </div>
                  <div style={s.eRight}>
                    <div style={{ textAlign: "right" }}>
                      <p style={s.eAmt}>
                        ₹{Number(e.total_amount).toLocaleString("en-IN")}
                      </p>
                      <button
                        style={{
                          ...s.statusBtn,
                          background:
                            e.payment_status === "paid" ? "#e6f4ed" : "#fff0f0",
                          color:
                            e.payment_status === "paid" ? "#1a7a4a" : "#c0392b",
                        }}
                        onClick={() => onTogglePayment(e.id, e.payment_status)}>
                        {e.payment_status === "paid" ? "✓ Paid" : "⏳ Pending"}
                      </button>
                    </div>
                    <ChevronRight size={14} color="#bbb" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ height: 90 }} />
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
    padding: "16px 20px",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },
  hLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 17, fontWeight: 700, color: "#1a1a1a" },
  badge: {
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    background: "#f0f0f0",
    padding: "4px 12px",
    borderRadius: 20,
  },
  body: { flex: 1, overflowY: "auto", padding: "16px 16px 0" },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: "14px 12px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  statVal: { fontSize: 20, fontWeight: 800 },
  newBtn: {
    width: "100%",
    background: "linear-gradient(135deg,#1a7a4a,#25a366)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "16px 0",
    fontSize: 16,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    marginBottom: 24,
    boxShadow: "0 4px 16px rgba(26,122,74,0.3)",
  },
  secRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  secTitle: { fontSize: 16, fontWeight: 700, color: "#1a1a1a" },
  secDate: { fontSize: 12, color: "#999" },
  empty: {
    textAlign: "center",
    padding: "40px 0",
    color: "#bbb",
    fontSize: 14,
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  entryCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  eLeft: { display: "flex", alignItems: "center", gap: 10 },
  eDot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  eName: { fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 },
  eMeta: { fontSize: 11, color: "#999" },
  eRight: { display: "flex", alignItems: "center", gap: 6 },
  eAmt: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 },
  statusBtn: {
    fontSize: 11,
    fontWeight: 700,
    border: "none",
    borderRadius: 8,
    padding: "3px 8px",
    cursor: "pointer",
  },
};
