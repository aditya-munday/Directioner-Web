import { useRef, useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { MagneticElement } from "@/components/animations";
import { BorderBeam } from "@/components/animations/BorderBeam";

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

const CATEGORIES = ["All", "Product", "Engineering", "Community", "Tutorials", "Company"];

const posts = [
  { id: 1, category: "Product",     title: "Introducing Directioner v2: 31 AI Personalities",       excerpt: "Today we're shipping our biggest update yet — a complete overhaul of our personality system, new voice capabilities, and memory that actually works.", date: "Jul 10, 2026", readTime: "6 min read",  featured: true,  color: "#FFE500" },
  { id: 2, category: "Engineering", title: "How We Built a Real-Time Voice Pipeline Under 200ms",     excerpt: "Engineering deep dive into our WebSocket-first architecture, edge inference, and the lessons we learned cutting latency from 800ms to under 200ms.",   date: "Jul 3, 2026",  readTime: "12 min read", featured: false, color: "#0ea5e9" },
  { id: 3, category: "Community",   title: "How Dev Syndicate Replaced 3 Bots with Directioner",    excerpt: "We sat down with the admins of Dev Syndicate (8,100 members) to learn how they consolidated their bot stack and saw engagement triple.",              date: "Jun 28, 2026", readTime: "8 min read",  featured: false, color: "#10b981" },
  { id: 4, category: "Tutorials",   title: "Getting the Most Out of /tutor Mode",                    excerpt: "A step-by-step guide to setting up structured learning sessions in your server — from onboarding students to tracking progress.",                    date: "Jun 21, 2026", readTime: "5 min read",  featured: false, color: "#a855f7" },
  { id: 5, category: "Engineering", title: "Memory Architecture: How Directioner Remembers",         excerpt: "An in-depth look at our vector-based memory system — how we store, retrieve, and prioritize context across thousands of concurrent conversations.",    date: "Jun 14, 2026", readTime: "15 min read", featured: false, color: "#f43f5e" },
  { id: 6, category: "Company",     title: "Directioner's Seed Round: What's Next",                  excerpt: "We raised $2.4M to accelerate our roadmap. Here's exactly what we're building and why we think AI-native Discord bots are just getting started.",    date: "Jun 7, 2026",  readTime: "4 min read",  featured: false, color: "#FFE500" },
  { id: 7, category: "Community",   title: "Scaling Moderation with AI: A Case Study",               excerpt: "How Crypto Alpha used Directioner's context-aware responses to handle 20,000 members with the same team that struggled with 2,000.",                  date: "May 30, 2026", readTime: "7 min read",  featured: false, color: "#0ea5e9" },
  { id: 8, category: "Product",     title: "Analytics Dashboard: Track What Actually Matters",        excerpt: "A walkthrough of our new server analytics — engagement rates, command usage heatmaps, and the metrics that predict healthy community growth.",         date: "May 22, 2026", readTime: "5 min read",  featured: false, color: "#10b981" },
  { id: 9, category: "Tutorials",   title: "Building a Study Group Bot Configuration",               excerpt: "How to combine /tutor, /mentor, and /quiz personalities with custom triggers to create a fully automated study group experience.",                    date: "May 15, 2026", readTime: "9 min read",  featured: false, color: "#a855f7" },
];

function PostCard({ post, index }: { post: (typeof posts)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={e => { setHovered(true); (e.currentTarget as HTMLElement).style.borderColor = `${post.color}25`; }}
      onMouseLeave={e => { setHovered(false); (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="group relative flex flex-col overflow-hidden cursor-pointer"
      style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.3s" }}
    >
      {/* Color accent top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: post.color }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Placeholder image area */}
      <div className="relative w-full h-44 overflow-hidden flex items-center justify-center" style={{ background: `${post.color}08` }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${post.color}18 0%, transparent 70%)` }}
          animate={hovered ? { opacity: 1.5 } : { opacity: 1 }}
        />
        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${post.color}30, transparent)` }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative z-10 font-display font-bold select-none text-center"
          style={{ fontSize: "clamp(36px, 5vw, 60px)", color: post.color, opacity: 0.06, letterSpacing: "-0.04em" }}
          animate={hovered ? { opacity: 0.12, scale: 1.04 } : { opacity: 0.06, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {post.category.toUpperCase()}
        </motion.div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1" style={{ color: post.color, background: `${post.color}15` }}>
            {post.category}
          </span>
        </div>

        <h3 className="font-display font-bold text-white text-lg leading-tight tracking-tight mb-3 transition-colors" style={{ letterSpacing: "-0.02em" }}>
          {post.title}
        </h3>

        <p className="font-mono text-[11px] leading-relaxed text-white/40 mb-6 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/25"><Calendar size={10} /> {post.date}</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/25"><Clock size={10} /> {post.readTime}</span>
          </div>
          <motion.div animate={hovered ? { x: 3, y: -3 } : { x: 0, y: 0 }} transition={{ duration: 0.2 }}>
            <ArrowUpRight size={14} style={{ color: post.color }} />
          </motion.div>
        </div>
      </div>

      <BorderBeam color={post.color} duration={6} delay={index * 0.2} size={60} />
    </motion.article>
  );
}

export default function Blog() {
  usePageTitle("Blog — Directioner");
  const [activeCategory, setActiveCategory] = useState("All");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const featured = posts.find(p => p.featured)!;
  const gridPosts = activeCategory === "All" ? posts.filter(p => !p.featured) : posts.filter(p => p.category === activeCategory);

  return (
    <div style={{ background: "#070708" }}>
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute"
            style={{ width: 700, height: 400, top: 0, left: "25%", background: "radial-gradient(ellipse, rgba(255,229,0,0.07) 0%, transparent 70%)", filter: "blur(80px)" }}
            animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="grain-overlay" />

        <motion.div className="max-w-7xl mx-auto relative" style={{ y: heroY, opacity: heroOpacity }}>
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Blog</span>
          </Reveal>
          <h1 className="font-display font-bold text-white leading-[0.88] tracking-tight mt-4" style={{ fontSize: "clamp(52px, 8vw, 110px)", letterSpacing: "-0.04em" }}>
            <SplitReveal text="Thoughts on" className="block" delay={0.05} />
            <SplitReveal text="AI & Discord." className="block text-white/30" delay={0.18} />
          </h1>
        </motion.div>
      </section>

      {/* ── Category filter ── */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                layout
                className="font-mono text-[11px] uppercase tracking-wide px-4 py-2 transition-all duration-200 relative overflow-hidden"
                style={{
                  background: activeCategory === cat ? "#FFE500" : "rgba(255,255,255,0.04)",
                  color: activeCategory === cat ? "#000" : "rgba(255,255,255,0.45)",
                  border: activeCategory === cat ? "1px solid #FFE500" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="blog-cat-bg"
                    className="absolute inset-0 bg-[#FFE500]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured post ── */}
      <AnimatePresence>
        {activeCategory === "All" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="px-6 pb-14"
          >
            <div className="max-w-7xl mx-auto">
              <motion.article
                className="relative overflow-hidden cursor-pointer group"
                style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.08)" }}
                whileHover={{ borderColor: "rgba(255,229,0,0.25)" }}
                transition={{ duration: 0.3 }}
              >
                <BorderBeam color="#FFE500" duration={5} />
                <div className="grid md:grid-cols-2">
                  {/* Image placeholder */}
                  <div className="relative h-64 md:h-auto overflow-hidden flex items-center justify-center" style={{ background: "rgba(255,229,0,0.04)", minHeight: 280 }}>
                    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,229,0,0.12) 0%, transparent 70%)" }} />
                    <motion.div
                      className="absolute left-0 right-0 h-px pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,229,0,0.25), transparent)" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="font-display font-bold text-white/[0.04] select-none"
                      style={{ fontSize: "clamp(80px, 12vw, 160px)", letterSpacing: "-0.04em" }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      v2
                    </motion.div>
                    <div className="absolute top-4 left-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1.5" style={{ background: "#FFE500", color: "#000" }}>
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] mb-4" style={{ color: "#FFE500" }}>{featured.category}</span>
                    <h2 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight tracking-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
                      {featured.title}
                    </h2>
                    <p className="font-mono text-[12px] leading-relaxed text-white/45 mb-8">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30"><Calendar size={10} /> {featured.date}</span>
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30"><Clock size={10} /> {featured.readTime}</span>
                      </div>
                      <motion.div
                        className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: "#FFE500" }}
                        whileHover={{ x: 4 }}
                      >
                        Read more <ArrowUpRight size={13} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Post grid ── */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {gridPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {gridPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <p className="font-mono text-sm text-white/25">No posts in this category yet.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#0a0a0c", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(255,229,0,0.06) 0%, transparent 70%)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="max-w-2xl mx-auto text-center relative">
          <Reveal>
            <h2 className="font-display font-bold text-white mb-3 tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.03em" }}>
              Stay in the loop.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono text-sm text-white/35 mb-8">
              Get new articles, product updates, and community stories straight to your inbox.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <motion.input
                type="email"
                placeholder="your@email.com"
                className="flex-1 font-mono text-sm px-4 py-3 text-white/70 outline-none placeholder:text-white/20 transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,229,0,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                whileFocus={{ scale: 1.01 }}
              />
              <MagneticElement strength={0.2}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-mono text-sm font-bold uppercase tracking-wide px-6 py-3 whitespace-nowrap"
                  style={{ background: "#FFE500", color: "#000" }}
                >
                  Subscribe →
                </motion.button>
              </MagneticElement>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
