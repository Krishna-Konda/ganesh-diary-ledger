"use client";
interface Props {
  activeNav: string;
  onNavClick: (label: string, href: string) => void;
}
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ShieldCheck,
  Package,
  LogOut,
} from "lucide-react";
type NavItem =
  | { icon: any; label: string; href: string }
  | { icon: any; label: string; action: "logout" };

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboards" },
  { icon: PlusCircle, label: "Add Entry", href: "/admin/add-entry" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: ShieldCheck, label: "Approvals", href: "/admin/approvals" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: LogOut, label: "Logout", action: "logout" }, // ✅ correct
];

export default function BottomNav({ activeNav, onNavClick }: Props) {
  return (
    <nav style={s.nav}>
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = activeNav === item.label;

        return (
          <button
            key={item.label}
            style={s.navBtn}
            onClick={() => {
              if ("href" in item) {
                onNavClick(item.label, item.href);
              } else {
                onNavClick("Logout", "");
              }
            }}>
            <div
              style={{
                ...s.navIcon,
                background: active ? "#d4efe1" : "transparent",
              }}>
              <Icon
                size={20}
                color={active ? "#1a7a4a" : "#888"}
                strokeWidth={active ? 2.2 : 1.8}
              />
            </div>

            <span
              style={{
                ...s.navLabel,
                color: active ? "#1a7a4a" : "#888",
                fontWeight: active ? 700 : 400,
              }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const s: Record<string, React.CSSProperties> = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 400, // 👈 matches your UI style
    background: "#fff",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0 12px",
    zIndex: 1000,
  },
  navBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 6px",
  },
  navIcon: {
    width: 36,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: { fontSize: 10, lineHeight: 1 },
};
