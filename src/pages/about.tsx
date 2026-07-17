import { useRef } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Github, Twitter, MessageSquare } from "lucide-react";
import { PageHero, SectionTag, Reveal, DrawLine, SplitReveal } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { TextScramble } from "@/components/animations/TextScramble";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { MagneticElement } from "@/components/animations";

const techStack = [
  { name: "Discord.js v14", desc: "Real-time Discord API gateway",      color: "#5865F2" },
  { name: "Node.js 20",     desc: "Non-blocking event loop runtime",    color: "#6DA55F" },
  { name: "OpenAI GPT-4o",  desc: "Language model integration",         color: "#10b981" },
  { name: "PostgreSQL 16",  desc: "Primary relational database",        color: "#0ea5e9" },
  { name: "Redis 7",        desc: "Cache layer and session store",      color: "#f43f5e" },
  { name: "TypeScript 5",   desc: "Full type-safe codebase",            color: "#3b82f6" },
  { name: "WebSockets",     desc: "Real-time bidirectional comms",      color: "#a855f7" },
  { name: "WebRTC",         desc: "Native voice channel streaming",     color: "#FFE500" },
];

const roadmap = [
  { q: "Q1 2025", title: "Beta Launch",         desc: "Core text AI, basic memory",          status: "done"     },
  { q: "Q2 2025", title: "Voice Integration",   desc: "Real-time voice in channels",         status: "done"     },
  { q: "Q3 2025", title: "Multi-Mode",          desc: "/tutor /coder /chaos /creative",      status: "done"     },
  { q: "Q4 2025", title: "Analytics Dashboard", desc: "Usage tracking and web portal",       status: "done"     },
  { q: "Q1 2026", title: "V1.0 Production",     desc: "Stable release, SLAs",                status: "current"  },
  { q: "Q2 2026", title: "API Access",          desc: "Third-party integrations",            status: "upcoming" },
  { q: "Q3 2026", title: "White-label",         desc: "Custom bot deployments",              status: "upcoming" },
];

function TimelineItem({ r, i, total }: { r: typeof roadmap[0]; i: number; total: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-4 flex flex-col items-center">
        <motion.div
          className="w-3 h-3 rounded-full relative z-10"
          style={{
            background: r.status === "current" ? "#FFE500" : r.status === "done" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
            boxShadow: r.status === "current" ? "0 0 0 0 rgba(255,229,0,0.4)" : "none",
          }}
          animate={r.status === "current" ? {
            boxShadow: ["0 0 0 0 rgba(255,229,0,0.4)", "0 0 0 10px rgba(255,229,0,0)", "0 0 0 0 rgba(255,229,0,0)"],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Connector line */}
        {i < total - 1 && (
          <motion.div
            className="w-px mt-1"
            style={{ background: r.status === "done" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)" }}
            initial={{ height: 0 }}
            animate={inView ? { height: 48 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
          />
        )}
      </div>

      <div
        className="p-6 mb-3"
        style={{
          background: r.status === "current" ? "rgba(255,229,0,0.04)" : "#0f0f12",
          border: `1px solid ${r.status === "current" ? "rgba(255,229,0,0.2)" : "rgba(255,255,255,0.06)"}`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: r.status === "current" ? "#FFE500" : "rgba(255,255,255,0.3)" }}>
            {r.q}
          </span>
          {r.status === "done" && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08 + 0.3, type: "spring" }}
              className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
            >
              Done
            </motion.span>
          )}
          {r.status === "current" && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, type: "spring" }}
              className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5"
              style={{ background: "#FFE500", color: "#000" }}
            >
              Current
            </motion.span>
          )}
          {r.status === "upcoming" && (
            <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
              Upcoming
            </span>
          )}
        </div>
        <div className="font-display font-bold text-white text-lg uppercase">{r.title}</div>
        <div className="font-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.32)" }}>{r.desc}</div>
      </div>
    </motion.div>
  );
}

