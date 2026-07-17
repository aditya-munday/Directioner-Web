import { useRef, useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, Clock, ChevronDown } from "lucide-react";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { MagneticElement } from "@/components/animations";

function Reveal({ children, className = "", delay = 0, y = 28 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function SplitReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: "0.28em", verticalAlign: "top" }}>
          <motion.span className="inline-block" initial={{ y: "110%", opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.7, delay: delay + i * 0.065, ease: [0.16, 1, 0.3, 1] }}>
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Animated count-up ── */
function CountUp({ to, duration = 1.5, delay = 0, suffix = "" }: { to: number; duration?: number; delay?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * to));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [inView, to, duration, delay]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const openings = [
  { dept: "Engineering", roles: [
    { title: "Senior Backend Engineer", location: "Remote", type: "Full-time", level: "Senior" },
    { title: "ML Infrastructure Engineer", location: "Remote", type: "Full-time", level: "Senior" },
    { title: "Frontend Engineer (React)", location: "Remote", type: "Full-time", level: "Mid-Senior" },
  ]},
  { dept: "Product", roles: [
    { title: "Senior Product Manager", location: "Remote", type: "Full-time", level: "Senior" },
    { title: "Product Designer", location: "Remote", type: "Full-time", level: "Mid" },
  ]},
  { dept: "Growth", roles: [
    { title: "Community Growth Lead", location: "Remote", type: "Full-time", level: "Mid" },
    { title: "Developer Relations Engineer", location: "Remote", type: "Full-time", level: "Mid-Senior" },
  ]},
  { dept: "Operations", roles: [
    { title: "Head of Customer Success", location: "Remote", type: "Full-time", level: "Lead" },
  ]},
];

const perks = [
  { emoji: "🌍", title: "Fully Remote",     body: "Work from anywhere. Seriously — we have team members in 12 countries and counting.", color: "#0ea5e9" },
  { emoji: "💰", title: "Competitive Equity", body: "Meaningful equity packages. We're building something big and you should own a piece of it.", color: "#FFE500" },
  { emoji: "🏥", title: "Health & Wellness", body: "$500/month wellness stipend. Use it for gym, therapy, ergonomic gear — your call.", color: "#10b981" },
  { emoji: "📚", title: "Learning Budget",   body: "$3,000/year for courses, conferences, books, and whatever helps you grow.", color: "#a855f7" },
  { emoji: "🏖️", title: "Unlimited PTO",    body: "Minimum 3 weeks — we enforce it. Burnout helps nobody.", color: "#f43f5e" },
  { emoji: "🖥️", title: "Home Office Setup", body: "$2,000 one-time equipment budget plus a monthly internet stipend.", color: "#6366f1" },
];

