"use client";
// ============================================================
// AGENT 13 — components/shared/LoginView.tsx
// VIEW: Login form UI — no Supabase calls, receives action as prop
// ============================================================
import { useActionState } from "react";
import { loginAction } from "@/actions/authActions";
import { Milk } from "lucide-react";
import Link from "next/link";

export default function LoginView() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div style={s.shell}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoBox}>
            <Milk size={28} color="#fff" />
          </div>
          <div>
            <p style={s.brand}>Ganesh Dairy</p>
            <p style={s.sub}>Customer & Admin Portal</p>
          </div>
        </div>

        <h1 style={s.title}>Welcome back</h1>
        <p style={s.desc}>Sign in to view your account</p>

        {state?.error && <div style={s.errorBox}>{state.error}</div>}

        <form action={formAction} style={s.form}>
          <label style={s.label}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={s.input}
          />

          <label style={s.label}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            style={s.input}
          />

          <button type="submit" disabled={isPending} style={s.btn}>
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={s.footer}>
          New customer?{" "}
          <Link href="/signup" style={s.link}>
            Request an account
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
  logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brand: { fontSize: 18, fontWeight: 800, color: "#1a1a1a" },
  sub: { fontSize: 11, color: "#999", marginTop: 2 },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 },
  desc: { fontSize: 13, color: "#888", marginBottom: 24 },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffc5c5",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 16,
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 12, fontWeight: 700, color: "#444", marginBottom: -4 },
  input: {
    border: "1.5px solid #e0e0e0",
    borderRadius: 10,
    padding: "12px 14px",
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
  footer: { textAlign: "center", fontSize: 13, color: "#888", marginTop: 20 },
  link: { color: "#1a7a4a", fontWeight: 700, textDecoration: "none" },
};
