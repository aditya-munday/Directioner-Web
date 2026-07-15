import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { EqualizerBars } from "@/components/animations";
import { TextScramble } from "@/components/animations/TextScramble";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
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
  Mic,
  MessageSquare,
  Database,
  Sparkles,
  Brain,
  Zap,
  Shield,
  Globe2,
  ChevronDown,
} from "lucide-react";

/* ─── Images from the web ─────────────────────────────── */
const IMGS = {
  hero:      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=90",   // esports arena
  ai:        "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80", // AI neural
  voice:     "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80", // recording studio
  memory:    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80", // data visualization
  developer: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80", // coding laptop
  community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80", // friends gaming
  cta:       "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80",    // dark tech bg
};

/* ─── Small helpers ──────────────────────────────────── */
function SplitReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: "0.25em", verticalAlign: "top" }}>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DrawLine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full h-px overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
      <motion.div className="h-full" style={{ background: "rgba(255,255,255,0.15)" }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function InfiniteRow({ items, speed = 35, reverse = false }: { items: React.ReactNode[]; speed?: number; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4 w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => <div key={i}>{item}</div>)}
      </motion.div>
    </div>
  );
}

/* ─── Live chat terminal ─────────────────────────────── */
const chatLines = [
  { role: "user", text: "@Directioner what's the best FPS for beginners?" },
  { role: "bot",  text: "Based on your server's history: Valorant! You and 14 others have mentioned it. Want tips?" },
  { role: "user", text: "/tutor explain Big O notation" },
  { role: "bot",  text: "Big O measures algorithm efficiency — O(n) means linear growth. Looping over 1000 items = 1000 ops." },
  { role: "user", text: "/creative write a short recap for week 47" },
  { role: "bot",  text: "🎮 Week 47 — Three clutch victories, one legendary fail, and memories that'll outlast the patch notes." },
];

function LiveChat() {
  const [visibleLines, setVisibleLines] = useState<number[]>([0]);
  const [typing, setTyping] = useState<number | null>(null);
  useEffect(() => {
    let idx = 1;
    const loop = () => {
      if (idx >= chatLines.length) {
        setTimeout(() => { setVisibleLines([0]); setTyping(null); idx = 1; setTimeout(loop, 1000); }, 3000);
        return;
      }
      setTyping(idx);
      setTimeout(() => { setVisibleLines(prev => [...prev, idx]); setTyping(null); idx++; setTimeout(loop, 800); },
        chatLines[idx].role === "bot" ? 900 : 400);
    };
    const t = setTimeout(loop, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#0a0a0b", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex gap-1.5">{["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} className="w-3 h-3 rounded-full" style={{background:c}}/>)}</div>
        <span className="font-mono text-[10px] text-white/30 ml-2">#general — 3,421 online</span>
        <div className="ml-auto flex items-center gap-1.5"><EqualizerBars className="h-3" active /><span className="font-mono text-[9px] text-white/20">LIVE</span></div>
      </div>
      <div className="p-5 space-y-3 min-h-[260px]">
        <AnimatePresence initial={false}>
          {chatLines.map((line, i) => visibleLines.includes(i) ? (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{ background: line.role==="bot" ? "#FFE500" : "rgba(255,255,255,0.08)", color: line.role==="bot" ? "#000" : "rgba(255,255,255,0.5)" }}>
                {line.role==="bot" ? "D" : "U"}
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold" style={{ color: line.role==="bot" ? "#FFE500" : "rgba(255,255,255,0.4)" }}>
                  {line.role==="bot" ? "Directioner" : "GamingKing"}
                </span>
                <p className="font-mono text-[11px] text-white/55 mt-0.5 leading-relaxed">{line.text}</p>
              </div>
            </motion.div>
          ) : null)}
        </AnimatePresence>
        {typing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: "#FFE500", color: "#000" }}>D</div>
            <div className="flex gap-1">{[0,1,2].map(i=>(
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }}
                animate={{ y: [0,-4,0] }} transition={{ duration: 0.55, repeat: Infinity, delay: i*0.15 }} />
            ))}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const modes = [
  { cmd: "/chat",     desc: "Default conversational AI. Natural, helpful, context-aware.",      icon: MessageSquare, color: "#FFE500" },
  { cmd: "/tutor",    desc: "Patient educational mode. Adapts to any subject.",                  icon: Brain,         color: "#6366f1" },
  { cmd: "/coder",    desc: "Code review, debugging, generation — 15+ languages.",               icon: Zap,           color: "#FFE500" },
  { cmd: "/chaos",    desc: "Unpredictable, hilarious — always entertaining.",                    icon: Sparkles,      color: "#f43f5e" },
  { cmd: "/creative", desc: "Storytelling, brainstorming, script writing.",                       icon: Globe2,        color: "#10b981" },
  { cmd: "/debate",   desc: "Devil's advocate mode. Challenges, sparks discussion.",              icon: Shield,        color: "#6366f1" },
];

