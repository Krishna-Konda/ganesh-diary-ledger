"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminStats } from "@/lib/models/purchaseModel";
import { getCustomerCount } from "@/lib/models/profileModel";
import { getRecentPurchases } from "@/lib/models/purchaseModel";
import type { AdminStats, Purchase } from "@/types/database";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    today_sales: 0,
    month_sales: 0,
    customer_count: 0,
    pending_amount: 0,
    entries_today: 0,
  });
  const [recentEntries, setRecentEntries] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rawStats, custCount, recent] = await Promise.all([
        getAdminStats(),
        getCustomerCount(),
        getRecentPurchases(10),
      ]);
      setStats({ ...rawStats, customer_count: custCount });
      setRecentEntries(recent);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, recentEntries, loading, error, refresh };
}
