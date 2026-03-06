import { promoteAdmin } from "@/app/actions/promote-admin";
import { createClient } from "@/lib/supabase/server";

export default async function adminPage() {
  const admin = await createClient();
  const {
    data: { user },
  } = await admin.auth.getUser();

  if (!user) return <div>No login ,signin first </div>;

  const role = user.app_metadata?.role;

  return (
    <div>
      <h1>Promoto me If my Gamil is {user.email}</h1>
      <p>
        Role: <strong>[{role ?? "NOT set"}]</strong>
      </p>
      <form action={promoteAdmin}>
        <button
          className="justify-center border border-amber-200 background-color-red"
          type="submit">
          Promote me
        </button>
      </form>
    </div>
  );
}