const testimonials = [
  { q: "Directioner coordinates our raids so we don't have to.", u: "@GamingKing_X", s: "Gaming Hub",     members: "12k" },
  { q: "The /tutor mode helped our whole server ace finals.",     u: "@StudyPro",     s: "CS 101 Group",  members: "4k"  },
  { q: "Like having a senior dev in the channel 24/7.",           u: "@CodeNinja",    s: "DevCommunity",  members: "8k"  },
  { q: "We run /chaos on Friday nights. Absolutely hilarious.",   u: "@FridayCrew",   s: "The Lounge",    members: "2k"  },
  { q: "Scaled our 10k server without hiring extra mods.",        u: "@ServerAdmin",  s: "Anime Central", members: "10k" },
  { q: "Retention went from 30% to 70% in one month.",           u: "@CommunityMgr", s: "Creator Space", members: "6k"  },
];

/* ─── Main page ──────────────────────────────────────── */
export default function Home() {
  usePageTitle("Production-Grade AI for Discord");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div style={{ background: "#070708" }}>

      {/* ══════ HERO — lapz.io full-bleed + deeo.studio bottom-left copy ══════ */}
      <section className="relative min-h-screen overflow-hidden flex flex-col justify-end">

        {/* Full-bleed photo */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={IMGS.hero}
            alt="Esports arena"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.32) saturate(0.85)" }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #070708 0%, rgba(7,7,8,0.55) 50%, rgba(7,7,8,0.2) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,229,0,0.06) 0%, transparent 70%)" }} />
        </motion.div>

        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* deeo.studio style: announcement top-left */}
        <motion.div
          className="absolute top-24 left-6 lg:left-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
            <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "#FFE500" }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
              GPT-4o + Voice v2
            </span>
          </div>
        </motion.div>

        {/* cp-agency.eu style: floating stats card — top right */}
        <motion.div
          className="absolute top-24 right-6 lg:right-12 hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltCard intensity={4} glowColor="rgba(255,229,0,0.06)">
            <div className="rounded-2xl p-6 w-52" style={{ background: "rgba(12,12,14,0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
              <BorderBeam color="#FFE500" duration={5} size={80} />
              <div className="font-display font-bold text-white" style={{ fontSize: 48, lineHeight: 1, letterSpacing: "-0.04em" }}>
                <CountUpNumber target={3000} suffix="+" />
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                Active servers
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="font-display font-bold text-white" style={{ fontSize: 28, lineHeight: 1, letterSpacing: "-0.03em" }}>99.9%</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Uptime SLA</div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* deeo.studio bottom-left headline */}
        <div className="relative px-6 lg:px-12 pb-16 lg:pb-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] mb-6"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Production-Grade AI — Discord Communities
          </motion.div>

          <h1 className="font-display font-bold leading-[0.88] tracking-tight text-white mb-6"
            style={{ fontSize: "clamp(52px, 9vw, 130px)" }}>
            <SplitReveal text="Wake up" className="block" delay={0.05} />
            <SplitReveal text="your server." className="block" delay={0.15}
            />
          </h1>
          <style>{`h1 > span:nth-child(2) > span > span { color: rgba(255,255,255,0.38); }`}</style>

          <Reveal delay={0.35} className="flex flex-col sm:flex-row gap-4 items-start">
            <p className="font-mono text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
              Memory, voice, 12 AI personalities, and a full analytics dashboard — everything your Discord community needs.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="flex gap-3 mt-8 flex-wrap">
            <Link href="/register"
              className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 transition-all"
              style={{ background: "#FFE500", color: "#000" }}>
              Add to Discord <ArrowUpRight size={14} />
            </Link>
            <Link href="/features"
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide px-7 py-3.5 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
              Explore Features
            </Link>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.2)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════ LOGO STRIP — lapz.io "As seen in" ══════ */}
      <DrawLine />
      <section className="py-8 px-6" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
            Trusted in
          </span>
          <div className="overflow-hidden flex-1">
            <motion.div className="flex gap-12 w-max items-center"
              animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
              {["GAMING", "STUDY", "DEVELOPER", "ANIME", "CRYPTO", "ART", "MUSIC", "SPORTS",
                "GAMING", "STUDY", "DEVELOPER", "ANIME", "CRYPTO", "ART", "MUSIC", "SPORTS"].map((s, i) => (
                <span key={i} className="font-display font-bold text-xl uppercase shrink-0 tracking-tight"
                  style={{ color: "rgba(255,255,255,0.09)", letterSpacing: "-0.02em" }}>{s}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <DrawLine />

      {/* ══════ SECTION 01 — AI ENGINE (image right, text left) ══════ */}
      <section className="relative overflow-hidden" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto px-6 py-28">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">

            {/* Left: text */}
            <div className="py-0 lg:pr-20 flex flex-col justify-center">
              <Reveal>
                <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-8" style={{ color: "rgba(255,255,255,0.22)" }}>
                  01 — AI Engine
                </div>
                <h2 className="font-display font-bold leading-[0.88] tracking-tight text-white mb-6"
                  style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}>
                  <SplitReveal text="Intelligence" className="block" />
                  <SplitReveal text="that scales." className="block" delay={0.1} />
                </h2>
                <style>{`h2.ai-h > span:nth-child(2) > span > span { color: rgba(255,255,255,0.35); }`}</style>
                <p className="font-mono text-sm leading-relaxed max-w-md mb-10" style={{ color: "rgba(255,255,255,0.38)" }}>
                  GPT-4o under the hood with a custom memory layer. Responses get smarter as your community grows — every interaction enriches the context model.
                </p>
              </Reveal>

              <div className="space-y-0">
                {modes.map((m, i) => (
                  <motion.div key={m.cmd}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ x: 6 }}
                    className="flex items-center justify-between py-3.5 px-4 cursor-pointer group transition-all"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex items-center gap-3">
                      <m.icon size={13} style={{ color: m.color }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.cmd}</span>
                    </div>
                    <span className="font-mono text-[11px] hidden sm:block" style={{ color: "rgba(255,255,255,0.28)" }}>{m.desc}</span>
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-50 transition-opacity ml-2 shrink-0" style={{ color: m.color }} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: real image + chat overlay */}
            <Reveal delay={0.1} className="relative lg:pl-10">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                <img src={IMGS.ai} alt="AI visualization" className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.5) saturate(0.7)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,8,0.98) 0%, rgba(7,7,8,0.4) 60%, transparent 100%)" }} />

                {/* Chat terminal floating bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <LiveChat />
                </div>

                {/* Corner label */}
                <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                  FIG.01
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════ STATS STRIP — cp-agency.eu style ══════ */}
      <section style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y" style={{ "--tw-divide-opacity": "1", borderColor: "rgba(255,255,255,0.05)" } as React.CSSProperties}>
          {[
            { label: "Discord Servers",      target: 3000,    suffix: "+",  sub: "Active communities"         },
            { label: "Messages Processed",   target: 1200000, suffix: "",   sub: "Across all servers"          },
            { label: "Uptime",               target: 99,      suffix: ".9%",sub: "SLA guaranteed"              },
            { label: "AI Modes",             target: 12,      suffix: "",   sub: "Voice, text & code"          },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="p-10" style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="font-display font-bold text-white mb-2"
                style={{ fontSize: "clamp(36px, 4vw, 60px)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                <CountUpNumber target={s.target} suffix={s.suffix} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "#FFE500", opacity: 0.7 }}>
                {s.label}
              </div>
              <div className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <DrawLine />

      {/* ══════ SECTION 02 — MEMORY (full-width image + text overlay) ══════ */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0c" }}>
        <div className="max-w-7xl mx-auto px-6 py-28">
          <div className="grid lg:grid-cols-2 gap-0 items-center">

            {/* Left: real image */}
            <Reveal className="relative lg:pr-10 mb-12 lg:mb-0">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <img src={IMGS.memory} alt="Data visualization" className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.45) saturate(0.65)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,7,8,0.9) 0%, rgba(7,7,8,0.3) 70%, transparent 100%)" }} />

                {/* Stats overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: "5,000", label: "Memory nodes" },
                      { val: "<12ms", label: "Search latency" },
                      { val: "∞",     label: "Cross-session" },
                      { val: "20+",   label: "Languages" },
                    ].map((s, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}
                        className="p-3 rounded-lg" style={{ background: "rgba(10,10,12,0.75)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
                      >
                        <div className="font-display font-bold text-white text-xl tracking-tight">{s.val}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>FIG.02</div>
              </div>
            </Reveal>

            {/* Right: text */}
            <div className="lg:pl-16">
              <Reveal>
                <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-8" style={{ color: "rgba(255,255,255,0.22)" }}>
                  02 — Memory System
                </div>
                <h2 className="font-display font-bold leading-[0.88] tracking-tight text-white mb-6"
                  style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}>
                  Remembers<br />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>everything.</span>
                </h2>
                <p className="font-mono text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Directioner builds a persistent memory graph from every interaction. Preferences, facts, server events — searchable and recallable across every session.
                </p>
              </Reveal>

              <Reveal delay={0.12} className="space-y-3">
                {[
                  "Vector database — cross-session recall",
                  "Per-user preference learning",
                  "Server-scoped and global memory nodes",
                  "Semantic search over entire memory graph",
                ].map((f, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.05 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,229,0,0.12)", border: "1px solid rgba(255,229,0,0.25)" }}>
                      <span className="text-[9px] font-bold" style={{ color: "#FFE500" }}>✓</span>
                    </div>
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{f}</span>
                  </motion.div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════ SECTION 03 — VOICE (image left + text right) ══════ */}
      <section className="relative overflow-hidden" style={{ background: "#070708" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-6 py-28 relative">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">

            {/* Left: text */}
            <div className="lg:pr-20 flex flex-col justify-center order-2 lg:order-1 mt-12 lg:mt-0">
              <Reveal>
                <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-8" style={{ color: "rgba(255,255,255,0.22)" }}>
                  03 — Voice Engine
                </div>
                <h2 className="font-display font-bold leading-[0.88] tracking-tight text-white mb-6"
                  style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}>
                  Speak.<br />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>It listens.</span>
                </h2>
                <p className="font-mono text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Real-time voice responses in any Discord voice channel. Ultra-low latency, multi-speaker recognition, built-in noise cancellation.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="grid grid-cols-2 gap-3">
                {[["<200ms","Audio latency"],["Multi-speaker","Recognition"],["Noise cancel","Built-in"],["Auto join","Voice channels"]].map(([val, label], i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="p-5 rounded-lg" style={{ background: "#0f0f12", border: "1px solid rgba(14,165,233,0.12)" }}
                  >
                    <div className="font-display font-bold text-white text-2xl tracking-tight" dangerouslySetInnerHTML={{ __html: val }} />
                    <div className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</div>
                  </motion.div>
                ))}
              </Reveal>
            </div>

            {/* Right: real image */}
            <Reveal delay={0.1} className="relative lg:pl-10 order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                <img src={IMGS.voice} alt="Recording studio" className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.4) saturate(0.75)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,8,0.92) 0%, rgba(7,7,8,0.3) 60%, transparent 100%)" }} />

                {/* Waveform overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Mic size={12} style={{ color: "#0ea5e9" }} />
                    <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>VOICE CHANNEL — LIVE</span>
                    <EqualizerBars active className="h-3 ml-auto" />
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <motion.div key={i} className="flex-1 rounded-sm min-w-[2px]"
                        style={{ background: `linear-gradient(to top, #0ea5e9, #6366f1)`, opacity: 0.7 }}
                        animate={{ height: [`${15 + Math.sin(i*0.8)*30}%`, `${45 + Math.cos(i*0.5+1)*40}%`, `${20 + Math.sin(i*0.6+2)*25}%`] }}
                        transition={{ duration: 1.8 + (i%5)*0.3, repeat: Infinity, ease: "easeInOut", delay: i*0.04 }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>FIG.03</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════ SECTION 04 — COMMUNITY (full-width image strip) ══════ */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0c" }}>
        <div className="relative h-[560px]">
          <img src={IMGS.community} alt="Gaming community" className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.28) saturate(0.7)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,12,0.98) 0%, rgba(10,10,12,0.5) 50%, rgba(10,10,12,0.3) 100%)" }} />
          <div className="grain-overlay" />

          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <Reveal>
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-8" style={{ color: "rgba(255,255,255,0.22)" }}>
                04 — AI Modes
              </div>
              <h2 className="font-display font-bold leading-[0.88] tracking-tight text-white mb-6"
                style={{ fontSize: "clamp(40px, 6vw, 88px)", maxWidth: 700 }}>
                12 personalities.<br />
                <span style={{ color: "rgba(255,255,255,0.35)" }}>One bot.</span>
              </h2>
              <p className="font-mono text-sm leading-relaxed max-w-md mb-8" style={{ color: "rgba(255,255,255,0.38)" }}>
                Switch between /chat, /tutor, /coder, /chaos, /creative, and /debate — each mode adapts completely to your community's culture.
              </p>
              <Link href="/commands"
                className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3.5 self-start"
                style={{ background: "#FFE500", color: "#000" }}>
                View All Commands <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Mode cards below the image */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modes.map((m, i) => (
              <motion.div key={m.cmd}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard intensity={4} glowColor={`${m.color}08`}>
                  <div className="group p-6 rounded-lg cursor-pointer transition-all"
                    style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${m.color}28`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                    <div className="flex items-center gap-2 mb-3">
                      <m.icon size={14} style={{ color: m.color }} />
                      <span className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.cmd}</span>
                    </div>
                    <p className="font-mono text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{m.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* ══════ TESTIMONIALS ══════ */}
      <section className="py-28" style={{ background: "#070708" }}>
        <div className="max-w-7xl mx-auto px-6 mb-14">
          <Reveal>
            <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-6" style={{ color: "rgba(255,255,255,0.22)" }}>05 — Community</div>
            <h2 className="font-display font-bold leading-[0.88] tracking-tight text-white"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}>
              Loved by thousands.
            </h2>
          </Reveal>
        </div>
        <div className="mb-4">
          <InfiniteRow speed={45} items={testimonials.map((t, i) => (
            <div key={i} className="w-[300px] p-6 rounded-xl shrink-0"
              style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="font-mono text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>"{t.q}"</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold" style={{ color: "#FFE500" }}>{t.u}</span>
                <span className="font-mono text-[9px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.22)" }}>{t.s} · {t.members}</span>
              </div>
            </div>
          ))} />
        </div>
        <InfiniteRow speed={55} reverse items={[...testimonials].reverse().map((t, i) => (
          <div key={i} className="w-[260px] p-5 rounded-xl shrink-0"
            style={{ background: "#0c0c0f", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>"{t.q}"</p>
            <span className="font-mono text-[9px] font-bold" style={{ color: "rgba(255,229,0,0.55)" }}>{t.u}</span>
          </div>
        ))} />
      </section>

      <DrawLine />

      {/* ══════ CTA — full-bleed photo + deeo.studio massive text ══════ */}
      <section className="relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src={IMGS.cta} alt="Dark tech" className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.22) saturate(0.7)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #070708 0%, rgba(7,7,8,0.6) 60%, rgba(7,7,8,0.3) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,229,0,0.07) 0%, transparent 70%)" }} />
        </div>
        <div className="grain-overlay" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <Reveal>
            <div className="font-mono text-[9px] uppercase tracking-[0.28em] mb-10" style={{ color: "rgba(255,255,255,0.25)" }}>
              Get Started Today
            </div>
          </Reveal>

          <h2 className="font-display font-bold leading-[0.88] tracking-tight mx-auto mb-10"
            style={{ fontSize: "clamp(52px, 10vw, 140px)", maxWidth: 1000, color: "#fff" }}>
            <SplitReveal text="Wake up" className="block" delay={0} />
            <SplitReveal text="your server." className="block" delay={0.12} />
          </h2>
          <style>{`
            h2.cta-h > span:nth-child(2) > span > span {
              background: linear-gradient(135deg, #FFE500, #ff9500);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            }
          `}</style>

          <Reveal delay={0.3} className="flex flex-wrap gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center gap-2 font-mono font-bold text-base uppercase tracking-wide px-10 py-4 transition-all"
              style={{ background: "#FFE500", color: "#000" }}>
              Add to Discord <ArrowUpRight size={18} />
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 font-mono text-base uppercase tracking-wide px-10 py-4 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}>
              View Pricing
            </Link>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
