"use client";

import { useActionState } from "react";
import { signupAction } from "@/actions/authActions";
import { Milk, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupView() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  if (state?.success) {
    return (
      <div style={s.shell}>
        <div style={s.card}>
          <div style={s.successBox}>
            <CheckCircle2
              size={48}
              color="#1a7a4a"
              style={{ margin: "0 auto 16px", display: "block" }}
            />
            <p style={s.successTitle}>Request Submitted!</p>
            <p style={s.successDesc}>{state.success}</p>
            <Link href="/login" style={s.backBtn}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.shell}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <div style={s.logoBox}>
            <Milk size={24} color="#fff" />
          </div>
          <div>
            <p style={s.brand}>Ganesh Dairy</p>
            <p style={s.sub}>New customer registration</p>
          </div>
        </div>

        <h1 style={s.title}>Create Account</h1>
        <p style={s.desc}>
          Fill in your details. Admin will approve your account.
        </p>

        {state?.error && <div style={s.errorBox}>{state.error}</div>}

        <form action={formAction} style={s.form}>
          <label style={s.label}>Full Name *</label>
          <input
            name="full_name"
            type="text"
            placeholder="Ravi Kumar"
            required
            style={s.input}
          />

          <label style={s.label}>Email *</label>
          <input
            name="email"
            type="email"
            placeholder="ravi@example.com"
            required
            style={s.input}
          />

          <label style={s.label}>Phone</label>
          <input
            name="phone"
            type="tel"
            placeholder="9876543210"
            style={s.input}
          />

          <label style={s.label}>Address</label>
          <input
            name="address"
            type="text"
            placeholder="House No, Street, Area"
            style={s.input}
          />

          <label style={s.label}>Password *</label>
          <input
            name="password"
            type="password"
            placeholder="Min 6 characters"
            required
            minLength={6}
            style={s.input}
          />

          <button type="submit" disabled={isPending} style={s.btn}>
            {isPending ? "Submitting…" : "Request Account"}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{" "}
          <Link href="/login" style={s.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    background: "#f0f4f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brand: { fontSize: 16, fontWeight: 800, color: "#1a1a1a" },
  sub: { fontSize: 11, color: "#999", marginTop: 1 },
  title: { fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 },
  desc: { fontSize: 12, color: "#888", marginBottom: 20 },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffc5c5",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 14,
  },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: 12, fontWeight: 700, color: "#444", marginBottom: -4 },
  input: {
    border: "1.5px solid #e0e0e0",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    color: "#1a1a1a",
  },
  btn: {
    background: "linear-gradient(135deg,#1a7a4a,#25a366)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  footer: { textAlign: "center", fontSize: 13, color: "#888", marginTop: 18 },
  link: { color: "#1a7a4a", fontWeight: 700, textDecoration: "none" },
  successBox: { textAlign: "center", padding: "20px 0" },
  successTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1a1a1a",
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 24,
    lineHeight: 1.5,
  },
  backBtn: {
    display: "inline-block",
    background: "#1a7a4a",
    color: "#fff",
    padding: "12px 32px",
    borderRadius: 12,
    fontWeight: 700,
    textDecoration: "none",
    fontSize: 14,
  },
};
