"use client";

import {
  Milk,
  LogOut,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { Profile, CustomerBalance, MonthGroup } from "@/types/database";

interface Props {
  profile: Profile | null;
  balance: CustomerBalance | null;
  months: MonthGroup[];
  loading: boolean;
  expandedMonth: string | null;
  onToggleMonth: (key: string) => void;
  onLogout: () => void;
  onDownload: (month: MonthGroup) => void;
}

export default function CustomerDashboardView({
  profile,
  balance,
  months,
  loading,
  expandedMonth,
  onToggleMonth,
  onLogout,
  onDownload,
}: Props) {
  const outstanding = balance?.outstanding ?? 0;

  return (
    <div className="min-h-screen bg-[#f3f8ff] flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white/70 backdrop-blur-xl">
        {/* HEADER */}
        <header className="flex justify-between items-center px-5 py-4 bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
              <Milk size={18} color="#fff" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">
                Ganesh Dairy
              </p>
              <p className="text-sm font-bold text-gray-800">
                {loading
                  ? "Loading..."
                  : `Hi, ${profile?.full_name?.split(" ")[0] || "Customer"}`}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
            <LogOut size={16} className="text-gray-600" />
          </button>
        </header>

        <main className="p-5 space-y-6">
          {/* BALANCE CARD */}
          <div className="relative rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-xl overflow-hidden">
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider opacity-80">
                Outstanding Balance
              </p>

              {outstanding <= 0 ? (
                <span className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle2 size={12} /> Cleared
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-red-400/30 px-3 py-1 rounded-full">
                  <AlertCircle size={12} /> Due
                </span>
              )}
            </div>

            <h2 className="text-4xl font-extrabold mt-3">
              ₹{loading ? "—" : Math.abs(outstanding).toLocaleString("en-IN")}
            </h2>

            <div className="flex justify-between mt-6 bg-white/20 rounded-xl p-3 text-sm">
              <div>
                <p className="opacity-70 text-xs">Billed</p>
                <p className="font-bold">
                  ₹{(balance?.total_billed ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="opacity-70 text-xs">Paid</p>
                <p className="font-bold">
                  ₹{(balance?.total_paid ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* MONTHS */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-gray-800">
              Monthly Statements
            </h3>

            {loading ? (
              <p className="text-center text-gray-400 py-10">
                Loading your records…
              </p>
            ) : months.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No purchases yet
              </p>
            ) : (
              <div className="space-y-3">
                {months.map((m) => {
                  const open = expandedMonth === m.key;

                  return (
                    <div
                      key={m.key}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* HEADER */}
                      <button
                        onClick={() => onToggleMonth(m.key)}
                        className="w-full flex justify-between items-center p-4">
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">
                            {m.label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {m.total_litres}L • {m.purchases.length} entries
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                m.pending_amount > 0
                                  ? "text-red-500"
                                  : "text-green-600"
                              }`}>
                              ₹{m.pending_amount.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-gray-400">
                              {m.pending_amount > 0 ? "pending" : "settled"}
                            </p>
                          </div>

                          {open ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </button>

                      {/* BODY */}
                      {open && (
                        <div className="px-4 pb-4 border-t">
                          {/* SUMMARY */}
                          <div className="grid grid-cols-3 gap-2 text-center text-sm mt-4">
                            <div>
                              <p className="text-gray-400 text-xs">Billed</p>
                              <p className="font-bold">
                                ₹{m.total_amount.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Paid</p>
                              <p className="font-bold text-green-600">
                                ₹{m.paid_amount.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Pending</p>
                              <p
                                className={`font-bold ${
                                  m.pending_amount > 0
                                    ? "text-red-500"
                                    : "text-green-600"
                                }`}>
                                ₹{m.pending_amount.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>

                          {/* ROWS */}
                          <div className="mt-3 space-y-3">
                            {m.purchases.map((p) => (
                              <div
                                key={p.id}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div className="flex gap-3 items-center">
                                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Milk size={14} className="text-blue-600" />
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold">
                                      {p.quantity}L Milk
                                    </p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                      <Clock size={10} />
                                      {p.purchase_date}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="font-bold text-sm">
                                    ₹
                                    {Number(p.total_amount).toLocaleString(
                                      "en-IN",
                                    )}
                                  </p>

                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      p.payment_status === "paid"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-500"
                                    }`}>
                                    {p.payment_status === "paid"
                                      ? "Paid"
                                      : "Pending"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* DOWNLOAD */}
                          <button
                            onClick={() => onDownload(m)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                            <Download size={14} />
                            Download Statement
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
