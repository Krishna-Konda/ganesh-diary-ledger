"use client";

import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabase = createClient();

export default function AuthTest() {
  return (
    <div className="min-h-screen bg-[#f8f1e3] font-serif flex items-center justify-center">
      {" "}
      {/* old paper background */}
      <Card className="w-full max-w-md border-2 border-[#3f2a1e] shadow-xl bg-white/95">
        <CardHeader className="text-center border-b border-[#3f2a1e]">
          <CardTitle className="text-3xl text-[#3f2a1e]">
            Ganesh Dairy
          </CardTitle>
          <p className="text-sm text-[#166534]">Ledger • Since 2000</p>
        </CardHeader>
        <CardContent className="p-8">
          {/* AuthForm will go here in next step */}
          <p className="text-center text-[#3f2a1e]">
            Auth form coming — prove structure first
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
