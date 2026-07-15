/**
 * Shared motion primitives — used across every page.
 * Design system: #070708 bg, white text, yellow accent (#FFE500), JetBrains Mono labels.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

/** Word-by-word upward reveal */
export function SplitReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: "0.28em", verticalAlign: "top" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.065,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Fade + slide-up wrapper */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Horizontal line that draws left → right on scroll entry */
export function DrawLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full h-px overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
      <motion.div
        className="h-full"
        style={{ background: "rgba(255,255,255,0.12)" }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/** Section number + label chip */
export function SectionTag({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <Reveal className="flex items-center gap-3 mb-12">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "rgba(255,255,255,0.25)" }}>
        {number}
      </span>
      <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.08)" }} />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "rgba(255,255,255,0.25)" }}>
        {label}
      </span>
    </Reveal>
  );
}

/** Reusable page hero — dark bg with gradient glow */
/** deeo.studio / lapz.io style page hero — left-anchored, cinematic, optional full-bleed image */
export function PageHero({
  eyebrow,
  heading,
  sub,
  cta,
  image,
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  cta?: { label: string; href: string };
  image?: string;
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#070708", paddingTop: "clamp(120px, 14vw, 180px)", paddingBottom: "clamp(60px, 8vw, 100px)" }}
    >
      {/* Optional full-bleed image */}
      {image && (
        <div className="absolute inset-0 pointer-events-none">
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.2) saturate(0.6)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(7,7,8,0.98) 0%, rgba(7,7,8,0.7) 60%, rgba(7,7,8,0.4) 100%)" }} />
        </div>
      )}

      {/* Subtle gradient when no image */}
      {!image && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 0% 100%, rgba(255,229,0,0.03) 0%, transparent 60%)" }} />
      )}

      <div className="grain-overlay" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {eyebrow && (
          <Reveal>
            <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-8"
              style={{ color: "rgba(255,255,255,0.22)" }}>
              {eyebrow}
            </div>
          </Reveal>
        )}
        <h1 className="font-display font-bold text-white leading-[0.88] tracking-tight mb-6"
          style={{ fontSize: "clamp(52px, 9vw, 120px)" }}>
          <SplitReveal text={heading} delay={0.05} />
        </h1>
        {sub && (
          <Reveal delay={0.22}>
            <p className="font-mono text-sm leading-relaxed max-w-lg"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              {sub}
            </p>
          </Reveal>
        )}
        {cta && (
          <Reveal delay={0.32}>
            <Link href={cta.href}
              className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 mt-8 transition-all"
              style={{ background: "#FFE500", color: "#000" }}>
              {cta.label} <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Card with hover glow tied to mouse position */
export function GlowCard({
  children,
  className,
  accentColor = "#FFE500",
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{
        background: "#0f0f12",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      whileHover={{ y: -3 }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}25`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${accentColor}08`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

/** Dark form input — consistent across all pages */
export function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="font-mono text-[10px] uppercase tracking-widest block"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
        style={{
          background: "#0f0f12",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
      />
    </div>
  );
}

/** Primary CTA button */
export function PrimaryBtn({
  children,
  type = "button",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 transition-all disabled:opacity-40"
      style={{ background: "#FFE500", color: "#000" }}
    >
      {children}
    </button>
  );
}
