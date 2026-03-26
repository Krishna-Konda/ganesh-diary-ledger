"use client";

import { useState } from "react";
import { useCustomerDashboard } from "@/hooks/useCustomerDashboard";
import CustomerDashboardView from "@/components/customer/CustomerDashboardView";
import { logoutAction } from "@/actions/authActions";
import type { MonthGroup } from "@/types/database";

export default function CustomerDashboardPage() {
  const { profile, balance, months, loading } = useCustomerDashboard();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(
    new Date().toISOString().slice(0, 7),
  );

  function handleDownload(month: MonthGroup) {
    const lines = [
      "=============================",
      "       GANESH DAIRY          ",
      "=============================",
      `Statement : ${month.label}`,
      `Customer  : ${profile?.full_name || ""}`,
      `Phone     : ${profile?.phone || "—"}`,
      "-----------------------------",
      "Date         Qty     Amount  Status",
      "-----------------------------",
      ...month.purchases.map(
        (p) =>
          `${p.purchase_date}  ${String(p.quantity).padEnd(6)}L  ₹${String(Number(p.total_amount).toFixed(2)).padEnd(8)} ${p.payment_status}`,
      ),
      "-----------------------------",
      `Total Billed : ₹${month.total_amount.toFixed(2)}`,
      `Total Paid   : ₹${month.paid_amount.toFixed(2)}`,
      `Pending      : ₹${month.pending_amount.toFixed(2)}`,
      "=============================",
      "Thank you for choosing Ganesh Dairy!",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GaneshDairy_${month.key}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <CustomerDashboardView
      profile={profile}
      balance={balance}
      months={months}
      loading={loading}
      expandedMonth={expandedMonth}
      onToggleMonth={(key) =>
        setExpandedMonth((prev) => (prev === key ? null : key))
      }
      onLogout={logoutAction}
      onDownload={handleDownload}
    />
  );
}
