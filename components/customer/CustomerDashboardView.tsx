"use client";

import {
  IndianRupee,
  Milk,
  LogOut,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { Profile, CustomerBalance, MonthGroup } from "@/types/database";

interface Props {
  profile: Profile | null;
  balance: CustomerBalance | null;
  months: MonthGroup[];
  loading: boolean;
  expandedMonth: string | null;
  onToggleMonth: (key: string) => void;
  onLogout: () => void;
  onDownload: (month: MonthGroup) => void;
}

export default function CustomerDashboardView({
  profile,
  balance,
  months,
  loading,
  expandedMonth,
  onToggleMonth,
  onLogout,
  onDownload,
}: Props) {
  const outstanding = balance?.outstanding ?? 0;

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.hLeft}>
            <div style={s.logo}>
              <Milk size={18} color="#fff" />
            </div>
            <div>
              <p style={s.brandSm}>Ganesh Dairy</p>
              <p style={s.welcome}>
                {loading
                  ? "Loading…"
                  : `Hi, ${profile?.full_name?.split(" ")[0] || "Customer"}`}
              </p>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={onLogout}>
            <LogOut size={16} color="#888" />
          </button>
        </header>

        <main style={s.body}>
          {/* Balance Card */}
          <div style={s.balCard}>
            <div style={s.balTop}>
              <span style={s.balLabel}>Outstanding Balance</span>
              {outstanding <= 0 ? (
                <span style={s.cleared}>
                  <CheckCircle2 size={11} /> Cleared
                </span>
              ) : (
                <span style={s.due}>
                  <AlertCircle size={11} /> Due
                </span>
              )}
            </div>
            <p style={s.balAmt}>
              ₹{loading ? "—" : Math.abs(outstanding).toLocaleString("en-IN")}
            </p>
            <div style={s.balStrip}>
              <div style={s.balStat}>
                <span style={s.bsl}>Total Billed</span>
                <span style={s.bsv}>
                  ₹{(balance?.total_billed ?? 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div style={s.divider} />
              <div style={s.balStat}>
                <span style={s.bsl}>Total Paid</span>
                <span style={s.bsv}>
                  ₹{(balance?.total_paid ?? 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Statements */}
          <p style={s.secTitle}>Monthly Statements</p>

          {loading ? (
            <p style={s.empty}>Loading your records…</p>
          ) : months.length === 0 ? (
            <p style={s.empty}>No purchases yet</p>
          ) : (
            <div style={s.monthList}>
              {months.map((m) => {
                const open = expandedMonth === m.key;
                return (
                  <div key={m.key} style={s.monthCard}>
                    <button
                      style={s.monthHead}
                      onClick={() => onToggleMonth(m.key)}>
                      <div>
                        <p style={s.monthLabel}>{m.label}</p>
                        <p style={s.monthMeta}>
                          {m.total_litres}L · {m.purchases.length} entries
                        </p>
                      </div>
                      <div style={s.monthRight}>
                        <div style={{ textAlign: "right" }}>
                          <p
                            style={{
                              ...s.monthBal,
                              color:
                                m.pending_amount > 0 ? "#c0392b" : "#1a7a4a",
                            }}>
                            ₹{m.pending_amount.toLocaleString("en-IN")}
                          </p>
                          <p style={s.monthBalLbl}>
                            {m.pending_amount > 0 ? "pending" : "settled"}
                          </p>
                        </div>
                        {open ? (
                          <ChevronUp size={16} color="#aaa" />
                        ) : (
                          <ChevronDown size={16} color="#aaa" />
                        )}
                      </div>
                    </button>

                    {open && (
                      <div style={s.monthBody}>
                        {/* Summary */}
                        <div style={s.strip}>
                          {[
                            { l: "Billed", v: m.total_amount, c: "#1a1a1a" },
                            { l: "Paid", v: m.paid_amount, c: "#1a7a4a" },
                            {
                              l: "Pending",
                              v: m.pending_amount,
                              c: m.pending_amount > 0 ? "#c0392b" : "#1a7a4a",
                            },
                          ].map((x) => (
                            <div key={x.l} style={s.stripItem}>
                              <span style={s.stripLbl}>{x.l}</span>
                              <span style={{ ...s.stripVal, color: x.c }}>
                                ₹{x.v.toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Rows */}
                        {m.purchases.map((p) => (
                          <div key={p.id} style={s.row}>
                            <div style={{ ...s.rowDot, background: "#e6f4ed" }}>
                              <Milk size={12} color="#1a7a4a" />
                            </div>
                            <div style={s.rowInfo}>
                              <p style={s.rowTitle}>
                                {p.quantity}L Buffalo Milk
                              </p>
                              <p style={s.rowDate}>
                                <Clock size={9} style={{ marginRight: 3 }} />
                                {p.purchase_date}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={s.rowAmt}>
                                ₹
                                {Number(p.total_amount).toLocaleString("en-IN")}
                              </p>
                              <span
                                style={{
                                  ...s.statusPill,
                                  background:
                                    p.payment_status === "paid"
                                      ? "#e6f4ed"
                                      : "#fff0f0",
                                  color:
                                    p.payment_status === "paid"
                                      ? "#1a7a4a"
                                      : "#c0392b",
                                }}>
                                {p.payment_status === "paid"
                                  ? "✓ Paid"
                                  : "⏳ Pending"}
                              </span>
                            </div>
                          </div>
                        ))}

                        <button style={s.dlBtn} onClick={() => onDownload(m)}>
                          <Download size={13} /> Download Receipt
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ height: 32 }} />
        </main>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    background: "#eef0f3",
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
  hLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandSm: { fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 1 },
  welcome: { fontSize: 15, fontWeight: 700, color: "#1a1a1a" },
  logoutBtn: {
    background: "#f5f5f5",
    border: "none",
    borderRadius: 10,
    padding: "8px 10px",
    cursor: "pointer",
  },
  body: { flex: 1, overflowY: "auto", padding: "16px 14px 0" },
  balCard: {
    background: "linear-gradient(135deg,#1a7a4a,#25a366)",
    borderRadius: 20,
    padding: "22px 20px 18px",
    marginBottom: 20,
    boxShadow: "0 8px 24px rgba(26,122,74,0.28)",
  },
  balTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  balLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 },
  cleared: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  due: {
    background: "rgba(255,80,80,0.25)",
    color: "#ffe0e0",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  balAmt: {
    color: "#fff",
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: -1,
    margin: "4px 0 14px",
  },
  balStrip: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "10px 14px",
  },
  balStat: { display: "flex", flexDirection: "column", gap: 2 },
  bsl: { color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 600 },
  bsv: { color: "#fff", fontSize: 14, fontWeight: 700 },
  divider: { width: 1, height: 28, background: "rgba(255,255,255,0.2)" },
  secTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    padding: "40px 0",
    color: "#bbb",
    fontSize: 14,
  },
  monthList: { display: "flex", flexDirection: "column", gap: 10 },
  monthCard: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  monthHead: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  monthMeta: { fontSize: 11, color: "#aaa" },
  monthRight: { display: "flex", alignItems: "center", gap: 8 },
  monthBal: { fontSize: 15, fontWeight: 800 },
  monthBalLbl: { fontSize: 10, color: "#aaa", textAlign: "right" },
  monthBody: { borderTop: "1px solid #f0f0f0", padding: "0 14px 14px" },
  strip: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f7f9fb",
    borderRadius: 10,
    padding: "10px 12px",
    margin: "12px 0 10px",
  },
  stripItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  stripLbl: { fontSize: 10, color: "#999", fontWeight: 600 },
  stripVal: { fontSize: 13, fontWeight: 800 },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 0",
    borderBottom: "1px solid #f5f5f5",
  },
  rowDot: {
    width: 30,
    height: 30,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 13, fontWeight: 600, color: "#222" },
  rowDate: {
    fontSize: 10,
    color: "#bbb",
    display: "flex",
    alignItems: "center",
    marginTop: 2,
  },
  rowAmt: { fontSize: 13, fontWeight: 800, color: "#1a1a1a" },
  statusPill: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 6,
    display: "inline-block",
    marginTop: 2,
  },
  dlBtn: {
    marginTop: 12,
    width: "100%",
    background: "#f0f7f3",
    color: "#1a7a4a",
    border: "1.5px solid #c3e6d3",
    borderRadius: 10,
    padding: "10px 0",
    fontSize: 13,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
  },
};
