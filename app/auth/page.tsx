// app/auth/page.tsx   (or rename your existing page)
"use client";

import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <AuthForm />
    </div>
  );
}
