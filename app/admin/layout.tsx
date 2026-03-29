// app/admin/layout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import BottomNav from "@/components/admin/BottomNav";
import { logoutAction } from "@/actions/authActions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (label: string, href: string) => {
    if (label === "Logout") {
      logoutAction();
      router.replace("/login");
      return;
    }

    router.push(href);
  };
  return (
    <div style={{ paddingBottom: 70, minHeight: "100vh" }}>
      {children}

      <BottomNav
        activeNav={getActiveNav(pathname)}
        onNavClick={handleNavClick}
      />
    </div>
  );
}

function getActiveNav(pathname: string) {
  if (pathname.includes("dashboards")) return "Dashboard";
  if (pathname.includes("add-entry")) return "Add Entry";
  if (pathname.includes("customers")) return "Customers";
  if (pathname.includes("approvals")) return "Approvals";
  if (pathname.includes("products")) return "Products";
  return "";
}
