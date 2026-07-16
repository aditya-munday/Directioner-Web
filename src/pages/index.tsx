import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { EqualizerBars, MagneticElement } from "@/components/animations";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { TiltCard } from "@/components/animations/TiltCard";
import { TextScramble } from "@/components/animations/TextScramble";
import { useAuth } from "@/lib/auth";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Mic } from "lucide-react";

/* ─── Local animation helpers ────────────────────────────────────────── */

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

/* ─── LiveChat (verbatim from original) ─────────────────────────────── */

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

/* ─── MemoryGraph ────────────────────────────────────────────────────── */

function MemoryGraph() {
  const nodes = [
    { x: 50,  y: 50,  label: "USER",    color: "#FFE500" },
    { x: 200, y: 30,  label: "MEMORY",  color: "#6366f1" },
    { x: 320, y: 80,  label: "SERVER",  color: "#10b981" },
    { x: 150, y: 150, label: "CONTEXT", color: "#f43f5e" },
    { x: 270, y: 160, label: "GLOBAL",  color: "#6366f1" },
  ];
  const edges = [[0,1],[1,2],[0,3],[1,4],[3,4],[2,4]];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative w-full">
      <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
        Memory Node Graph — Live
      </div>
      <svg viewBox="0 0 380 200" className="w-full h-40">
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: "easeOut" }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={n.x} cy={n.y} r="12"
              fill={`${n.color}18`} stroke={n.color} strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.text
              x={n.x} y={n.y + 26} textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="JetBrains Mono"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {n.label}
            </motion.text>
          </motion.g>
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={n.x} cy={n.y} r="12"
            fill="none" stroke={n.color} strokeWidth="1"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Sparkline ──────────────────────────────────────────────────────── */

