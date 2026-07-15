import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { EqualizerBars, MagneticElement } from "@/components/animations";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  Mic,
  MessageSquare,
  Database,
  Sparkles,
  Brain,
  Zap,
  Shield,
  Globe2,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────────── */

function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [ref]
  );
  return { pos, onMove };
}

/** Splits text into words, reveals each word sliding up from below */
function SplitReveal({
  text,
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
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

/** Fade + slide up wrapper */
function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
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

/** Thin horizontal line that draws across on enter */
function DrawLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full h-px bg-white/[0.06] overflow-hidden my-0">
      <motion.div
        className="h-full bg-white/20"
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/** Infinite horizontal ticker — two independent rows for testimonials */
function InfiniteRow({
  items,
  speed = 35,
  reverse = false,
}: {
  items: React.ReactNode[];
  speed?: number;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </motion.div>
    </div>
  );
}

/** Animated live chat terminal */
const chatLines = [
  { role: "user", text: "@Directioner what's the best FPS for beginners?" },
  { role: "bot", text: "Based on your server's history: Valorant! You and 14 others have mentioned it. Want tips?" },
  { role: "user", text: "/tutor explain Big O notation" },
  { role: "bot", text: "Big O measures algorithm efficiency — O(n) means linear growth. Example: looping over 1000 items = 1000 ops." },
  { role: "user", text: "/creative write a short intro for our weekly gaming recap" },
  { role: "bot", text: "🎮 Week 47 Recap — The squad went wild. Three clutch victories, one legendary fail, and memories that'll outlast the patch notes." },
];

function LiveChat() {
  const [visibleLines, setVisibleLines] = useState<number[]>([0]);
  const [typing, setTyping] = useState<number | null>(null);

  useEffect(() => {
    let lineIdx = 1;
    const loop = () => {
      if (lineIdx >= chatLines.length) {
        setTimeout(() => {
          setVisibleLines([0]);
          setTyping(null);
          lineIdx = 1;
          setTimeout(loop, 1000);
        }, 3000);
        return;
      }
      setTyping(lineIdx);
      const delay = chatLines[lineIdx].role === "bot" ? 900 : 400;
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, lineIdx]);
        setTyping(null);
        lineIdx++;
        setTimeout(loop, 800);
      }, delay);
    };
    const t = setTimeout(loop, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative bg-[#0c0c0e] border border-white/[0.06] rounded-lg overflow-hidden">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="font-mono text-[10px] text-white/30 ml-2">
          #general — 3,421 members online
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <EqualizerBars className="h-3" active />
          <span className="font-mono text-[9px] text-white/20">LIVE</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="p-4 space-y-3 min-h-[280px]">
        <AnimatePresence initial={false}>
          {chatLines.map((line, i) =>
            visibleLines.includes(i) ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-3 ${line.role === "bot" ? "items-start" : "items-start"}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                  style={{
                    background:
                      line.role === "bot"
                        ? "linear-gradient(135deg, #FFE500, #ff9500)"
                        : "#1a1a2e",
                    color: line.role === "bot" ? "#000" : "#6366f1",
                    border: line.role === "user" ? "1px solid #6366f120" : "none",
                  }}
                >
                  {line.role === "bot" ? "D" : "U"}
                </div>
                <div>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{
                      color: line.role === "bot" ? "#FFE500" : "#6366f1",
                    }}
                  >
                    {line.role === "bot" ? "Directioner" : "GamingKing"}
                  </span>
                  <p className="font-mono text-[11px] text-white/70 mt-0.5 leading-relaxed">
                    {line.text}
                  </p>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {typing !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 items-center"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #FFE500, #ff9500)", color: "#000" }}
            >
              D
            </div>
            <div className="flex gap-1 items-center h-5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Animated memory graph */
function MemoryGraph() {
  const nodes = [
    { x: 50, y: 50, label: "USER", color: "#FFE500" },
    { x: 200, y: 30, label: "MEMORY", color: "#6366f1" },
    { x: 320, y: 80, label: "SERVER", color: "#10b981" },
    { x: 150, y: 150, label: "CONTEXT", color: "#f43f5e" },
    { x: 270, y: 160, label: "GLOBAL", color: "#6366f1" },
  ];
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 4],
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="relative bg-[#0c0c0e] border border-white/[0.06] rounded-lg overflow-hidden p-6"
    >
      <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
        Memory Node Graph — Live
      </div>
      <svg viewBox="0 0 380 200" className="w-full h-48">
        {/* Edges */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: "easeOut" }}
          />
        ))}
        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="12"
              fill={`${n.color}18`}
              stroke={n.color}
              strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.text
              x={n.x}
              y={n.y + 26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="7"
              fontFamily="JetBrains Mono"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {n.label}
            </motion.text>
          </motion.g>
        ))}
        {/* Pulse rings */}
        {nodes.map((n, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={n.x}
            cy={n.y}
            r="12"
            fill="none"
            stroke={n.color}
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────── */

const discordTiles = [
  { emoji: "🤖", label: "AI Engine", bg: "#1a1a2e", accent: "#6366f1", rotClass: "animate-float-a", rot: "-3deg" },
  { emoji: "🧠", label: "Memory",    bg: "#120e1e", accent: "#a855f7", rotClass: "animate-float-b", rot:  "2deg"  },
  { emoji: "🎙️", label: "Voice",     bg: "#0f1c2e", accent: "#0ea5e9", rotClass: "animate-float-c", rot: "-1deg" },
  { emoji: "⚡",  label: "Speed",     bg: "#1a1a2e", accent: "#FFE500", rotClass: "animate-float-d", rot:  "3deg"  },
];

const modes = [
  { cmd: "/chat",     desc: "Default conversational AI. Natural, helpful, context-aware.", icon: MessageSquare, color: "#FFE500" },
  { cmd: "/tutor",    desc: "Patient educational mode. Adapts to any subject or skill level.", icon: Brain, color: "#6366f1" },
  { cmd: "/coder",    desc: "Development-focused. Code review, debugging, 15+ languages.", icon: Zap, color: "#FFE500" },
  { cmd: "/chaos",    desc: "Unpredictable, hilarious, always entertaining. For fun servers.", icon: Sparkles, color: "#f43f5e" },
  { cmd: "/creative", desc: "Storytelling, brainstorming, script writing, world-building.", icon: Globe2, color: "#10b981" },
  { cmd: "/debate",   desc: "Devil's advocate mode. Challenges assumptions, sparks discussion.", icon: Shield, color: "#6366f1" },
];

const testimonials = [
  { q: "Directioner coordinates our raids so we don't have to.", u: "@GamingKing_X", s: "Gaming Hub",    members: "12k" },
  { q: "The /tutor mode helped our whole server ace finals.",     u: "@StudyPro",     s: "CS 101 Group", members: "4k"  },
  { q: "Like having a senior dev in the channel 24/7.",           u: "@CodeNinja",    s: "DevCommunity", members: "8k"  },
  { q: "We run /chaos on Friday nights. Absolutely hilarious.",   u: "@FridayCrew",   s: "The Lounge",   members: "2k"  },
  { q: "Scaled our 10k server without hiring extra mods.",        u: "@ServerAdmin",  s: "Anime Central",members: "10k" },
  { q: "Retention went from 30% to 70% in one month.",           u: "@CommunityMgr", s: "Creator Space",members: "6k"  },
];

export default function Home() {
  usePageTitle("Production-Grade AI for Discord");

  const heroRef = useRef<HTMLElement>(null);
  const { pos, onMove } = useMousePosition(heroRef);
  const { scrollY } = useScroll();

  const heroY       = useTransform(scrollY, [0, 700], [0, -110]);
  const tileY       = useTransform(scrollY, [0, 700], [0,  -60]);
  const bgY         = useTransform(scrollY, [0, 700], [0,  -40]);
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const bgScale     = useTransform(scrollY, [0, 700], [1, 1.06]);

  const springX = useSpring(pos.x, { stiffness: 80, damping: 20 });
  const springY = useSpring(pos.y, { stiffness: 80, damping: 20 });

  return (
    <div className="overflow-hidden" style={{ background: "#070708" }}>

      {/* ══════════════════════════════════════════════════════════ HERO */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Layered gradient bg — Solreader depth + Resend glow */}
        <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(99,102,241,0.14) 0%, transparent 70%)" }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 50% 40% at 75% 65%, rgba(255,229,0,0.04) 0%, transparent 60%)" }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 40% 30% at 20% 80%, rgba(168,85,247,0.05) 0%, transparent 60%)" }} />
        </motion.div>

        {/* Mouse spotlight — Resend-style */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(650px circle at ${springX.get()}px ${springY.get()}px, rgba(255,229,0,0.055), transparent 65%)`,
          }}
        />

        {/* Animated grain */}
        <div className="grain-overlay" />

        {/* OXI-style enormous background logotype */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold leading-none tracking-tighter text-white"
            style={{
              fontSize: "clamp(72px, 18vw, 260px)",
              opacity: 0.028,
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
            }}
          >
            DIRECTIONER
          </motion.div>
        </div>

        {/* Grid lines — subtle structure */}
        <div className="absolute inset-0 pointer-events-none dot-grid opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 w-full pt-28 pb-24">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-center">

            {/* ── LEFT: copy */}
            <motion.div style={{ y: heroY }}>
              {/* Announcement badge — Resend-style pill */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5 mb-10"
              >
                <div
                  className="flex items-center gap-2 border rounded-full px-3.5 py-1.5 backdrop-blur-sm"
                  style={{
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="font-mono text-[11px] text-white/55 uppercase tracking-widest">
                    Announcing GPT-4o + Voice v2
                  </span>
                  <ChevronRight size={11} className="text-white/30" />
                </div>
              </motion.div>

              {/* Heading — word-by-word from below */}
              <h1
                className="font-display font-bold leading-[0.88] tracking-tight mb-6"
                style={{ fontSize: "clamp(44px, 7vw, 100px)" }}
              >
                <SplitReveal text="Production-grade" className="block text-white" delay={0.05} />
                <SplitReveal
                  text="AI for Discord."
                  className="block"
                  delay={0.18}
                />
              </h1>
              {/* The muted "AI for Discord." words get muted color via CSS child span override */}
              <style>{`
                h1 span:nth-child(2) > span > span { color: rgba(255,255,255,0.38); }
              `}</style>

              <Reveal delay={0.42}>
                <p className="font-mono text-sm leading-relaxed mb-10 max-w-[430px]"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  The AI layer trusted by thousands of Discord communities —
                  memory, voice commands, 12 AI personalities, and an analytics dashboard.
                </p>
              </Reveal>

              <Reveal delay={0.52} className="flex flex-wrap gap-3 items-center">
                <MagneticElement strength={0.3}>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 transition-all duration-200"
                    style={{
                      background: "#FFE500",
                      color: "#000",
                    }}
                  >
                    Add to Discord
                    <ArrowUpRight size={15} />
                  </Link>
                </MagneticElement>
                <MagneticElement strength={0.15}>
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide px-7 py-3.5 transition-all duration-200"
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    Explore Features
                  </Link>
                </MagneticElement>
              </Reveal>
            </motion.div>

            {/* ── RIGHT: floating Discord tiles — Umbrel-inspired */}
            <motion.div
              style={{ y: tileY }}
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {discordTiles.map((tile, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 + i * 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.55 + i * 0.1,
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    scale: 1.04,
                    rotate: 0,
                    transition: { duration: 0.3 },
                  }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer ${tile.rotClass}`}
                  style={{
                    "--rot": tile.rot,
                    background: `linear-gradient(145deg, ${tile.bg} 0%, ${tile.bg}cc 100%)`,
                    border: `1px solid ${tile.accent}18`,
                    boxShadow: `0 0 40px ${tile.accent}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
                  } as React.CSSProperties}
                >
                  <span style={{ fontSize: "2.6rem", lineHeight: 1 }}>{tile.emoji}</span>
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.18em]"
                    style={{ color: `${tile.accent}99` }}
                  >
                    {tile.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-10"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════ STATS */}
      <DrawLine />
      <section style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { label: "Servers", target: 3000, suffix: "+", icon: Globe2 },
            { label: "Messages Processed", target: 1200000, icon: MessageSquare },
            { label: "Uptime", target: 99, suffix: ".9%", icon: Zap },
            { label: "AI Modes", target: 12, suffix: "", icon: Sparkles },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 border-r border-b"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <s.icon size={16} className="text-primary mb-3 opacity-70" />
              <div
                className="font-display font-bold text-white"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)", letterSpacing: "-0.03em" }}
              >
                <CountUpNumber target={s.target} suffix={s.suffix ?? ""} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest mt-1.5"
                style={{ color: "rgba(255,255,255,0.32)" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <DrawLine />

      {/* ══════════════════════════════════════════════════════════ 01 — AI ENGINE */}
      <section className="py-28 px-6" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex items-center gap-3 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.25)" }}>01</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)", maxWidth: 40 }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.25)" }}>AI Engine</span>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="font-display font-bold text-white leading-[0.9] tracking-tight mb-6"
                style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
              >
                <SplitReveal text="Intelligence" className="block" delay={0} />
                <SplitReveal
                  text="that scales."
                  className="block"
                  delay={0.1}
                />
              </h2>
              <style>{`
                h2:has(span) span:nth-child(2) > span > span { color: rgba(255,255,255,0.4); }
              `}</style>

              <Reveal delay={0.15}>
                <p className="font-mono text-sm leading-relaxed mb-10 max-w-md"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  GPT-4o under the hood with a custom memory layer. Responses get smarter as your community grows — every interaction trains the context model.
                </p>
              </Reveal>

              {/* Mode list */}
              <Reveal delay={0.2}>
                <div className="space-y-1">
                  {modes.map((m, i) => (
                    <motion.div
                      key={m.cmd}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ x: 6 }}
                      className="flex items-center justify-between py-3 px-4 cursor-pointer group transition-all"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <m.icon size={13} style={{ color: m.color }} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="font-mono text-sm font-bold" style={{ color: m.color }}>
                          {m.cmd}
                        </span>
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {m.desc}
                      </span>
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity ml-2"
                        style={{ color: m.color }} />
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Live chat terminal */}
            <Reveal delay={0.1}>
              <LiveChat />
            </Reveal>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════════════════════════════════════════════════════════ 02 — MEMORY */}
      <section className="py-28 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Graph visual */}
            <Reveal delay={0}>
              <MemoryGraph />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Memory nodes per user", val: "5,000" },
                  { label: "Cross-session recall", val: "∞" },
                  { label: "Vector search latency", val: "<12ms" },
                  { label: "Languages understood", val: "20+" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="p-4 rounded-lg"
                    style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="font-display font-bold text-white text-xl">{s.val}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest mt-1"
                      style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <div>
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-6 block"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  02 — Memory System
                </span>
                <h2
                  className="font-display font-bold text-white leading-[0.9] tracking-tight mb-6"
                  style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
                >
                  Remembers<br />
                  <span style={{ color: "rgba(255,255,255,0.38)" }}>everything.</span>
                </h2>
                <p className="font-mono text-sm leading-relaxed mb-8"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  Directioner builds a persistent memory graph across every user interaction. Preferences, history, server events — searchable, recallable, and getting smarter every day.
                </p>
              </Reveal>

              <Reveal delay={0.12} className="space-y-3">
                {[
                  "Vector database storage — cross-session recall",
                  "Per-user preference learning",
                  "Server-scoped and global memory nodes",
                  "Semantic search over entire memory graph",
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,229,0,0.15)", border: "1px solid rgba(255,229,0,0.3)" }}
                    >
                      <span className="text-primary text-[9px] font-bold">✓</span>
                    </div>
                    <span className="font-mono text-xs text-white/60">{f}</span>
                  </motion.div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════════════════════════════════════════════════════════ 03 — VOICE */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: "#070708" }}>
        {/* Sol Reader-inspired: gradient section background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative">
          <Reveal className="flex items-center gap-3 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.25)" }}>03 — Voice Engine</span>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="font-display font-bold text-white leading-[0.9] tracking-tight mb-6"
                style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
              >
                Speak.<br />
                <span style={{ color: "rgba(255,255,255,0.38)" }}>It listens.</span>
              </h2>
              <Reveal delay={0.1}>
                <p className="font-mono text-sm leading-relaxed mb-10 max-w-md"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  Real-time voice responses in any Discord voice channel. Ultra-low latency, multi-speaker recognition, noise cancellation — built-in.
                </p>
              </Reveal>
              <Reveal delay={0.2} className="grid grid-cols-2 gap-3">
                {[
                  ["<200ms", "Audio latency"],
                  ["Multi-speaker", "Recognition"],
                  ["Noise cancel", "Built-in"],
                  ["Auto join", "Voice channels"],
                ].map(([val, label], i) => (
                  <div
                    key={i}
                    className="p-5 rounded-lg"
                    style={{ background: "#0f0f12", border: "1px solid rgba(14,165,233,0.15)" }}
                  >
                    <div className="font-display font-bold text-white text-2xl tracking-tight"
                      dangerouslySetInnerHTML={{ __html: val }} />
                    <div className="font-mono text-[10px] uppercase tracking-widest mt-1"
                      style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
                  </div>
                ))}
              </Reveal>
            </div>

            {/* Live waveform visualization */}
            <Reveal delay={0.1}>
              <div
                className="rounded-xl overflow-hidden relative"
                style={{
                  background: "#0c1420",
                  border: "1px solid rgba(14,165,233,0.15)",
                  boxShadow: "0 0 80px rgba(14,165,233,0.05)",
                }}
              >
                <div className="p-5 border-b flex items-center justify-between"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <Mic size={14} style={{ color: "#0ea5e9" }} />
                    <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      VOICE CHANNEL — LIVE
                    </span>
                  </div>
                  <EqualizerBars active className="h-4" />
                </div>
                <div className="p-8 flex flex-col items-center justify-center gap-6">
                  {/* Animated voice bars — OXI-style illuminated bars */}
                  <div className="flex items-end gap-1.5 h-24">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 rounded-sm"
                        style={{ background: `linear-gradient(to top, #0ea5e9, #6366f1)` }}
                        animate={{
                          height: [
                            `${15 + Math.sin(i * 0.8) * 30}%`,
                            `${40 + Math.cos(i * 0.5 + 1) * 40}%`,
                            `${20 + Math.sin(i * 0.6 + 2) * 25}%`,
                            `${15 + Math.sin(i * 0.8) * 30}%`,
                          ],
                        }}
                        transition={{
                          duration: 1.8 + (i % 5) * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.04,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <div
                      className="font-display font-bold text-white"
                      style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.04em" }}
                    >
                      &lt;200ms
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest mt-1"
                      style={{ color: "rgba(255,255,255,0.3)" }}>Average Latency</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════════════════════════════════════════════════════════ 04 — AI MODES */}
      <section className="py-28 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex items-center justify-between mb-16">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] block mb-3"
                style={{ color: "rgba(255,255,255,0.25)" }}>04 — AI Modes</span>
              <h2
                className="font-display font-bold text-white leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
              >
                12 personalities.<br />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>One bot.</span>
              </h2>
            </div>
            <Link href="/commands"
              className="hidden lg:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              All Commands <ArrowUpRight size={13} />
            </Link>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modes.map((m, i) => (
              <motion.div
                key={m.cmd}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-lg cursor-pointer transition-all duration-300"
                style={{
                  background: "#0f0f12",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "none",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${m.color}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${m.color}08`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <m.icon size={15} style={{ color: m.color }} />
                  <span className="font-mono text-sm font-bold" style={{ color: m.color }}>
                    {m.cmd}
                  </span>
                </div>
                <p className="font-mono text-[11px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════════════════════════════════════════════════════════ TESTIMONIALS */}
      <section className="py-28" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] block mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}>05 — Community</span>
            <h2
              className="font-display font-bold text-white leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
            >
              Loved by thousands.
            </h2>
          </Reveal>
        </div>

        {/* Row 1 — left to right */}
        <div className="mb-4">
          <InfiniteRow
            speed={45}
            items={testimonials.map((t, i) => (
              <div
                key={i}
                className="w-72 p-5 rounded-xl shrink-0"
                style={{
                  background: "#0f0f12",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="font-mono text-[11px] leading-relaxed text-white/60 mb-4">
                  "{t.q}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-primary">{t.u}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wide"
                    style={{ color: "rgba(255,255,255,0.25)" }}>
                    {t.s} · {t.members}
                  </span>
                </div>
              </div>
            ))}
          />
        </div>

        {/* Row 2 — right to left */}
        <InfiniteRow
          speed={55}
          reverse
          items={[...testimonials].reverse().map((t, i) => (
            <div
              key={i}
              className="w-64 p-5 rounded-xl shrink-0"
              style={{
                background: "#0c0c0f",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <p className="font-mono text-[11px] leading-relaxed text-white/40 mb-4">
                "{t.q}"
              </p>
              <span className="font-mono text-[9px] font-bold"
                style={{ color: "rgba(255,229,0,0.6)" }}>{t.u}</span>
            </div>
          ))}
        />
      </section>

      <DrawLine />

      {/* ══════════════════════════════════════════════════════════ CTA */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: "#070708" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,229,0,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative text-center">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] block mb-8"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              Get Started Today
            </span>
          </Reveal>

          {/* OXI-inspired — massive heading */}
          <h2
            className="font-display font-bold text-white leading-[0.88] tracking-tight mx-auto mb-10"
            style={{ fontSize: "clamp(48px, 9vw, 128px)", maxWidth: "900px" }}
          >
            <SplitReveal text="Wake up" className="block" delay={0} />
            <SplitReveal
              text="your server."
              className="block text-gradient-yellow"
              delay={0.12}
            />
          </h2>
          <style>{`.text-gradient-yellow > span > span { background: linear-gradient(135deg, #FFE500, #ff9500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }`}</style>

          <Reveal delay={0.3} className="flex flex-wrap gap-4 justify-center">
            <MagneticElement strength={0.3}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 font-mono font-bold text-base uppercase tracking-wide px-9 py-4 transition-all"
                style={{ background: "#FFE500", color: "#000" }}
              >
                Add to Discord
                <ArrowUpRight size={18} />
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.15}>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-mono text-base uppercase tracking-wide px-9 py-4 transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                View Pricing
              </Link>
            </MagneticElement>
          </Reveal>

          {/* Ticker — brands/trust */}
          <Reveal delay={0.4} className="mt-24 overflow-hidden">
            <div className="font-mono text-[10px] uppercase tracking-widest text-center mb-6"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              Trusted across communities
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-16 animate-ticker whitespace-nowrap">
                {["GAMING", "STUDY", "DEV", "ANIME", "CRYPTO", "ART", "MUSIC", "SPORTS",
                  "GAMING", "STUDY", "DEV", "ANIME", "CRYPTO", "ART", "MUSIC", "SPORTS"].map((s, i) => (
                  <span key={i}
                    className="font-display font-bold text-3xl uppercase shrink-0"
                    style={{ color: "rgba(255,255,255,0.06)", letterSpacing: "-0.02em" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
