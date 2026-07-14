import { Link, useLocation } from "wouter";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  if (location.startsWith("/dashboard")) return null;

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b",
          isScrolled
            ? "bg-primary border-transparent"
            : "bg-[#0D0D0D]/95 border-border backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo — motion.dev style: icon + text */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <div key={i} className={cn(
                  "w-2 h-2 transition-colors",
                  isScrolled ? "bg-black" : "bg-primary"
                )} />
              ))}
            </div>
            <span className={cn(
              "font-display font-bold text-base tracking-tight transition-colors",
              isScrolled ? "text-black" : "text-white"
            )}>
              Directioner
            </span>
          </Link>

          {/* Nav links */}
          <div className={cn(
            "hidden md:flex items-center gap-6 font-mono text-[11px] uppercase font-medium transition-colors",
            isScrolled ? "text-black/70" : "text-white/70"
          )}>
            {[
              { href: "/features", label: "Features" },
              { href: "/commands", label: "Commands" },
              { href: "/use-cases", label: "Use Cases" },
              { href: "/explore", label: "Explore" },
              { href: "/pricing", label: "Pricing" },
              { href: "/faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "hover:opacity-100 transition-opacity",
                  location === href ? "opacity-100 font-bold" : "opacity-60"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className={cn(
                  "font-mono text-[11px] uppercase font-bold px-4 py-2 border transition-colors",
                  isScrolled
                    ? "border-black text-black hover:bg-black hover:text-primary"
                    : "border-border text-white hover:border-primary hover:text-primary"
                )}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "font-mono text-[11px] uppercase transition-opacity hover:opacity-100 opacity-60",
                    isScrolled ? "text-black" : "text-white"
                  )}
                >
                  Sign In
                </Link>
                {/* motion.dev-style corner-bracket CTA button */}
                <Link
                  href="/register"
                  className={cn(
                    "corner-brackets font-mono text-[11px] uppercase font-bold px-5 py-2 transition-colors",
                    isScrolled
                      ? "bg-black text-primary hover:bg-black/80"
                      : "bg-primary text-black hover:bg-white"
                  )}
                >
                  ADD TO DISCORD ↗
                </Link>
              </>
            )}
          </div>

          <button
            className={cn("md:hidden transition-colors", isScrolled ? "text-black" : "text-white")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed inset-0 z-40 bg-[#0D0D0D] pt-16 px-6 flex flex-col"
        >
          <div className="border-b border-border py-6 space-y-4 font-mono text-sm uppercase">
            {[
              { href: "/features", label: "Features" },
              { href: "/commands", label: "Commands" },
              { href: "/use-cases", label: "Use Cases" },
              { href: "/explore", label: "Explore" },
              { href: "/pricing", label: "Pricing" },
              { href: "/faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-primary transition-colors py-1">
                {label}
              </Link>
            ))}
          </div>
          <div className="pt-6 space-y-3">
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block bg-primary text-black font-mono text-sm font-bold uppercase py-3 text-center">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-white/70 font-mono text-sm uppercase py-2">
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-primary text-black font-mono text-sm font-bold uppercase py-3 text-center corner-brackets">
                  Add to Discord ↗
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

export function Footer() {
  const [location] = useLocation();
  if (location.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-border bg-card">
      {/* Top slash bar — motion.dev style */}
      <div className="flex items-center px-6 py-3 border-b border-border overflow-hidden">
        <span className="font-mono text-white/20 text-xs mr-4">+</span>
        <div className="flex-1 overflow-hidden">
          <div className="font-mono text-xs text-white/10 whitespace-nowrap animate-ticker inline-block">
            {"//".repeat(120)}
          </div>
        </div>
        <span className="font-mono text-white/20 text-xs ml-4">+</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-primary" />)}
              </div>
              <span className="font-display font-bold text-base text-white">Directioner</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mb-4">
              // DISCORD BOT ——————— V1.0.0
            </div>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
              Production-grade AI for Discord communities. Built for precision, performance, and scale.
            </p>
          </div>

          <div className="flex gap-12 md:gap-16 font-mono text-[11px] uppercase">
            <div className="flex flex-col gap-3">
              <span className="text-primary font-bold text-[10px] mb-1">Product</span>
              {["/features", "/commands", "/use-cases", "/explore", "/pricing"].map(href => (
                <Link key={href} href={href} className="text-muted-foreground hover:text-white transition-colors capitalize">
                  {href.slice(1).replace(/-/g, " ")}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-primary font-bold text-[10px] mb-1">Company</span>
              {["/about", "/faq", "/contact"].map(href => (
                <Link key={href} href={href} className="text-muted-foreground hover:text-white transition-colors capitalize">
                  {href.slice(1)}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-primary font-bold text-[10px] mb-1">Legal</span>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                <a key={l} href="#" className="text-muted-foreground hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Directioner. All rights reserved.
          </div>
          <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
            Payments by
            <span className="text-primary font-bold ml-1">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
