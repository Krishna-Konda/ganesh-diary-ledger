import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const adminPaths = ["/admin", "/admin/:path*"];
const publicPaths = ["/auth", "/", "/login", "/signup"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = await createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value); // for server components
            supabaseResponse.cookies.set(name, value, options); // for browser
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  //Not login -- request to unauthorized pages
  if (!user && !publicPaths.some((p) => pathname.startsWith(p))) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirectUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  //Login But Try to access the Admin page -- Check Role
  if (
    user &&
    adminPaths.some((p) => pathname.startsWith(p.replace("/:path*", "")))
  ) {
    const role = user?.app_metadata.role as string | undefined;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|_next).*)"],
};
