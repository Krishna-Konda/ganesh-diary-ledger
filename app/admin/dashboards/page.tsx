"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import AdminDashboardView from "@/components/admin/AdminDashboardView";
import { togglePaymentStatusAction } from "@/actions/purchaseActions";
import { logoutAction } from "@/actions/authActions";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { stats, recentEntries, loading, refresh } = useAdminDashboard();
  const [activeNav, setActiveNav] = useState("Dashboard");

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  async function handleNavClick(label: string, href: string) {
    setActiveNav(label);
    if (label === "Logout") {
      await logoutAction();
    } else {
      router.push(href);
    }
  }

  async function handleTogglePayment(id: string, status: "paid" | "pending") {
    await togglePaymentStatusAction(id, status);
    refresh();
  }

  return (
    <AdminDashboardView
      stats={stats}
      recentEntries={recentEntries}
      loading={loading}
      currentMonth={currentMonth}
      onNewEntry={() => router.push("/admin/add-entry")}
      onTogglePayment={handleTogglePayment}
    />
  );
}
