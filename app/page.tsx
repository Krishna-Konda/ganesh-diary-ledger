"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Home() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .limit(5);
      if (error) {
        setError(error.message);
        console.error(error);
      } else {
        setCustomers(data || []);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Ganesh Dairy – Test Connection</h1>

      {error && (
        <div style={{ color: "red", margin: "1rem 0" }}>ERROR: {error}</div>
      )}

      <h2>Customers ({customers.length})</h2>
      <pre>{JSON.stringify(customers, null, 2)}</pre>
    </main>
  );
}
