"use client";

import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ShieldCheck,
  Package,
  LogOut,
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  ChevronRight,
  Milk,
} from "lucide-react";
import type { AdminStats, Purchase } from "@/types/database";

interface Props {
  stats: AdminStats;
  recentEntries: Purchase[];
  loading: boolean;
  currentMonth: string;
  onNewEntry: () => void;
  onTogglePayment: (id: string, status: "paid" | "pending") => void;
}

export default function AdminDashboardView({
  stats,
  recentEntries,
  loading,
  currentMonth,

  onNewEntry,
  onTogglePayment,
}: Props) {
  const cards = [
    {
      label: "TODAY",
      value: `₹${stats.today_sales.toLocaleString("en-IN")}`,
      icon: <IndianRupee size={20} />,
      color: "#1a7a4a",
      bg: "#e6f4ed",
    },
    {
      label: "THIS MONTH",
      value: `₹${stats.month_sales.toLocaleString("en-IN")}`,
      icon: <TrendingUp size={20} />,
      color: "#b85c00",
      bg: "#fff3e6",
    },
    {
      label: "CUSTOMERS",
      value: stats.customer_count,
      icon: <Users size={20} />,
      color: "#2d4bb5",
      bg: "#eaedfa",
    },
    {
      label: "PENDING DUE",
      value: `₹${stats.pending_amount.toLocaleString("en-IN")}`,
      icon: <AlertCircle size={20} />,
      color: "#c0392b",
      bg: "#fff0f0",
    },
  ];
  function StatCard({ title, value, icon, danger }: any) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-semibold">{title}</p>
          <p className={`text-lg font-bold ${danger ? "text-red-600" : ""}`}>
            ₹{Number(value).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e7eb] flex justify-center">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[420px] bg-[#f5f6f8] min-h-screen shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Milk size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-blue-700">Ganesh Dairy</h1>
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-300" />
        </div>

        {/* GREETING */}
        <div className="px-5 mt-6">
          <h2 className="text-2xl font-bold">Hi, Admin 👋</h2>
          <p className="text-gray-500 text-sm">
            Your dairy business at a glance
          </p>
        </div>

        {/* HERO CARD */}
        <div className="px-5 mt-6">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-xs tracking-widest opacity-80">
              OUTSTANDING BALANCE
            </p>

            <h1 className="text-4xl font-extrabold mt-2">
              ₹{stats.pending_amount.toLocaleString("en-IN")}
            </h1>

            <div className="flex justify-between mt-6 text-sm opacity-90">
              <div>
                <p>TOTAL BILLED</p>
                <p className="font-bold">
                  ₹{stats.month_sales.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p>TOTAL PAID</p>
                <p className="font-bold">
                  ₹
                  {(stats.month_sales - stats.pending_amount).toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 px-5 mt-6">
          <StatCard
            title="TODAY"
            value={stats.today_sales}
            icon={<IndianRupee />}
          />
          <StatCard
            title="THIS MONTH"
            value={stats.month_sales}
            icon={<TrendingUp />}
          />
          <StatCard
            title="CUSTOMERS"
            value={stats.customer_count}
            icon={<Users />}
          />
          <StatCard
            title="PENDING DUE"
            value={stats.pending_amount}
            icon={<AlertCircle />}
            danger
          />
        </div>

        {/* ADD ENTRY */}
        <div className="px-5 mt-6">
          <button
            onClick={onNewEntry}
            className="w-full h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg">
            <PlusCircle size={20} />
            Add Entry
          </button>
        </div>

        {/* RECENT */}
        <div className="px-5 mt-6 flex justify-between">
          <h3 className="font-bold text-lg">Recent Entries</h3>
          <span className="text-blue-600 text-sm">View All</span>
        </div>

        <div className="px-5 mt-3 space-y-3">
          {recentEntries.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-blue-600">
                  {e.profiles?.full_name?.[0] || "C"}
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {e.profiles?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{e.purchase_date}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  ₹{Number(e.total_amount).toLocaleString("en-IN")}
                </p>

                <button
                  onClick={() => onTogglePayment(e.id, e.payment_status)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition active:scale-95 ${
                    e.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                  {e.payment_status}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
