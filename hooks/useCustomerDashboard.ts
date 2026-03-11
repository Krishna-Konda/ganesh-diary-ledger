"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyProfile } from "@/lib/models/profileModel";
import {
  getMyPurchases,
  getMyBalance,
  groupByMonth,
} from "@/lib/models/purchaseModel";
import type { Profile, CustomerBalance, MonthGroup } from "@/types/database";

export function useCustomerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [balance, setBalance] = useState<CustomerBalance | null>(null);
  const [months, setMonths] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prof, bal, purchases] = await Promise.all([
        getMyProfile(),
        getMyBalance(),
        getMyPurchases(),
      ]);
      setProfile(prof);
      setBalance(bal);
      setMonths(groupByMonth(purchases));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, balance, months, loading, error, refresh };
}
