"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/actions/authActions";
import { Eye, EyeOff } from "lucide-react";

export default function LoginView() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6">
      {/* Glass Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl p-10 border border-white/30">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Ganesh Dairy
          </h1>
          <p className="text-gray-500 text-sm mt-1">Premium Customer Portal</p>
        </div>

        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Sign in to access your dashboard</p>

        {state?.error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl mb-4 text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full mt-2 h-12 px-4 rounded-full bg-white/80 border border-gray-200 focus:ring-4 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <div className="relative mt-2">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full h-12 px-4 pr-12 rounded-full bg-white/80 border border-gray-200 focus:ring-4 focus:ring-blue-200 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition">
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New customer?{" "}
          <a href="/signup" className="text-blue-600 font-semibold">
            Request account
          </a>
        </p>
      </div>
    </div>
  );
}
