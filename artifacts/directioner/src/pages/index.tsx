import { useRef } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { OscilloscopeWave, Typewriter, StaggeredGrid } from "@/components/animations";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Mic, MessageSquare, Database, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

function AnimSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  usePageTitle("Production-Grade AI for Discord");

  const modes = [
    { cmd: "/chat", desc: "Default conversational AI" },
    { cmd: "/tutor", desc: "Educational mode, patient explanations" },
    { cmd: "/coder", desc: "Development mode, code-focused" },
    { cmd: "/chaos", desc: "Unpredictable chaotic AI (fun)" },
    { cmd: "/creative", desc: "Creative writing and brainstorming" },
    { cmd: "/debate", desc: "Devil's advocate mode" }
  ];

  return (
    <div className="overflow-hidden bg-background">

      {/* ═══ HERO — yellow background, motion.dev layout ═══ */}
      <section className="relative bg-primary text-black overflow-hidden">
        {/* Top meta bar */}
        <div className="flex items-center justify-between px-6 pt-20 pb-4 max-w-7xl mx-auto w-full border-b border-black/10">
          <div className="font-mono text-[11px] leading-5 font-medium">
            <div>// DISCORD BOT</div>
            <div>// AI POWERED</div>
          </div>
          <div className="font-mono text-[11px]">V1.0.0</div>
        </div>

        {/* Main hero grid */}
        <div className="max-w-7xl mx-auto px-6 pb-0 grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">
          {/* Left — headline + CTA */}
          <div className="py-10 lg:py-12 pr-0 lg:pr-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-black leading-[0.9] mb-8"
              style={{ fontSize: "clamp(52px, 8vw, 96px)", fontVariationSettings: '"opsz" 60, "wght" 720' }}
            >
              Directioner.<br />
              <span style={{ fontVariationSettings: '"opsz" 60, "wght" 460' }}>
                Production-grade<br />AI for Discord.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-mono text-[11px] mb-10 flex items-center gap-3 flex-wrap"
            >
              <span className="font-bold">&gt;</span>
              <span className="font-bold uppercase">AVAILABLE FOR DISCORD SERVERS.</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="corner-brackets bg-black text-primary font-mono font-bold px-8 py-4 uppercase text-sm hover:bg-black/80 transition-colors inline-flex items-center justify-center gap-2"
              >
                ADD TO DISCORD ↗
              </Link>
              <Link
                href="/features"
                className="border-2 border-black text-black font-mono font-bold px-8 py-4 uppercase text-sm hover:bg-black hover:text-primary transition-colors inline-flex items-center justify-center gap-2"
              >
                EXPLORE FEATURES
              </Link>
            </motion.div>
          </div>

          {/* Right — oscilloscope wave + dot grid */}
          <div className="relative h-64 lg:h-full min-h-[280px] flex items-center justify-center overflow-hidden dot-grid-yellow border-l border-black/10">
            <svg
              viewBox="0 0 560 220"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              {/* Waveform paths — motion.dev style */}
              <path
                d="M0 110 C70 110 70 40 140 40 C210 40 210 180 280 180 C350 180 350 70 420 70 C490 70 490 140 560 140"
                fill="none" stroke="black" strokeWidth="2" strokeDasharray="5 3" opacity="0.4"
              />
              <path
                d="M0 110 C70 110 70 60 140 60 C210 60 210 160 280 160 C350 160 350 80 420 80 C490 80 490 130 560 130"
                fill="none" stroke="black" strokeWidth="2.5" opacity="0.9"
              />
              <path
                d="M0 110 C80 110 80 50 160 50 C240 50 240 170 320 170 C400 170 400 60 480 60 C520 60 540 90 560 110"
                fill="none" stroke="black" strokeWidth="1.5" opacity="0.3"
              />
              {/* Dots on wave */}
              <circle cx="140" cy="40" r="4" fill="black" opacity="0.7" />
              <circle cx="280" cy="180" r="4" fill="black" opacity="0.7" />
              <circle cx="420" cy="70" r="4" fill="black" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Feature pills row — motion.dev style */}
        <div className="border-t border-black/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-black/10">
            {[
              { n: "01", title: "FREE TIER", desc: "Completely free to use, forever on basic plan." },
              { n: "02", title: "PRODUCTION READY", desc: "Trusted by thousands of Discord servers." },
              { n: "03", title: "MEMORY ENGINE", desc: "Long-term vector memory recall per user." },
              { n: "04", title: "BUILT FOR AI", desc: "GPT-4o, voice, code — all in one bot." },
              { n: "05", title: "ANY SERVER", desc: "Gaming, study, dev — modes for all." },
            ].map((f) => (
              <div key={f.n} className="p-6">
                <div className="font-mono text-[10px] text-black/40 mb-2">{f.n}</div>
                <div className="font-mono text-xs font-bold text-black uppercase mb-1">{f.title}</div>
                <div className="font-mono text-[11px] text-black/60 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom slash separator — motion.dev style */}
        <div className="flex items-center px-6 py-3 border-t border-black/10 overflow-hidden">
          <span className="font-mono text-black/30 text-xs mr-4">+</span>
          <div className="flex-1 overflow-hidden">
            <div className="font-mono text-xs text-black/20 whitespace-nowrap animate-ticker inline-block">
              {"//".repeat(120)}
            </div>
          </div>
          <span className="font-mono text-black/30 text-xs ml-4">+</span>
        </div>
      </section>

      {/* ═══ STATS ROW ═══ */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {[
            { label: "SERVERS", target: 3000, suffix: "+" },
            { label: "MESSAGES PROCESSED", target: 1200000 },
            { label: "UPTIME", target: 99, suffix: ".9%" },
            { label: "AI MODES", target: 6, suffix: "" },
          ].map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8"
            >
              <div className="font-mono text-[10px] text-muted-foreground uppercase mb-2">{s.label}</div>
              <div className="font-display font-bold text-3xl md:text-4xl text-white" style={{ fontVariationSettings: '"opsz" 48, "wght" 720' }}>
                <CountUpNumber target={s.target} suffix={s.suffix ?? ""} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 01 — ANIMATION LIBRARY style ═══ */}
      <section className="py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <AnimSection>
            <SectionLabel number="01" label="AI ENGINE" />
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-white mb-6 mt-4"
              style={{ fontSize: "clamp(36px, 5.4vw, 64px)", fontVariationSettings: '"opsz" 60, "wght" 720' }}
            >
              Intelligence<br />
              <span style={{ fontVariationSettings: '"opsz" 60, "wght" 460' }}>that scales.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="font-mono text-sm text-muted-foreground max-w-xl leading-relaxed mb-16">
              Directioner uses GPT-4o under the hood, with a custom memory layer that makes every response smarter over time. The more your community uses it, the better it gets.
            </motion.p>
          </AnimSection>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* AI mode selector */}
            <AnimSection>
              <motion.div variants={fadeUp} className="bg-card border border-border p-8">
                <div className="font-mono text-[10px] text-muted-foreground uppercase mb-6">// AI MODES — SELECT ONE</div>
                <div className="space-y-2">
                  {modes.map((m, i) => (
                    <motion.div
                      key={m.cmd}
                      variants={fadeUp}
                      custom={i * 0.5}
                      className="flex items-center justify-between p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <span className="font-mono text-sm font-bold text-primary group-hover:text-primary">{m.cmd}</span>
                      <span className="font-mono text-xs text-muted-foreground">{m.desc}</span>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimSection>

            {/* Stats right side */}
            <AnimSection className="space-y-6">
              {[
                { icon: MessageSquare, label: "Text Messages", value: "∞", sub: "Unlimited on Pro & Max" },
                { icon: Mic, label: "Voice Latency", value: "<200ms", sub: "Ultra-low audio latency" },
                { icon: Database, label: "Memory Nodes", value: "5,000", sub: "Long-term vector storage" },
                { icon: Sparkles, label: "Languages", value: "20+", sub: "Multilingual support" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.5}
                  className="flex items-center gap-6 bg-card border border-border p-6 group hover:border-primary/30 transition-colors"
                >
                  <s.icon size={24} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase">{s.label}</div>
                    <div className="font-display font-bold text-2xl text-white" style={{ fontVariationSettings: '"opsz" 36, "wght" 700' }}>{s.value}</div>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground text-right max-w-[120px]">{s.sub}</div>
                </motion.div>
              ))}
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 02 — MEMORY ═══ */}
      <section className="py-24 px-6 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="02" label="MEMORY SYSTEM" />
          <div className="grid lg:grid-cols-2 gap-16 items-center mt-8">
            <AnimSection>
              <motion.h2
                variants={fadeUp}
                className="font-display font-bold text-white mb-6"
                style={{ fontSize: "clamp(36px, 5vw, 56px)", fontVariationSettings: '"opsz" 60, "wght" 720' }}
              >
                Remembers<br />
                <span style={{ fontVariationSettings: '"opsz" 60, "wght" 460' }}>everything.</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
                Directioner builds a persistent memory graph of every user interaction. It remembers preferences, facts, and past conversations — making each response uniquely personal.
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="space-y-3">
                {[
                  "Vector database storage — cross-session recall",
                  "Per-user preference learning",
                  "Server-scoped and global memory nodes",
                  "Semantic search over memory graph",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 font-mono text-xs text-white">
                    <span className="w-5 h-5 border border-primary flex items-center justify-center text-primary text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </div>
                ))}
              </motion.div>
            </AnimSection>

            {/* Memory node visualization */}
            <AnimSection>
              <motion.div variants={fadeUp} className="border border-border bg-background p-8 font-mono text-xs relative overflow-hidden">
                <div className="text-muted-foreground mb-4">// MEMORY NODE EXAMPLE</div>
                <div className="space-y-3">
                  {[
                    { scope: "USER", content: "@GamingKing prefers FPS strategy tips", time: "2h ago" },
                    { scope: "SERVER", content: "Weekly tournament every Friday at 8PM UTC", time: "1d ago" },
                    { scope: "GLOBAL", content: "CS community focuses on TypeScript + React", time: "3d ago" },
                    { scope: "USER", content: "@StudyHero prefers step-by-step explanations", time: "5d ago" },
                  ].map((node, i) => (
                    <motion.div key={i} variants={fadeUp} custom={i * 0.3} className="flex items-start gap-3 p-3 border border-border/50 hover:border-primary/30 transition-colors">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 shrink-0 ${
                        node.scope === 'USER' ? 'bg-primary text-black' :
                        node.scope === 'SERVER' ? 'bg-accent text-black' :
                        'bg-white/10 text-white'
                      }`}>{node.scope}</span>
                      <span className="flex-1 text-white leading-relaxed">{node.content}</span>
                      <span className="text-muted-foreground text-[10px] shrink-0">{node.time}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </motion.div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 03 — VOICE ═══ */}
      <section className="py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="03" label="VOICE ENGINE" />
          <div className="grid lg:grid-cols-2 gap-16 items-center mt-8">
            {/* Waveform visual */}
            <AnimSection>
              <motion.div variants={fadeUp} className="bg-card border border-border p-8 relative overflow-hidden h-64 flex items-center justify-center">
                <OscilloscopeWave color="hsl(var(--primary))" amplitude={50} frequency={3} speed={2} className="absolute inset-0" />
                <div className="relative z-10 text-center">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase mb-2">LIVE AUDIO STREAM</div>
                  <div className="font-display font-bold text-5xl text-primary" style={{ fontVariationSettings: '"opsz" 60, "wght" 720' }}>&lt;200ms</div>
                  <div className="font-mono text-xs text-muted-foreground mt-2">LATENCY</div>
                </div>
              </motion.div>
            </AnimSection>

            <AnimSection>
              <motion.h2
                variants={fadeUp}
                className="font-display font-bold text-white mb-6"
                style={{ fontSize: "clamp(36px, 5vw, 56px)", fontVariationSettings: '"opsz" 60, "wght" 720' }}
              >
                Speak.<br />
                <span style={{ fontVariationSettings: '"opsz" 60, "wght" 460' }}>It listens.</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
                Real-time voice responses in any Discord voice channel. Ultra-low latency, multi-speaker recognition, and automatic join/leave — it just works.
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 gap-4">
                {[
                  ["&lt;200ms", "Audio latency"],
                  ["Multi-speaker", "Recognition"],
                  ["Noise cancel", "Built-in"],
                  ["Auto join", "Voice channels"],
                ].map(([val, label], i) => (
                  <div key={i} className="border border-border p-4">
                    <div className="font-display font-bold text-xl text-primary mb-1" style={{ fontVariationSettings: '"opsz" 36, "wght" 700' }} dangerouslySetInnerHTML={{ __html: val }} />
                    <div className="font-mono text-[10px] text-muted-foreground uppercase">{label}</div>
                  </div>
                ))}
              </motion.div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 04 — AI MODES SHOWCASE ═══ */}
      <section className="py-24 px-6 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="04" label="AI MODES" />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { cmd: "/chat", desc: "Default conversational AI. Natural, helpful, context-aware.", color: "primary" },
              { cmd: "/tutor", desc: "Patient, educational mode. Adapts to any subject or skill level.", color: "accent" },
              { cmd: "/coder", desc: "Development-focused. Code review, debugging, 15+ languages.", color: "primary" },
              { cmd: "/chaos", desc: "Unpredictable, hilarious, always entertaining. For fun servers.", color: "accent" },
              { cmd: "/creative", desc: "Storytelling, brainstorming, script writing, world-building.", color: "primary" },
              { cmd: "/debate", desc: "Devil's advocate mode. Challenges assumptions, sparks discussion.", color: "accent" },
            ].map((m, i) => (
              <motion.div
                key={m.cmd}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="border border-border bg-background p-8 group hover:border-primary/50 transition-all"
              >
                <div className={`font-mono text-sm font-bold mb-3 ${m.color === 'primary' ? 'text-primary' : 'text-accent'}`}>{m.cmd}</div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 05 — TESTIMONIALS ═══ */}
      <section className="py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="05" label="COMMUNITY" />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display font-bold text-white mb-16 mt-4"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", fontVariationSettings: '"opsz" 60, "wght" 720' }}
          >
            Loved by<br />
            <span style={{ fontVariationSettings: '"opsz" 60, "wght" 460' }}>thousands.</span>
          </motion.h2>

          <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {[
              { q: "Directioner coordinates our raids so we don't have to.", u: "@GamingKing_X", s: "Gaming Hub" },
              { q: "The tutor mode helped our whole server pass finals week.", u: "@StudyPro", s: "CS 101 Group" },
              { q: "Like having a senior dev in the channel 24/7.", u: "@CodeNinja", s: "DevCommunity" },
              { q: "We use /chaos mode on Friday nights. Hilarious.", u: "@FridayCrew", s: "The Lounge" },
              { q: "Scaled our 10k server without hiring more mods.", u: "@ServerAdmin", s: "Anime Central" },
              { q: "New member retention went from 30% to 70%.", u: "@CommunityMgr", s: "Creator Space" }
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border p-8 hover:border-primary/30 transition-colors relative">
                <div className="font-mono text-[10px] text-muted-foreground uppercase mb-4">// REVIEW</div>
                <p className="font-mono text-sm leading-relaxed text-white mb-6">
                  "{t.q}"
                </p>
                <div className="flex justify-between items-end">
                  <div className="font-bold text-sm text-primary font-mono">{t.u}</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase">{t.s}</div>
                </div>
              </div>
            ))}
          </StaggeredGrid>

          {/* Ticker trust bar */}
          <div className="border border-border overflow-hidden">
            <div className="flex items-center py-6 px-6 border-b border-border">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                TRUSTED BY COMMUNITIES ON
              </div>
            </div>
            <div className="flex overflow-hidden py-6">
              <div className="flex gap-16 animate-ticker whitespace-nowrap font-mono font-bold text-2xl text-white/20 uppercase">
                {["DISCORD", "GITHUB", "OPENAI", "LINEAR", "FIGMA", "DISCORD", "GITHUB", "OPENAI", "LINEAR", "FIGMA"].map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 items-center gap-12">
          <div>
            <div className="font-mono text-[10px] text-black/50 uppercase mb-4">// GET STARTED TODAY</div>
            <h2 className="font-display font-bold text-black mb-6" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontVariationSettings: '"opsz" 60, "wght" 720' }}>
              Wake up<br />
              <span style={{ fontVariationSettings: '"opsz" 60, "wght" 460' }}>your server.</span>
            </h2>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/register"
                className="corner-brackets bg-black text-primary font-mono font-bold px-8 py-4 uppercase text-sm hover:bg-black/80 transition-colors inline-flex items-center gap-2"
              >
                ADD TO DISCORD ↗
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-black text-black font-mono font-bold px-8 py-4 uppercase text-sm hover:bg-black hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                VIEW PRICING
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative h-48 dot-grid-yellow border border-black/10" />
        </div>
        {/* Bottom slash separator */}
        <div className="flex items-center px-6 py-3 border-t border-black/10 overflow-hidden">
          <span className="font-mono text-black/30 text-xs mr-4">+</span>
          <div className="flex-1 overflow-hidden">
            <div className="font-mono text-xs text-black/20 whitespace-nowrap animate-ticker inline-block">
              {"//".repeat(120)}
            </div>
          </div>
          <span className="font-mono text-black/30 text-xs ml-4">+</span>
        </div>
      </section>
    </div>
  );
}
