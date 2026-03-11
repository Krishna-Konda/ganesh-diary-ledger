"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPendingCustomers } from "@/lib/models/profileModel";
import {
  approveCustomerAction,
  rejectCustomerAction,
} from "@/actions/profileAction";
import { ArrowLeft, UserCheck, UserX, Clock, Milk } from "lucide-react";
import type { Profile } from "@/types/database";

export default function ApprovalsPage() {
  const router = useRouter();
  const [pending, setPending] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await getPendingCustomers();
    setPending(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id: string) {
    setProcessing(id);
    await approveCustomerAction(id);
    await load();
    setProcessing(null);
  }

  async function handleReject(id: string) {
    if (!confirm("Reject and delete this customer?")) return;
    setProcessing(id);
    await rejectCustomerAction(id);
    await load();
    setProcessing(null);
  }

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        <header style={s.header}>
          <button style={s.back} onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <span style={s.title}>Approvals</span>
          <div style={s.logo}>
            <Milk size={18} color="#fff" />
          </div>
        </header>

        <main style={s.body}>
          <div style={s.countRow}>
            <Clock size={16} color="#b85c00" />
            <span style={s.countTxt}>
              {pending.length} pending approval{pending.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <p style={s.empty}>Loading…</p>
          ) : pending.length === 0 ? (
            <div style={s.emptyBox}>
              <UserCheck
                size={40}
                color="#1a7a4a"
                style={{ margin: "0 auto 12px", display: "block" }}
              />
              <p style={s.emptyTitle}>All caught up!</p>
              <p style={s.emptySub}>No pending approvals right now.</p>
            </div>
          ) : (
            <div style={s.list}>
              {pending.map((customer) => (
                <div key={customer.id} style={s.card}>
                  <div style={s.avatar}>
                    {(customer.full_name?.[0] || "?").toUpperCase()}
                  </div>
                  <div style={s.info}>
                    <p style={s.name}>{customer.full_name || "No name"}</p>
                    <p style={s.detail}>{customer.email}</p>
                    {customer.phone && <p style={s.detail}>{customer.phone}</p>}
                    {customer.address && (
                      <p style={s.detail}>{customer.address}</p>
                    )}
                    <p style={s.date}>
                      Requested:{" "}
                      {new Date(customer.created_at).toLocaleDateString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                  <div style={s.actions}>
                    <button
                      style={s.approveBtn}
                      onClick={() => handleApprove(customer.id)}
                      disabled={processing === customer.id}>
                      <UserCheck size={16} />
                      {processing === customer.id ? "…" : "Approve"}
                    </button>
                    <button
                      style={s.rejectBtn}
                      onClick={() => handleReject(customer.id)}
                      disabled={processing === customer.id}>
                      <UserX size={14} />
                    </button>
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
  countRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff3e6",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 16,
  },
  countTxt: { fontSize: 13, fontWeight: 600, color: "#b85c00" },
  empty: {
    textAlign: "center",
    padding: "40px 0",
    color: "#bbb",
    fontSize: 14,
  },
  emptyBox: { textAlign: "center", padding: "60px 20px" },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  emptySub: { fontSize: 13, color: "#888" },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#e6f4ed",
    color: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800,
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 },
  detail: { fontSize: 12, color: "#777", marginBottom: 1 },
  date: { fontSize: 11, color: "#bbb", marginTop: 4 },
  actions: { display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 },
  approveBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "#1a7a4a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  rejectBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff0f0",
    color: "#c0392b",
    border: "1px solid #ffc5c5",
    borderRadius: 10,
    padding: "8px 0",
    width: "100%",
    cursor: "pointer",
  },
};
