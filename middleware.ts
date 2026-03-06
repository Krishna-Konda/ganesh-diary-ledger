import { createClient } from "./lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

const adminPaths = ["/admin", "/admin/:path*"];
const publicPaths = ["/auth", "/", "/login", "/signup"];

export async function middleware(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  //Not login -- request to unauthorized pages
  if (!session && !publicPaths.some((p) => pathname.startsWith(p))) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirectUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  //Login But Try to access the Admin page -- Check Role
  if (
    session &&
    adminPaths.some((p) => pathname.startsWith(p.replace("/:path*", "")))
  ) {
    const role = session.user.app_metadata.role as string | undefined;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|_next).*)"],
};
