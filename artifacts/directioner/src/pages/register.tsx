import { useState } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import { usePageTitle } from "@/hooks/use-page-title";
import { BlueprintBackground, Typewriter } from "@/components/animations";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Register() {
  usePageTitle("Register");
  const { register, user } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) return <Redirect to="/dashboard" />;

  // Password strength calculation
  const getStrength = (p: string) => {
    let score = 0;
    if (p.length > 7) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { needsVerification } = await register({ username, email, password });
      if (needsVerification) {
        setLocation("/auth/verify-email");
      } else {
        setLocation("/dashboard/onboarding");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background pt-16">
      {/* Right side decoration (mirrored from login) */}
      <BlueprintBackground className="hidden md:flex flex-1 flex-col items-center justify-center p-12 border-l border-border order-2">
        <div className="max-w-md w-full relative">
          <h1 className="text-4xl md:text-5xl font-display font-black leading-tight text-white mb-6">
            Join the <span className="text-primary block mt-2">vanguard.</span>
          </h1>
          <div className="font-mono text-xs border-l-2 border-primary pl-4 max-w-sm">
            <Typewriter speed={20} prefix="> " text="INITIALIZING NEW CREATOR PROFILE." />
          </div>
        </div>
      </BlueprintBackground>

      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 md:p-24 relative order-1">
        <div className="w-full max-w-sm mx-auto">
          <div className="md:hidden mb-12">
            <h1 className="text-3xl font-display font-black text-white">Register.</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-muted-foreground">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-card border border-border p-3 font-mono text-sm text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="aditya"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-card border border-border p-3 font-mono text-sm text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="developer@discord.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-muted-foreground">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-card border border-border p-3 font-mono text-sm text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
              
              {/* Custom Strength Indicator */}
              <div className="flex gap-1 h-1 mt-2">
                {[1, 2, 3, 4].map(level => (
                  <div 
                    key={level} 
                    className={cn(
                      "flex-1 transition-colors duration-300",
                      password.length === 0 ? "bg-border" :
                      level <= strength ? (
                        strength === 1 ? "bg-red-500" :
                        strength === 2 ? "bg-orange-500" :
                        strength === 3 ? "bg-yellow-500" : "bg-accent"
                      ) : "bg-border"
                    )}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs uppercase">
                // ERROR: {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-black font-mono font-bold px-6 py-4 uppercase text-sm corner-brackets hover:bg-primary/90 transition-colors flex justify-center items-center h-14"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </button>
          </form>

          <p className="mt-12 text-center font-mono text-xs text-muted-foreground uppercase">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