function DeptAccordion({ dept, roles, index }: { dept: string; roles: typeof openings[0]["roles"]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: open ? "#FFE500" : "rgba(255,255,255,0.2)" }}
            animate={{ scale: open ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <span className="font-display font-bold text-white text-xl tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            {dept}
          </span>
          <motion.span
            className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1"
            style={{ color: "#FFE500", background: "rgba(255,229,0,0.08)", border: "1px solid rgba(255,229,0,0.15)" }}
            animate={{ borderColor: open ? "rgba(255,229,0,0.3)" : "rgba(255,229,0,0.15)" }}
          >
            {roles.length} open
          </motion.span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 space-y-3">
              {roles.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center justify-between p-5 cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,229,0,0.2)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,229,0,0.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div>
                    <div className="font-display font-bold text-white mb-2 tracking-tight" style={{ letterSpacing: "-0.01em" }}>{role.title}</div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30"><MapPin size={10} /> {role.location}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30"><Clock size={10} /> {role.type}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5" style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{role.level}</span>
                    </div>
                  </div>
                  <MagneticElement strength={0.2}>
                    <motion.div
                      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide px-4 py-2 shrink-0"
                      style={{ color: "#FFE500", border: "1px solid rgba(255,229,0,0.2)" }}
                      whileHover={{ scale: 1.05, background: "rgba(255,229,0,0.08)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Apply <ArrowUpRight size={11} />
                    </motion.div>
                  </MagneticElement>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Careers() {
  usePageTitle("Careers — Directioner");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const stats = [
    { n: 14,    suffix: "",    label: "Team members",  delay: 0.4 },
    { n: 12,    suffix: "",    label: "Countries",     delay: 0.47 },
    { n: 100,   suffix: "%",   label: "Remote",        delay: 0.54 },
    { n: 2.4,   suffix: "M",   label: "Seed round ($)", delay: 0.61 },
  ];

  return (
    <div style={{ background: "#070708" }}>
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative pt-40 pb-28 px-6 overflow-hidden">
        <div className="grain-overlay" />
        <motion.div
          className="absolute pointer-events-none"
          style={{ width: 700, height: 400, top: "-10%", right: "-10%", background: "radial-gradient(ellipse, rgba(255,229,0,0.07) 0%, transparent 70%)", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div className="max-w-7xl mx-auto relative" style={{ y: heroY }}>
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Careers</span>
          </Reveal>
          <h1 className="font-display font-bold text-white leading-[0.88] tracking-tight mt-4 mb-8" style={{ fontSize: "clamp(52px, 8vw, 110px)", letterSpacing: "-0.04em" }}>
            <SplitReveal text="Build the future" className="block" delay={0.05} />
            <SplitReveal text="of Discord." className="block text-white/30" delay={0.18} />
          </h1>
          <Reveal delay={0.3}>
            <p className="font-mono text-sm leading-relaxed max-w-[500px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              We're a small team doing ambitious things. If you want to define how AI interacts with communities at scale, you're in the right place.
            </p>
          </Reveal>

          {/* Stats row — animated count-up */}
          <div className="flex flex-wrap gap-10 mt-14">
            {stats.map((s, i) => (
              <Reveal key={i} delay={s.delay}>
                <div>
                  <div className="font-display font-bold text-white" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", letterSpacing: "-0.03em" }}>
                    {s.suffix === "M" ? (
                      <>$<CountUp to={s.n as number} delay={s.delay + 0.3} />{s.suffix}</>
                    ) : (
                      <><CountUp to={s.n as number} delay={s.delay + 0.3} suffix={s.suffix} /></>
                    )}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mt-1">{s.label}</div>
                  {/* Animated underline */}
                  <motion.div
                    className="h-px mt-2"
                    style={{ background: "#FFE500" }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: s.delay + 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Culture / Perks ── */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Why Directioner</span>
          </Reveal>
          <Reveal delay={0.05} className="mb-14">
            <h2 className="font-display font-bold text-white leading-[0.9] tracking-tight" style={{ fontSize: "clamp(32px, 4.5vw, 60px)", letterSpacing: "-0.03em" }}>
              Work on problems that matter.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="relative overflow-hidden cursor-default group"
                style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${perk.color}25`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Corner glow */}
                <div className="absolute top-0 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ width: 120, height: 120, background: `radial-gradient(ellipse at top right, ${perk.color}12, transparent)` }} />

                <BorderBeam color={perk.color} duration={6} delay={i * 0.3} size={60} />

                <div className="p-7">
                  <motion.div
                    className="text-3xl mb-4"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  >
                    {perk.emoji}
                  </motion.div>
                  <h3 className="font-display font-bold text-white text-lg mb-3 tracking-tight">{perk.title}</h3>
                  <p className="font-mono text-[11px] leading-relaxed text-white/40">{perk.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open roles ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Open Positions</span>
          </Reveal>
          <Reveal delay={0.05} className="mb-14">
            <h2 className="font-display font-bold text-white leading-[0.9] tracking-tight" style={{ fontSize: "clamp(32px, 4.5vw, 60px)", letterSpacing: "-0.03em" }}>
              Join the team.
            </h2>
          </Reveal>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {openings.map((dept, i) => (
              <DeptAccordion key={dept.dept} dept={dept.dept} roles={dept.roles} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── No role fit ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#0a0a0c", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(255,229,0,0.05) 0%, transparent 70%)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="max-w-2xl mx-auto text-center relative">
          <Reveal>
            <h2 className="font-display font-bold text-white mb-3 tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.03em" }}>
              Don't see your role?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono text-sm text-white/35 mb-8">
              We're always looking for exceptional people. Send us your work and tell us what you'd build.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <MagneticElement strength={0.3}>
              <motion.a
                href="mailto:careers@directioner.app"
                className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-10 py-5"
                style={{ background: "#FFE500", color: "#000" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Get in touch <ArrowUpRight size={15} />
              </motion.a>
            </MagneticElement>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