function Sparkline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const points = [0,18,10,34,22,48,30,55,40,62,50,58,60,72,70,68,80,80,90,75,100,88];
  const max = Math.max(...points.filter((_, i) => i % 2 === 1));
  const pathD = points
    .reduce((acc, val, i) => {
      if (i % 2 === 0) return acc + (i === 0 ? `M` : ` L`) + ` ${val * 2},`;
      return acc + `${100 - (val / max) * 80} `;
    }, "")
    .trim();

  return (
    <div ref={ref} className="w-full">
      <svg viewBox="0 0 220 100" className="w-full h-20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE500" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFE500" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${pathD} L 200,100 L 0,100 Z`}
          fill="url(#spark-grad)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke="#FFE500"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}

/* ─── Personalities list data ────────────────────────────────────────── */

const allPersonalities = [
  { cat: "Education",   names: ["/mentor", "/tutor", "/coach", "/interviewer"] },
  { cat: "Tech",        names: ["/coder", "/debugger", "/architect", "/analyst"] },
  { cat: "Creative",    names: ["/writer", "/poet", "/storyteller", "/creative"] },
  { cat: "Lifestyle",   names: ["/chef", "/trainer", "/therapist", "/advisor"] },
  { cat: "Knowledge",   names: ["/scientist", "/historian", "/philosopher", "/lawyer"] },
  { cat: "Fun",         names: ["/comedian", "/chaos", "/debate", "/roast"] },
  { cat: "Productivity",names: ["/planner", "/productivity", "/brainstorm"] },
];

function PersonalityList() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % allPersonalities.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-2">
      {allPersonalities.map((cat, ci) => (
        <motion.div
          key={cat.cat}
          animate={{ opacity: ci === activeIdx ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 w-20 shrink-0">
            {cat.cat}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cat.names.map((n) => (
              <motion.span
                key={n}
                animate={{ color: ci === activeIdx ? "#FFE500" : "rgba(255,255,255,0.3)" }}
                transition={{ duration: 0.4 }}
                className="font-mono text-[11px]"
              >
                {n}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Testimonial data ───────────────────────────────────────────────── */

const testimonials = [
  { q: "Finally an AI that knows my server's inside jokes", u: "@rafaelxd",   s: "Gaming Hub",     members: "1.2k" },
  { q: "The tutor mode helped 40 of my students pass their CS exam", u: "@prof_smith", s: "Study Central", members: "3.4k" },
  { q: "Replaced 3 bots with just Directioner", u: "@devkid",    s: "Dev Syndicate", members: "8.1k" },
  { q: "Our server engagement tripled in 2 weeks", u: "@admin_kai",  s: "Anime Central",  members: "22k"  },
  { q: "/chaos mode on Friday night is an institution", u: "@friday_crew", s: "The Lounge",    members: "5.5k" },
  { q: "Like having a senior dev on call 24/7", u: "@codeninja",  s: "DevCommunity",  members: "11k"  },
  { q: "Retention went from 30% to 70% in one month", u: "@commgr",    s: "Creator Space",  members: "6k"   },
  { q: "Scaled to 20k members without extra mods", u: "@serverking", s: "Crypto Alpha",   members: "20k"  },
];

const testimonials2 = [
  { q: "Best Discord bot I've ever used, period", u: "@jessica_rv",  s: "Art & Design Hub", members: "2.1k" },
  { q: "The memory feature blew my mind — it remembered my project preferences from 3 weeks ago", u: "@pm_zach",   s: "PMers Collective", members: "4.7k" },
  { q: "Debate mode has sparked the best convos in our server", u: "@philclub",  s: "Philosophy Hub",  members: "900"  },
  { q: "My students love the /tutor slash command", u: "@drmartin",  s: "CS Department",   members: "1.8k" },
  { q: "Replaced our entire moderation + info bot stack", u: "@nightmode",  s: "Night Owls",     members: "15k"  },
  { q: "The voice mode is next level — real time, no lag", u: "@voicefan",  s: "Podcast Crew",   members: "3.3k" },
];

/* ─── Main page ──────────────────────────────────────────────────────── */

export default function Home() {
  usePageTitle("AI for Discord");
  const { user } = useAuth();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const heroY = useTransform(scrollY, [0, 700], [0, -80]);

  /* bento cards hover state */
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  /* bento ref for inView */
  const bentoRef = useRef(null);
  const bentoInView = useInView(bentoRef, { once: true, margin: "-100px" });

  const statsRef = useRef(null);
  const stepsRef = useRef(null);

  return (
    <div className="overflow-hidden" style={{ background: "#070708" }}>

      {/* ═══════════════════════════════════════════════════════ HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Drifting blurred orbs */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 600, height: 600,
            top: "-15%", left: "15%",
            background: "radial-gradient(circle, rgba(255,229,0,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 500, height: 500,
            bottom: "10%", right: "-5%",
            background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, -50, 20, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.92, 1.06, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 400, height: 400,
            top: "40%", left: "-8%",
            background: "radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.94, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot-grid overlay */}
        <div className="absolute inset-0 pointer-events-none dot-grid opacity-30" />

        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Background watermark — centered so it bleeds symmetrically */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none flex justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold leading-none text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(72px, 17vw, 240px)",
              opacity: 0.03,
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
            }}
          >
            DIRECTIONER
          </motion.div>
        </div>

        <motion.div
          style={{ y: heroY }}
          className="relative max-w-7xl mx-auto px-6 w-full pt-32 pb-28"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center mb-10"
          >
            <div
              className="flex items-center gap-2 border rounded-full px-3.5 py-1.5"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#FFE500" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono text-[11px] text-white/55 uppercase tracking-widest">
                v2 — 31 AI Personalities now live
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <h1
            className="font-display font-bold leading-[0.88] tracking-tight mb-6"
            style={{ fontSize: "clamp(52px, 8vw, 112px)" }}
          >
            <SplitReveal text="AI for" className="block text-white" delay={0.05} />
            <SplitReveal text="Discord." className="block" delay={0.18} />
          </h1>
          <style>{`
            h1 > span:nth-child(2) > span > span { color: rgba(255,255,255,0.36); }
          `}</style>

          {/* Subhead */}
          <Reveal delay={0.38}>
            <p
              className="font-mono text-sm leading-relaxed mb-4 max-w-[440px]"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              31 AI personalities. Memory. Voice. One bot.
            </p>
          </Reveal>

          {/* Buttons */}
          <Reveal delay={0.50} className="flex flex-wrap gap-3 items-center mb-10">
            <MagneticElement strength={0.3}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 transition-all duration-200 hover:scale-[1.03]"
                style={{ background: "#FFE500", color: "#000" }}
              >
                Add to Discord →
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.15}>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide px-7 py-3.5 transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                }}
              >
                Read the docs
              </Link>
            </MagneticElement>
          </Reveal>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-2">
            {[
              "31 Personalities",
              "30+ Commands",
              "Voice + Text",
            ].map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px]"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <span className="w-1 h-1 rounded-full bg-primary/60" />
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">scroll</span>
          <motion.div
            className="w-1 h-1 rounded-full bg-white/30"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ PERSONALITY TICKER */}
      <DrawLine />
      <section className="py-12 relative overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="space-y-3">
          <InfiniteRow
            speed={40}
            items={["/mentor", "/coder", "/tutor", "/interviewer", "/chef", "/lawyer", "/philosopher"].map((p) => (
              <span key={p} className="font-mono text-sm text-white/20 px-4">{p}</span>
            ))}
          />
          <InfiniteRow
            speed={50}
            reverse
            items={["/scientist", "/comedian", "/writer", "/debugger", "/therapist", "/coach", "/historian"].map((p) => (
              <span key={p} className="font-mono text-sm text-white/20 px-4">{p}</span>
            ))}
          />
        </div>
      </section>
      <DrawLine />

      {/* ═══════════════════════════════════════════════════ BENTO GRID */}
      <section className="py-28 px-6" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <Reveal className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
              CAPABILITIES
            </span>
          </Reveal>
          <div className="mb-14">
            <h2
              className="font-display font-bold text-white leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
            >
              <SplitReveal text="Built different." delay={0} />
            </h2>
          </div>

          {/* Bento grid */}
          <div
            ref={bentoRef}
            className="grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            {/* Card A — LiveChat (col-span 7) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-7 relative rounded-lg overflow-hidden group cursor-pointer"
              style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={() => setHoveredCard("chat")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="p-5 pb-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">
                  Live Chat Terminal
                </div>
              </div>
              <div className="p-5 pt-2">
                <LiveChat />
              </div>
              {hoveredCard === "chat" && <BorderBeam color="#FFE500" duration={3.5} />}
            </motion.div>

            {/* Card B — 31 Personalities (col-span 5) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 relative rounded-lg overflow-hidden group cursor-pointer p-6"
              style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={() => setHoveredCard("personalities")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">
                31 Personalities
              </div>
              <div className="font-display font-bold text-white text-2xl mb-5 tracking-tight">
                A mode for every moment.
              </div>
              <PersonalityList />
              {hoveredCard === "personalities" && <BorderBeam color="#6366f1" duration={3.5} />}
            </motion.div>

            {/* Card C — Voice Mode (col-span 4) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.13, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 relative rounded-lg overflow-hidden group cursor-pointer p-6"
              style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={() => setHoveredCard("voice")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-2 mb-4">
                <Mic size={13} style={{ color: "#0ea5e9" }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                  Voice Mode
                </span>
              </div>
              <div className="font-display font-bold text-white text-xl mb-4 tracking-tight">
                Real-time voice AI.
              </div>
              <div className="flex justify-center py-4">
                <EqualizerBars active className="h-12" />
              </div>
              <div className="font-mono text-[11px] text-white/35 mt-3">
                Join any voice channel. Ask anything. Get answers in milliseconds.
              </div>
              {hoveredCard === "voice" && <BorderBeam color="#0ea5e9" duration={3.5} />}
            </motion.div>

            {/* Card D — Memory (col-span 4) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 relative rounded-lg overflow-hidden group cursor-pointer p-6"
              style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={() => setHoveredCard("memory")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">
                Memory
              </div>
              <div className="font-display font-bold text-white text-xl mb-4 tracking-tight">
                Remembers everything.
              </div>
              <MemoryGraph />
              <div className="font-mono text-[11px] text-white/35 mt-3">
                Persistent memory graph across every session.
              </div>
              {hoveredCard === "memory" && <BorderBeam color="#10b981" duration={3.5} />}
            </motion.div>

            {/* Card E — Analytics (col-span 4) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.23, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 relative rounded-lg overflow-hidden group cursor-pointer p-6"
              style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={() => setHoveredCard("analytics")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">
                Analytics
              </div>
              <div className="font-display font-bold text-white text-xl mb-4 tracking-tight">
                Server intelligence.
              </div>
              <Sparkline />
              <div className="flex justify-between mt-2">
                <div>
                  <div className="font-display font-bold text-white text-2xl">+240%</div>
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Engagement</div>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-2xl">99.9%</div>
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Uptime</div>
                </div>
              </div>
              {hoveredCard === "analytics" && <BorderBeam color="#FFE500" duration={3.5} />}
            </motion.div>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ═══════════════════════════════════════════════════════ STATS */}
      <section
        ref={statsRef}
        className="py-0"
        style={{ background: "#0a0a0c", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { num: 31, suffix: "+",    label: "Personalities",   prefix: "" },
              { num: 30, suffix: "+",    label: "Slash Commands",  prefix: "" },
              { num: 200, suffix: "ms",  label: "Response Time",   prefix: "< " },
              { num: 99.9, suffix: "%",  label: "Uptime SLA",      prefix: "", decimals: 1 },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-10 flex flex-col items-center justify-center text-center"
                style={{
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  borderBottom: "none",
                }}
              >
                <div
                  className="font-display font-bold text-white leading-none mb-2"
                  style={{ fontSize: "clamp(48px, 5vw, 80px)", letterSpacing: "-0.03em" }}
                >
                  {s.prefix}<CountUpNumber target={s.num} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <DrawLine />

      {/* ══════════════════════════════════════════════════ HOW IT WORKS */}
      <section ref={stepsRef} className="py-28 px-6" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
              HOW IT WORKS
            </span>
          </Reveal>
          <div className="mb-16">
            <h2
              className="font-display font-bold text-white leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}
            >
              <SplitReveal text="Simple to start." delay={0} className="block" />
              <SplitReveal text="Powerful in practice." delay={0.12} className="block text-white/40" />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
            {[
              {
                num: "01",
                title: "Add Bot",
                body: "Invite Directioner to your Discord server with one click. No configuration needed.",
                icon: "🚀",
              },
              {
                num: "02",
                title: "Pick Personality",
                body: "Use /mentor, /coder, /chef or any of 31 slash commands. Switch any time.",
                icon: "🎭",
              },
              {
                num: "03",
                title: "It Remembers",
                body: "Bot learns your server's context, members, and preferences over time. Gets smarter daily.",
                icon: "🧠",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 md:p-10"
                style={{ background: "#070708" }}
              >
                <div
                  className="font-display font-bold mb-6 leading-none"
                  style={{ fontSize: "clamp(48px, 6vw, 80px)", color: "rgba(255,255,255,0.06)", letterSpacing: "-0.03em" }}
                >
                  {step.num}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-display font-bold text-white text-xl mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="font-mono text-[12px] leading-relaxed text-white/40">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ═══════════════════════════════════════════════ TESTIMONIALS */}
      <section className="py-28" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto px-6 mb-14">
          <Reveal className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
              COMMUNITY
            </span>
          </Reveal>
          <h2
            className="font-display font-bold text-white leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
          >
            <SplitReveal text="Loved by thousands." delay={0} />
          </h2>
        </div>

        <div className="space-y-4">
          <InfiniteRow
            speed={50}
            items={testimonials.map((t, i) => (
              <div
                key={i}
                className="w-72 p-5 rounded-lg shrink-0"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-full mb-3"
                  style={{ background: `linear-gradient(135deg, #FFE500${Math.floor(40 + i * 20).toString(16)}, #6366f1)` }}
                />
                <p className="font-mono text-[11px] leading-relaxed text-white/55 mb-4">
                  "{t.q}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold" style={{ color: "#FFE500" }}>{t.u}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wide text-white/25">
                    {t.s} · {t.members}
                  </span>
                </div>
              </div>
            ))}
          />
          <InfiniteRow
            speed={65}
            reverse
            items={testimonials2.map((t, i) => (
              <div
                key={i}
                className="w-72 p-5 rounded-lg shrink-0"
                style={{ background: "#0c0c0f", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div
                  className="w-8 h-8 rounded-full mb-3"
                  style={{ background: `linear-gradient(135deg, #0ea5e9, #a855f7${Math.floor(60 + i * 15).toString(16)})` }}
                />
                <p className="font-mono text-[11px] leading-relaxed text-white/40 mb-4">
                  "{t.q}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold" style={{ color: "rgba(255,229,0,0.7)" }}>{t.u}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wide text-white/20">
                    {t.s} · {t.members}
                  </span>
                </div>
              </div>
            ))}
          />
        </div>
      </section>

      <DrawLine />

      {/* ═══════════════════════════════════════════════════════ FINAL CTA */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: "#070708" }}>
        {/* Animated gradient glow behind the button */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 700, height: 400,
            bottom: "-20%", left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(ellipse, rgba(255,229,0,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-4xl mx-auto relative text-center">
          <Reveal className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
              Get Started
            </span>
          </Reveal>

          <h2
            className="font-display font-bold text-white leading-[0.88] tracking-tight mb-5"
            style={{ fontSize: "clamp(48px, 9vw, 120px)" }}
          >
            <SplitReveal text="Your Discord." className="block" delay={0} />
            <SplitReveal text="Supercharged." className="block" delay={0.12} />
          </h2>
          <style>{`
            h2.cta-heading > span:nth-child(2) > span > span {
              background: linear-gradient(135deg, #FFE500, #ff9500);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>

          <Reveal delay={0.25}>
            <p className="font-mono text-sm text-white/40 mb-10">
              Add Directioner free — no credit card needed.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="flex flex-wrap gap-4 justify-center">
            <MagneticElement strength={0.3}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 font-mono font-bold text-base uppercase tracking-wide px-9 py-4 transition-all hover:scale-[1.03]"
                style={{ background: "#FFE500", color: "#000" }}
              >
                Add to Discord
                <ArrowUpRight size={18} />
              </Link>
            </MagneticElement>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
