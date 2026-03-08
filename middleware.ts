import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create a response to mutate
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("Middleware: Accessing admin route");
    console.log("Middleware: User exists?", !!user);
    console.log("Middleware: User ID:", user?.id);

    if (!user) {
      console.log("Middleware: No user, redirecting to auth");
      // Not logged in, redirect to auth
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Check if user is admin by fetching profile
    console.log("Middleware: Checking admin role...");

    try {
      // Use the regular authenticated client which has the user session
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      console.log("Middleware: Profile query result:", { profile, error });
      console.log("Middleware: User role:", profile?.role);

      if (error) {
        console.error("Middleware: Profile fetch error:", error.message);
        // If there's an error fetching profile, redirect to dashboard as precaution
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (profile?.role !== "admin") {
        console.log("Middleware: Not admin, redirecting to dashboard");
        // Not admin, redirect to customer dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      console.log("Middleware: Admin verified, allowing access");
    } catch (error) {
      console.error("Middleware: Error checking admin role:", error);
      // On error, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Check if accessing customer dashboard
  if (request.nextUrl.pathname === "/dashboard") {
    if (!user) {
      // Not logged in, redirect to auth
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard"],
};
