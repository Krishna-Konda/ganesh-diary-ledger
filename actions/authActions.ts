"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ── Login ────────────────────────────────────────────────────
export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  // Fetch profile to determine role and approval status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", data.user.id)
    .single();

  if (!profile) return { error: "Account not found. Contact admin." };

  // Customer must be approved first
  if (profile.role === "customer" && !profile.is_approved) {
    await supabase.auth.signOut();
    return {
      error:
        "Your account is pending approval. Please wait for admin to approve.",
    };
  }

  revalidatePath("/", "layout");

  // Role-based redirect
  if (data.user.app_metadata.role === "admin") {
    redirect("/dashboard");
  } else {
    redirect("/customer/dashboard");
  }
}

// ── Signup (customer self-registration) ──────────────────────
export async function signupAction(
  _prevState: { error: string; success?: string } | null,
  formData: FormData,
): Promise<{ error: string; success?: string } | null> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!email || !password || !full_name) {
    return { error: "Name, email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone, address },
    },
  });

  if (error) return { error: error.message };

  return {
    error: "",
    success:
      "Account created! Please wait for admin approval before logging in.",
  };
}

// ── Logout ───────────────────────────────────────────────────
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
