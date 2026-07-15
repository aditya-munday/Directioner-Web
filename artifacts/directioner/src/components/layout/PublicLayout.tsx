import { Link, useLocation } from "wouter";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/features",  label: "Features"  },
  { href: "/commands",  label: "Commands"  },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/pricing",   label: "Pricing"   },
  { href: "/about",     label: "About"     },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="flex gap-[3px] items-center">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="rounded-full"
            style={{ width: i === 1 ? 7 : 5, height: i === 1 ? 7 : 5, background: "#FFE500" }}
            whileHover={{ scale: 1.5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} />
        ))}
      </div>
      <span className="font-display font-bold text-[15px] text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
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

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 60)), [scrollY]);
  if (location.startsWith("/dashboard")) return null;

  return (
    <>
      {/* ── Nav bar ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          background: scrolled ? "rgba(7,7,8,0.95)" : "transparent",
          borderBottomColor: scrolled ? "rgba(255,255,255,0.06)" : "transparent",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
        transition={{ duration: 0.25 }}
        style={{ backdropFilter: scrolled ? "blur(24px)" : "none", WebkitBackdropFilter: scrolled ? "blur(24px)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />

          {/* Desktop links — deeo.studio style: spaced mono, no underline accent just opacity */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const active = location === href;
              return (
                <Link key={href} href={href}
                  className="relative font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
                  style={{ color: active ? "#fff" : "rgba(255,255,255,0.38)" }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}
                >
                  {label}
                  {active && (
                    <motion.div layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: "#FFE500" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA right */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard"
                className="font-mono text-[11px] uppercase tracking-wide px-5 py-2 transition-all"
                style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="font-mono text-[11px] uppercase tracking-wide transition-colors"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/register"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide font-bold px-5 py-2.5 transition-all"
                    style={{ background: "#FFE500", color: "#000" }}>
                    Add to Discord <ArrowUpRight size={11} />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden transition-colors" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "rgba(255,255,255,0.55)" }} aria-label="Menu">
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} /></motion.div>
                : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={22} /></motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile full-screen menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col pt-16"
            style={{ background: "rgba(7,7,8,0.98)", backdropFilter: "blur(30px)" }}>
            <div className="px-8 py-10 space-y-1">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div key={href}
                  initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={href} onClick={() => setMobileOpen(false)}
                    className="block font-display font-bold text-4xl py-3 transition-colors"
                    style={{ color: location === href ? "#fff" : "rgba(255,255,255,0.45)", letterSpacing: "-0.03em" }}>
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-8 mt-auto pb-12 space-y-3">
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 font-mono text-sm font-bold uppercase tracking-wide py-4"
                style={{ background: "#FFE500", color: "#000" }}>
                Add to Discord ↗
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block text-center font-mono text-sm uppercase tracking-wide py-3"
                style={{ color: "rgba(255,255,255,0.35)" }}>
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-14 mb-16">
          <div className="max-w-xs">
            <Logo />
            <p className="font-mono text-[11px] leading-relaxed mt-5" style={{ color: "rgba(255,255,255,0.28)" }}>
              Production-grade AI for Discord communities. Memory, voice, and 12 AI modes in one bot.
            </p>
            {/* Discord CTA */}
            <Link href="/register"
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide px-4 py-2.5 transition-all"
              style={{ border: "1px solid rgba(255,229,0,0.25)", color: "#FFE500", background: "rgba(255,229,0,0.04)" }}>
              Add to Discord ↗
            </Link>
          </div>

          <div className="flex flex-wrap gap-14 font-mono text-[11px]">
            {[
              { heading: "Product",  links: ["/features", "/commands", "/use-cases", "/pricing"] },
              { heading: "Company",  links: ["/about", "/faq", "/contact"] },
              { heading: "Legal",    links: ["#privacy", "#terms", "#cookies"], labels: ["Privacy", "Terms", "Cookies"] },
            ].map(col => (
              <div key={col.heading} className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: "#FFE500", opacity: 0.7 }}>{col.heading}</span>
                {(col.labels ?? col.links.map(h => h.slice(1).replace(/-/g, " "))).map((label, i) => (
                  <Link key={i} href={col.links[i]}
                    className="capitalize transition-colors"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)"; }}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Directioner. All rights reserved.
          </div>
          <div className="font-mono text-[10px] flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
            Payments by <span className="font-bold" style={{ color: "#FFE500" }}>Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
