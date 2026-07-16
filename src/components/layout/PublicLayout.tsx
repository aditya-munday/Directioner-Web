import { Link, useLocation } from "wouter";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/features",  label: "Features"  },
  { href: "/commands",  label: "Commands"  },
  { href: "/pricing",   label: "Pricing"   },
  { href: "/docs",      label: "Docs"      },
  { href: "/blog",      label: "Blog"      },
  { href: "/about",     label: "About"     },
];

/* ─── Inline SVG icons ────────────────────────────────────────────── */

function DiscordIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TwitterIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function GitHubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/* ─── Logo ────────────────────────────────────────────────────────── */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <motion.div
        className="flex gap-[3px] items-center"
        whileHover={{ scale: 1.12, rotate: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i === 1 ? 7 : 5,
              height: i === 1 ? 7 : 5,
              background: light ? "#000" : "#FFE500",
            }}
          />
        ))}
      </motion.div>
      <span
        className="font-display font-bold text-[15px] tracking-tight transition-colors"
        style={{ color: light ? "#000" : "#fff", letterSpacing: "-0.02em" }}
      >
        Directioner
      </span>
    </Link>
  );
}

/* ─── Announcement Bar ────────────────────────────────────────────── */

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      key="ann-bar"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 36, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
      style={{ background: "#FFE500" }}
    >
      <div className="h-9 flex items-center justify-center px-4 relative">
        <span className="font-mono text-[10px] text-black tracking-wide text-center">
          ✦ Directioner v2 — 31 AI personalities now live&nbsp;&nbsp;→&nbsp;&nbsp;
          <a href="#" className="underline underline-offset-2 font-bold">Add to Discord</a>
        </span>
        <button
          onClick={onDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────── */

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [annDismissed, setAnnDismissed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("dir_ann_dismissed") === "1"
  );
  const { user } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  const handleDismiss = () => {
    sessionStorage.setItem("dir_ann_dismissed", "1");
    setAnnDismissed(true);
  };

  if (location.startsWith("/dashboard")) return null;

  const showAnn = !annDismissed && !location.startsWith("/dashboard");

  return (
    <>
      {/* Announcement bar */}
      <AnimatePresence>
        {showAnn && (
          <div className="fixed top-0 left-0 right-0 z-[60]">
            <AnnouncementBar onDismiss={handleDismiss} />
          </div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.nav
        className="fixed left-0 right-0 z-50 transition-all duration-300"
        style={{
          top: showAnn ? 36 : 0,
          background: scrolled ? "rgba(7,7,8,0.92)" : "rgba(7,7,8,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)"}`,
        }}
        animate={{ top: showAnn ? 36 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
            {/* Discord icon button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              aria-label="Join Discord"
            >
              <DiscordIcon size={16} />
            </motion.a>

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
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — slide in from right */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "rgba(7,7,8,0.98)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
          >
            {/* Close button */}
            <div className="flex justify-end p-6 pt-5">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-1 flex-1">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                className="flex items-center justify-center gap-2 bg-primary text-black font-mono text-sm font-bold uppercase tracking-wide py-4"
              >
                Add to Discord <ArrowUpRight size={15} />
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

/* ─── Footer ──────────────────────────────────────────────────────── */

export function Footer() {
  const [location] = useLocation();
  if (location.startsWith("/dashboard")) return null;

  return (
    <footer style={{ background: "#070708" }}>
      {/* Pre-footer CTA band */}
      <div
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: "#0a0a0c", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(255,229,0,0.05) 0%, transparent 70%)" }} />
        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-display font-bold text-white tracking-tight mb-3"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.02em" }}
            >
              Ready to transform your Discord?
            </h2>
            <p className="font-mono text-sm text-white/40 mb-8">
              Add Directioner free. No credit card required.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 transition-all"
                  style={{ background: "#FFE500", color: "#000" }}
                >
                  Add to Discord
                  <ArrowUpRight size={15} />
                </Link>
              </motion.div>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide px-7 py-3.5 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                }}
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* 4-col grid */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Col 1: Logo + tagline */}
          <div>
            <Logo />
            <p
              className="font-mono text-[11px] leading-relaxed mt-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              The AI bot your Discord deserves.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="flex flex-col gap-3">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1"
              style={{ color: "#FFE500" }}
            >
              Product
            </span>
            {[
              { href: "/features",  label: "Features"   },
              { href: "/commands",  label: "Commands"   },
              { href: "/pricing",   label: "Pricing"    },
              { href: "/docs",      label: "Docs"       },
              { href: "/use-cases", label: "Use Cases"  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-wide transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col gap-3">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1"
              style={{ color: "#FFE500" }}
            >
              Company
            </span>
            {[
              { href: "/about",    label: "About"   },
              { href: "/blog",     label: "Blog"    },
              { href: "/careers",  label: "Careers" },
              { href: "/faq",      label: "FAQ"     },
              { href: "/contact",  label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-wide transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Col 4: Connect */}
          <div className="flex flex-col gap-3">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1"
              style={{ color: "#FFE500" }}
            >
              Connect
            </span>
            <div className="flex flex-col gap-4 mt-1">
              {[
                { icon: <DiscordIcon size={18} />, label: "Discord",   href: "#" },
                { icon: <TwitterIcon size={18} />, label: "Twitter/X", href: "#" },
                { icon: <GitHubIcon  size={18} />, label: "GitHub",    href: "#" },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide transition-colors group"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.32)")}
                >
                  <span className="transition-colors">{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            © 2026 Directioner · All rights reserved
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/careers" className="hover:text-white/50 transition-colors">Careers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
