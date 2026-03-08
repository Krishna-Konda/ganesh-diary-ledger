// components/AuthForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Milk, LogIn, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurrentUser } from "@/actions/auth";

const supabase = createClient();

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [role, setrole] = useState<"admin" | "customer">("customer");

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("Google sign-in error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage("");

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    let result;

    if (isSignUp) {
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: "customer" }, // default -role admin created manually
        },
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    const { error: authError, data } = result;

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (isSignUp) {
      // Supabase hosted projects usually require email confirmation
      setMessage(
        "Sign up successful! Check your email to confirm (if required).",
      );

      //create and add the user in the database
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          role: "customer",
        });

        if (profileError) {
          console.log("Profilesetup error", profileError);
          setError("Account Created but profile setup err contact admin");
        }
      }
    } else {
      setMessage("Signed in successfully!");

      // Get user with role and redirect accordingly
      const user = await getCurrentUser();
      if (user) {
        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <Card className="w-full mx-auto max-w-md border-amber-800/40 shadow-2xl bg-gradient-to-b from-amber-50 to-amber-100/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center border-b border-amber-800/20 pb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Milk className="h-10 w-10 text-emerald-700" strokeWidth={1.8} />
          <CardTitle className="text-3xl font-serif text-amber-950">
            Ganesh Dairy
          </CardTitle>
        </div>
        <CardDescription className="text-base text-amber-800/90">
          Ledger • Since 2000
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8 pb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-amber-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-amber-400 focus:border-emerald-600 focus:ring-emerald-500 bg-white/70"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-amber-900">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-amber-400 focus:border-emerald-600 focus:ring-emerald-500 bg-white/70"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="bg-emerald-50 border-emerald-400 text-emerald-900">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-6 text-lg shadow-md">
            {loading ? (
              "Processing..."
            ) : isSignUp ? (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t border-amber-800/20 pt-4">
        <Button
          variant="ghost"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-amber-800 hover:text-emerald-700 hover:bg-amber-100/50">
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-amber-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-b from-amber-50 to-amber-100/80 px-4 text-amber-700">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-10 text-base font-medium border-amber-400 hover:bg-amber-50 hover:text-emerald-800 flex items-center justify-center gap-3 shadow-sm">
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.25z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.73 20.44 6.93 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
            />
            <path
              fill="#EA4335"
              d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.93 0 2.73 2.56.96 6.34l4.55 2.45C6.42 6.02 8.98 4.98 12 4.98z"
            />
          </svg>
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
