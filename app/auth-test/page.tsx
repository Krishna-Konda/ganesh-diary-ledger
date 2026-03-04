"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");

  // TODO: add your signUp and signIn functions here

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Auth Test Page</h1>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Sign Up (TODO)</button>
      <button>Sign In (TODO)</button>
      <p>
        Current user:{" "}
        {user ? JSON.stringify(user.user_metadata) : "Not logged in"}
      </p>
      <p>{message}</p>
    </main>
  );
}
