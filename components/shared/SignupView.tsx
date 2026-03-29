"use client";

import { useActionState, useState } from "react";
import { signupAction } from "@/actions/authActions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignupView() {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ SUCCESS SCREEN (same logic, new UI)
  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-green-600 text-5xl mb-4">✔</div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted</h2>
          <p className="text-gray-500 mb-6">{state.success}</p>

          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center px-6 py-10">
      {/* Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/40">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-blue-700">
            Ganesh Dairy
          </h1>
          <p className="text-xs text-gray-500 tracking-wide">
            CUSTOMER REGISTRATION
          </p>
        </div>

        <h2 className="text-xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Get started in seconds with our fresh delivery service.
        </p>

        {state?.error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl mb-4 text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* PERSONAL INFO */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">
              PERSONAL INFO
            </p>

            <input
              name="full_name"
              placeholder="Full Name"
              required
              className="w-full h-12 px-4 rounded-full bg-gray-100 focus:ring-2 focus:ring-blue-200 outline-none"
            />

            <input
              name="phone"
              placeholder="+91 00000 00000"
              className="w-full h-12 px-4 rounded-full bg-gray-100 mt-3 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          {/* ACCOUNT INFO */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">ACCOUNT INFO</p>

            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full h-12 px-4 rounded-full bg-gray-100 focus:ring-2 focus:ring-blue-200 outline-none"
            />

            <div className="relative mt-3">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                minLength={6}
                className="w-full h-12 px-4 pr-12 rounded-full bg-gray-100 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* OPTIONAL */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">OPTIONAL</p>

            <input
              name="address"
              placeholder="Street name, Apartment, City..."
              className="w-full h-12 px-4 rounded-full bg-gray-100 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition">
            {isPending ? "Submitting..." : "Request Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
