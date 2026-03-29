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
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-3 z-50">
      <nav className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl flex justify-between items-center px-3 py-2 border border-gray-200">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.label;

          return (
            <button
              key={item.label}
              onClick={() => {
                if ("href" in item) {
                  onNavClick(item.label, item.href);
                } else {
                  onNavClick("Logout", "");
                }
              }}
              className="flex flex-col items-center justify-center flex-1">
              {/* ICON CONTAINER */}
              <div
                className={`flex items-center justify-center transition-all duration-200
                ${
                  active
                    ? "bg-blue-100 text-blue-700 rounded-xl px-3 py-1.5"
                    : "text-gray-400"
                }`}>
                <Icon
                  className={`w-5 h-5 ${
                    active ? "stroke-[2.5]" : "stroke-[1.8]"
                  }`}
                />
              </div>

              {/* LABEL */}
              <span
                className={`text-[10px] mt-1 ${
                  active ? "text-blue-700 font-semibold" : "text-gray-400"
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
