import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

/**
 * /auth/callback
 * Handles the redirect after Supabase OAuth (Discord, Google) and
 * email magic-link / verification flows. The Supabase client picks
 * up the code/token from the URL fragment / query automatically when
 * detectSessionInUrl is true — we just need to wait for the session
 * and redirect accordingly.
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const waitForSession = async () => {
      const start = Date.now();
      const timeoutMs = 10_000;
      const intervalMs = 500;

      while (isMounted && Date.now() - start < timeoutMs) {
        const { data: { session }, error: err } = await supabase.auth.getSession();
        if (err) {
          setError(err.message);
          return;
        }
        if (session) {
          setLocation("/dashboard");
          return;
        }
        await new Promise((r) => setTimeout(r, intervalMs));
      }

      setError("Authentication timed out. Please try again.");
    };

    void waitForSession();

    return () => {
      isMounted = false;
    };
  }, [setLocation]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-sm w-full p-8 text-center space-y-4">
          <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs uppercase">
            // ERROR: {error}
          </div>
          <button
            onClick={() => setLocation("/login")}
            className="font-mono text-xs uppercase text-primary hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-primary mx-auto" size={32} />
        <p className="font-mono text-xs uppercase text-muted-foreground">
          Completing sign-in...
        </p>
      </div>
    </div>
  );
}
