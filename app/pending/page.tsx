import { logoutAction } from "@/actions/authActions";
import { Clock, Milk } from "lucide-react";

export default function PendingPage() {
  return (
    <div style={s.shell}>
      <div style={s.card}>
        <div style={s.logo}>
          <Milk size={28} color="#fff" />
        </div>
        <div style={s.icon}>
          <Clock style={{ justifySelf: "center" }} size={40} color="#b85c00" />
        </div>
        <h1 style={s.title}>Pending Approval</h1>
        <p style={s.desc}>
          Your account has been created successfully. Please wait for the admin
          to approve your account before you can log in.
        </p>
        <p style={s.contact}>Contact Ganesh Dairy to speed up your approval.</p>
        <form action={logoutAction}>
          <button type="submit" style={s.btn}>
            Sign Out
          </button>
        </form>
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
    maxWidth: 360,
    background: "#fff",
    borderRadius: 20,
    padding: 36,
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "#1a7a4a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  icon: { margin: "0 auto 16px" },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 12 },
  desc: { fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 },
  contact: { fontSize: 12, color: "#aaa", marginBottom: 24 },
  btn: {
    background: "#f0f0f0",
    color: "#666",
    border: "none",
    borderRadius: 12,
    padding: "12px 32px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