export default function About() {
  usePageTitle("About");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div style={{ background: "#070708" }}>
      <motion.div ref={heroRef} style={{ y: heroY }}>
        <PageHero
          eyebrow="About — Our story"
          heading="Origin Story."
          sub="Directioner was built out of frustration — and a conviction that Discord communities deserve better than static bots."
        />
      </motion.div>

      <DrawLine />

      {/* 01 — The Story */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto">
          <SectionTag number="01" label="The Story" />
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-5">
              {[
                "Discord is where the internet lives. 500M registered users, millions of active servers — yet managing and enriching those communities has always been a human-only, exhausting endeavor.",
                "Directioner was born from frustration. Our gaming server was growing fast, but keeping members engaged, answering repetitive questions, and maintaining personality 24/7 was impossible.",
                "We didn't want another command bot. We wanted something that felt like a real community member — something that remembered you, understood context, had personality, and could switch from homework help to code review to trivia, all in the same server.",
              ].map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-mono text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="rounded-xl overflow-hidden aspect-video relative" style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Animated scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,229,0,0.2), transparent)" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="font-display font-bold text-center"
                    style={{ fontSize: "clamp(40px, 8vw, 80px)", color: "rgba(255,255,255,0.04)", letterSpacing: "-0.04em" }}
                    animate={{ opacity: [0.04, 0.07, 0.04] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    DIRECTIONER
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                  FIG.01 — CORE LOGIC
                </div>
                <BorderBeam color="rgba(255,255,255,0.15)" duration={8} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* 02 — Vision Pillars */}
      <section className="py-24 px-6" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto">
          <SectionTag number="02" label="Vision Pillars" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: "01", title: "Privacy First",      desc: "Memory data is siloed per server. Never sold or shared with third parties.", color: "#FFE500" },
              { n: "02", title: "Developer Native",   desc: "Built by a developer, for developers. Extensible, transparent, and open.", color: "#6366f1" },
              { n: "03", title: "Community Focused",  desc: "Adapts to any community type — gaming, study, developer, creative.", color: "#10b981" },
              { n: "04", title: "Production Grade",   desc: "99.9% uptime SLA. Handles millions of messages at ultra-low latency.", color: "#0ea5e9" },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard intensity={6} glowColor={`${p.color}08`}>
                  <div
                    className="p-8 relative overflow-hidden h-full"
                    style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <BorderBeam color={p.color} duration={6} delay={i * 0.5} size={80} />
                    {/* Radial glow */}
                    <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 100, height: 100, background: `radial-gradient(ellipse at top right, ${p.color}10, transparent)` }} />
                    <TextScramble
                      text={`${p.n}.`}
                      className="font-mono text-2xl font-bold mb-4 block"
                      delay={i * 0.15}
                      duration={0.6}
                      tag="div"
                      style={{ color: p.color }}
                    />
                    <h3 className="font-display font-bold text-white text-lg uppercase mb-2">{p.title}</h3>
                    <p className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{p.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* 03 — Creator */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto">
          <SectionTag number="03" label="The Creator" />
          <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
            <Reveal>
              <div className="aspect-square relative overflow-hidden"
                style={{ background: "#0f0f12", border: "2px solid rgba(255,229,0,0.2)" }}>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,229,0,0.06), transparent)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="font-display font-bold text-white"
                    style={{ fontSize: 80 }}
                    animate={{ opacity: [0.04, 0.08, 0.04] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >A</motion.span>
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                  FIG.03 — FOUNDER
                </div>
                <BorderBeam color="#FFE500" duration={5} />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="font-display font-bold text-white mb-2" style={{ fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em" }}>
                  <SplitReveal text="Aditya Munday" delay={0.04} />
                </h2>
                <div className="font-mono text-[10px] uppercase tracking-widest mb-6 inline-block px-3 py-1.5"
                  style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.2)", color: "#FFE500" }}>
                  Founder & Lead Engineer
                </div>
                <p className="font-mono text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.42)" }}>
                  Directioner is designed, engineered, and maintained as a solo pursuit of building the ultimate Discord companion. Every feature — from the vector database architecture to the real-time voice synthesis pipeline — was hand-coded with an obsession for performance and developer experience.
                </p>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { icon: Github, label: "GitHub", color: "#fff" },
                    { icon: Twitter, label: "Twitter", color: "#1d9bf0" },
                    { icon: MessageSquare, label: "Discord", color: "#5865F2" },
                  ].map(({ icon: Icon, label, color }) => (
                    <MagneticElement key={label} strength={0.2}>
                      <motion.a
                        href="#"
                        className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wide transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                        whileHover={{ borderColor: `${color}40`, color, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon size={14} />
                        {label}
                      </motion.a>
                    </MagneticElement>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* 04 — Tech Stack */}
      <section className="py-24 px-6" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto">
          <SectionTag number="04" label="Tech Stack" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="p-6 cursor-default relative overflow-hidden group"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Color glow */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top right, ${tech.color}18, transparent)` }}
                />
                <div
                  className="w-1.5 h-4 mb-3"
                  style={{ background: tech.color }}
                />
                <div className="font-mono text-sm font-bold text-white uppercase mb-1">{tech.name}</div>
                <div className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.32)" }}>{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* 05 — Roadmap */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-3xl mx-auto">
          <SectionTag number="05" label="Roadmap" />
          <div className="space-y-0">
            {roadmap.map((r, i) => (
              <TimelineItem key={i} r={r} i={i} total={roadmap.length} />
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* 06 — Legal */}
      <section className="py-24 px-6" style={{ background: "#070708" }}>
        <div className="max-w-4xl mx-auto">
          <SectionTag number="06" label="License & Legal" />
          <ClipReveal>
            <div className="p-8 mb-8 overflow-x-auto"
              style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "#FFE500" }}>MIT License</div>
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.35)" }}>
{`Copyright (c) 2026 Directioner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`}
              </pre>
            </div>
          </ClipReveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Privacy Policy", href: "/privacy", desc: "We do not sell data to third parties. Memory vectors are strictly siloed per server. You own your community's data.", cta: "Read Full Policy" },
              { title: "Terms of Use", href: "/terms", desc: "Usage is subject to fair use limits. API abuse will result in termination. Uptime SLAs apply to Pro/Max only.", cta: "Read Full Terms" },
            ].map((l, i) => (
              <motion.a
                key={i}
                href={l.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: "rgba(255,229,0,0.2)", y: -3 }}
                className="block p-6 transition-all"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
              >
                <h3 className="font-mono text-sm font-bold text-white uppercase mb-3">{l.title}</h3>
                <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>{l.desc}</p>
                <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#FFE500" }}>{l.cta} →</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
