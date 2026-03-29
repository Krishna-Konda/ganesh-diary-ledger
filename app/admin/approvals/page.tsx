"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPendingCustomers } from "@/lib/models/profileModel";
import {
  approveCustomerAction,
  rejectCustomerAction,
} from "@/actions/profileAction";
import { ArrowLeft, UserCheck, UserX, Clock, Milk } from "lucide-react";
import type { Profile } from "@/types/database";

export default function ApprovalsPage() {
  const router = useRouter();
  const [pending, setPending] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await getPendingCustomers();
    setPending(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id: string) {
    setProcessing(id);
    await approveCustomerAction(id);
    await load();
    setProcessing(null);
  }

  async function handleReject(id: string) {
    if (!confirm("Reject and delete this customer?")) return;
    setProcessing(id);
    await rejectCustomerAction(id);
    await load();
    setProcessing(null);
  }

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[420px] bg-gray-100 min-h-screen px-4 py-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-blue-700" />
          </button>
          <h1 className="text-lg font-bold text-blue-700">Approvals</h1>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            👤
          </div>
        </div>

        {/* PENDING BANNER */}
        <div className="flex items-center gap-3 bg-orange-100 border border-orange-200 rounded-2xl p-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <p className="font-semibold text-orange-800">
              {pending.length} Pending Approval
            </p>
            <p className="text-sm text-orange-700">
              You have {pending.length} user request
              {pending.length !== 1 ? "s" : ""} waiting for review.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading…</p>
        ) : pending.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <div className="text-4xl mb-3">📥</div>
            <p className="font-semibold text-gray-500">
              No other pending approvals
            </p>
            <p className="text-sm">Check back later for new requests</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-2xl p-4 shadow-sm">
                {/* TOP */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
                    {(customer.full_name?.[0] || "?").toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-blue-900">
                      {customer.full_name || "No name"}
                    </h2>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-gray-400">{customer.phone}</p>
                    )}
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gray-200 my-4" />

                {/* DATE */}
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-500">Requested on:</span>
                  <span className="font-medium">
                    {new Date(customer.created_at).toLocaleDateString("en-IN")}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(customer.id)}
                    disabled={processing === customer.id}
                    className="flex-1 border border-red-400 text-red-500 rounded-full py-3 font-semibold flex items-center justify-center gap-2">
                    <UserX className="w-4 h-4" />
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(customer.id)}
                    disabled={processing === customer.id}
                    className="flex-1 bg-green-500 text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2 shadow-md">
                    <UserCheck className="w-4 h-4" />
                    {processing === customer.id ? "..." : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
