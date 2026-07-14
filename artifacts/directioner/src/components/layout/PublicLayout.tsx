import { Link, useLocation } from "wouter";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/features",   label: "Features"   },
  { href: "/commands",   label: "Commands"   },
  { href: "/use-cases",  label: "Use Cases"  },
  { href: "/pricing",    label: "Pricing"    },
  { href: "/about",      label: "About"      },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Three-dot cluster */}
      <div className="flex gap-[3px] items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: i === 1 ? 7 : 5, height: i === 1 ? 7 : 5, background: light ? "#000" : "#FFE500" }}
            whileHover={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        ))}
      </div>
      <span
        className="font-display font-bold text-[15px] tracking-tight transition-colors"
        style={{ color: light ? "#000" : "#fff", letterSpacing: "-0.02em" }}
      >
        Directioner
      </span>
    </Link>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  if (location.startsWith("/dashboard")) return null;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(7,7,8,0.92)" : "rgba(7,7,8,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)"}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative font-mono text-[11px] uppercase tracking-wide transition-colors"
                  style={{ color: active ? "#fff" : "rgba(255,255,255,0.42)" }}
                >
                  <span className="hover:text-white transition-colors">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-[1px] left-0 right-0 h-px bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="font-mono text-[11px] uppercase tracking-wide px-4 py-2 transition-all"
                style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-mono text-[11px] uppercase tracking-wide transition-colors"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide font-bold px-4 py-2 transition-all"
                    style={{ background: "#FFE500", color: "#000" }}
                  >
                    Add to Discord
                    <ArrowUpRight size={12} />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col pt-14"
            style={{ background: "rgba(7,7,8,0.98)", backdropFilter: "blur(30px)" }}
          >
            <div className="px-6 py-8 space-y-1">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-display font-bold text-3xl text-white/80 hover:text-white transition-colors py-3"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-6 mt-auto pb-10 space-y-3">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block bg-primary text-black font-mono text-sm font-bold uppercase tracking-wide py-4 text-center"
              >
                Add to Discord ↗
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-white/40 font-mono text-sm uppercase tracking-wide py-3 text-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const [location] = useLocation();
  if (location.startsWith("/dashboard")) return null;

  return (
    <footer style={{ background: "#070708", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="flex flex-col md:flex-row justify-between gap-14 mb-14">
          <div className="max-w-xs">
            <Logo />
            <p className="font-mono text-[11px] leading-relaxed mt-5"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              Production-grade AI for Discord communities. Memory, voice, and 12 AI modes in one bot.
            </p>
          </div>

          <div className="flex gap-14 font-mono text-[11px] uppercase">
            <div className="flex flex-col gap-3">
              <span className="text-primary text-[9px] tracking-[0.2em] mb-1">Product</span>
              {["/features", "/commands", "/use-cases", "/pricing"].map((href) => (
                <Link key={href} href={href}
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                >
                  {href.slice(1).replace(/-/g, " ")}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-primary text-[9px] tracking-[0.2em] mb-1">Company</span>
              {["/about", "/faq", "/contact"].map((href) => (
                <Link key={href} href={href}
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                >
                  {href.slice(1)}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-primary text-[9px] tracking-[0.2em] mb-1">Legal</span>
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <a key={l} href="#"
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Directioner. All rights reserved.
          </div>
          <div className="font-mono text-[10px] flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.2)" }}>
            Payments by
            <span className="text-primary font-bold ml-1">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
