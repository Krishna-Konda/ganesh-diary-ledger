// ============================================================
// AGENT 10 — middleware.ts  (project root)
// Route guard: reads profiles.role and is_approved
// Redirects unauthenticated / wrong-role users
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Public paths — always allow ────────────────────────────
  const publicPaths = ["/login", "/signup"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    // If already logged in, redirect to their dashboard
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const dest =
        user.app_metadata?.role === "admin"
          ? "/admin/dashboard"
          : "/customer/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return response;
  }

  // ── Not logged in → login ───────────────────────────────────
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Fetch role ──────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", user.id)
    .single();

  const isAdmin = user.app_metadata?.role === "admin";
  const isApproved = profile?.is_approved === true;

  // ── Customer not approved ───────────────────────────────────
  if (!isAdmin && !isApproved && pathname !== "/pending") {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // ── Customer tries admin route ──────────────────────────────
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/customer/dashboard", request.url));
  }

  // ── Admin tries customer route ──────────────────────────────
  if (pathname.startsWith("/customer") && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboards", request.url));
  }

  // ── Root redirect ───────────────────────────────────────────
  if (pathname === "/") {
    const dest = isAdmin ? "/admin/dashboards" : "/customer/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
