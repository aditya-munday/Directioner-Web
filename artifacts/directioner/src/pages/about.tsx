import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Github, Twitter, MessageSquare } from "lucide-react";
import { PageHero, SectionTag, Reveal, DrawLine, GlowCard, SplitReveal } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { TextScramble } from "@/components/animations/TextScramble";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { ClipReveal } from "@/components/animations/ClipReveal";

const ABOUT_IMGS = {
  hero:     "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80",
  founder:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  server:   "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80",
  stack:    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
};

const techStack = [
  { name: "Discord.js v14", desc: "Real-time Discord API gateway" },
  { name: "Node.js 20",     desc: "Non-blocking event loop runtime" },
  { name: "OpenAI GPT-4o",  desc: "Language model integration" },
  { name: "PostgreSQL 16",  desc: "Primary relational database" },
  { name: "Redis 7",        desc: "Cache layer and session store" },
  { name: "TypeScript 5",   desc: "Full type-safe codebase" },
  { name: "WebSockets",     desc: "Real-time bidirectional comms" },
  { name: "WebRTC",         desc: "Native voice channel streaming" },
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

export default function About() {
  usePageTitle("About");

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="About — Our story"
        heading="Origin Story."
        sub="Directioner was built out of frustration — and a conviction that Discord communities deserve better than static bots."
        image={ABOUT_IMGS.hero}
      />

      <DrawLine />

      {/* 01 — The Story */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto">
          <SectionTag number="01" label="The Story" />
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-5 font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
              <p>Discord is where the internet lives. 500M registered users, millions of active servers — yet managing and enriching those communities has always been a human-only, exhausting endeavor.</p>
              <p>Directioner was born from frustration. Our gaming server was growing fast, but keeping members engaged, answering repetitive questions, and maintaining personality 24/7 was impossible.</p>
              <p>We didn't want another command bot. We wanted something that felt like a real community member — something that remembered you, understood context, had personality, and could switch from homework help to code review to trivia, all in the same server.</p>
            </div>
            <Reveal delay={0.1}>
              <div className="rounded-xl overflow-hidden aspect-video relative"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <img
                  src={ABOUT_IMGS.server}
                  alt="Gaming community"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.38) saturate(0.65)" }}
                />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(7,7,8,0.85) 0%, transparent 60%)" }} />
                <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  FIG.01 — CORE LOGIC
                </div>
                {/* Pull quote overlay */}
                <div className="absolute bottom-4 right-4 max-w-[200px] text-right">
                  <span className="font-mono text-[9px] italic leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.25)" }}>
                    "Discord is where the internet lives."
                  </span>
                </div>
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
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard intensity={5} glowColor={`${p.color}08`}>
                  <div
                    className="p-8 rounded-lg relative overflow-hidden h-full"
                    style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <BorderBeam color={p.color} duration={6} delay={i * 0.5} size={80} />
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
              <div className="aspect-square rounded-xl relative overflow-hidden"
                style={{ border: "2px solid rgba(255,229,0,0.2)" }}>
                <img
                  src={ABOUT_IMGS.founder}
                  alt="Founder"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{ filter: "brightness(0.75) saturate(0.8)" }}
                />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(7,7,8,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: "rgba(255,229,0,0.6)" }}>
                  FIG.03 — FOUNDER
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="font-display font-bold text-white mb-2" style={{ fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em" }}>
                  Aditya Munday
                </h2>
                <div className="font-mono text-[10px] uppercase tracking-widest mb-6 inline-block px-3 py-1.5"
                  style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.2)", color: "#FFE500" }}>
                  Founder & Lead Engineer
                </div>
                <p className="font-mono text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.42)" }}>
                  Directioner is designed, engineered, and maintained as a solo pursuit of building the ultimate Discord companion. Every feature — from the vector database architecture to the real-time voice synthesis pipeline — was hand-coded with an obsession for performance and developer experience.
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: Github, label: "GitHub" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: MessageSquare, label: "Discord" },
                  ].map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wide transition-all"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,229,0,0.3)";
                        (e.currentTarget as HTMLElement).style.color = "#FFE500";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                      }}
                    >
                      <Icon size={14} />
                      {label}
                    </a>
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-lg transition-all cursor-default"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,229,0,0.2)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
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
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="space-y-6 pl-12">
              {roadmap.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-12 top-4 w-2 h-2 rounded-full"
                    style={{
                      background: r.status === "current" ? "#FFE500" : r.status === "done" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      boxShadow: r.status === "current" ? "0 0 12px rgba(255,229,0,0.5)" : "none",
                    }}
                  />
                  <div
                    className="p-6 rounded-lg"
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
                      {r.status === "current" && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5"
                          style={{ background: "#FFE500", color: "#000" }}>
                          Current
                        </span>
                      )}
                      {r.status === "upcoming" && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5"
                          style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                          Upcoming
                        </span>
                      )}
                    </div>
                    <div className="font-display font-bold text-white text-lg uppercase">{r.title}</div>
                    <div className="font-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.32)" }}>{r.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* 06 — Legal */}
      <section className="py-24 px-6" style={{ background: "#070708" }}>
        <div className="max-w-4xl mx-auto">
          <SectionTag number="06" label="License & Legal" />
          <div className="rounded-lg p-8 mb-8 overflow-x-auto"
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
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Privacy Policy", desc: "We do not sell data to third parties. Memory vectors are strictly siloed per server. You own your community's data.", cta: "Read Full Policy" },
              { title: "Terms of Use", desc: "Usage is subject to fair use limits. API abuse will result in termination. Uptime SLAs apply to Pro/Max only.", cta: "Read Full Terms" },
            ].map((l, i) => (
              <div key={i} className="p-6 rounded-lg"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="font-mono text-sm font-bold text-white uppercase mb-3">{l.title}</h3>
                <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>{l.desc}</p>
                <a href="#" className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#FFE500" }}>{l.cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
