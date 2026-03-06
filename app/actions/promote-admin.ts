"use server";

import { getAdminClient } from "@/lib/supabase/admin";
import { success } from "zod";

export async function promoteAdmin() {
  const adminClient = await getAdminClient();
  await adminClient.auth.refreshSession();

  const adminUID = process.env.ADMIN_UID!;

  const { data, error } = await adminClient.auth.admin.updateUserById(
    adminUID,
    { app_metadata: { role: "admin" } },
  );

  return { success: true, user: data.user };
}
