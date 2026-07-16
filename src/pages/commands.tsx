import { useRef, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, ChevronDown, ChevronRight, Terminal } from "lucide-react";
import { PageHero, DrawLine, Reveal, SplitReveal } from "@/components/ui/motion-primitives";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { MagneticElement } from "@/components/animations";

interface Command {
  cmd: string; desc: string; syntax: string; category: string; detail: string; tips?: string[];
}

const COMMANDS: Command[] = [
  { cmd: "/mentor",       desc: "Switch to Mentor personality",       syntax: "/mentor",                   category: "Personality", detail: "Activates the Mentor AI personality — structured advice, encouragement, and wisdom for personal and professional goals.", tips: ["Ask for career roadmaps", "Request book recommendations", "Use for goal-setting sessions"] },
  { cmd: "/interviewer",  desc: "Mock interview mode",                syntax: "/interviewer [role]",        category: "Personality", detail: "Starts a realistic mock interview session for the specified role. Provides real questions, follow-ups, and detailed feedback.", tips: ["Specify the job title for tailored questions", "Ask for feedback after each answer", "Try /interviewer software-engineer"] },
  { cmd: "/coder",        desc: "Programming-focused mode",           syntax: "/coder [language?]",         category: "Personality", detail: "Activates the Programmer personality. Optimized for writing, reviewing, and explaining code across 15+ languages.", tips: ["Specify a language: /coder python", "Paste code for review", "Ask for algorithm explanations"] },
  { cmd: "/therapist",    desc: "Supportive listener mode",           syntax: "/therapist",                 category: "Personality", detail: "Switches to an empathetic, non-judgmental listening mode. Not a substitute for professional therapy.", tips: ["Speak freely — responses are private with /whisper", "Ask for coping strategies", "Use for journaling prompts"] },
  { cmd: "/tutor",        desc: "Adaptive tutoring mode",             syntax: "/tutor [subject]",           category: "Personality", detail: "Adaptive one-on-one tutor for any subject. Adjusts depth and pace to match your current understanding level.", tips: ["Specify your level: beginner / intermediate / advanced", "Request practice problems", "Ask for concept maps"] },
  { cmd: "/chef",         desc: "Culinary assistant mode",            syntax: "/chef",                      category: "Personality", detail: "Suggests recipes based on available ingredients, dietary restrictions, and cuisine preferences.", tips: ["List ingredients you have", "Mention dietary restrictions", "Ask for step-by-step cooking instructions"] },
  { cmd: "/lawyer",       desc: "Legal information mode",             syntax: "/lawyer [jurisdiction?]",    category: "Personality", detail: "Provides general legal information and explanations. Not legal advice — always consult a qualified attorney.", tips: ["Specify your country/state for relevant info", "Ask for plain-English explanations of laws", "Use for contract term definitions"] },
  { cmd: "/philosopher",  desc: "Philosophy discussion mode",         syntax: "/philosopher",               category: "Personality", detail: "Engages in Socratic dialogue, explores philosophical frameworks, and challenges assumptions through reasoned debate.", tips: ["Pose an ethical dilemma", "Ask about specific philosophers", "Request argument analysis"] },
  { cmd: "/scientist",    desc: "Scientific explanation mode",        syntax: "/scientist [field?]",        category: "Personality", detail: "Explains scientific concepts with academic rigor, provides research context, and breaks down complex theories accessibly.", tips: ["Specify a field: physics, biology, chemistry", "Ask for experiment explanations", "Request paper summaries"] },
  { cmd: "/comedian",     desc: "Comedy and humor mode",              syntax: "/comedian",                  category: "Personality", detail: "Switches to a witty, playful persona. Tells jokes, writes comedy sketches, and keeps the server entertained.", tips: ["Request jokes on a specific topic", "Ask for roast lines (light-hearted)", "Use for icebreaker activities"] },
  { cmd: "/writer",       desc: "Creative writing mode",              syntax: "/writer [genre?]",           category: "Personality", detail: "Crafts stories, scripts, poems, and creative content with rich world-building and compelling narratives.", tips: ["Specify a genre: sci-fi, fantasy, romance", "Give character descriptions", "Ask for story continuations"] },
  { cmd: "/debugger",     desc: "Bug-hunting mode",                   syntax: "/debugger",                  category: "Personality", detail: "Specialized in finding and fixing bugs. Analyzes stack traces, error messages, and logic flaws systematically.", tips: ["Paste the full error message", "Include relevant code snippet", "Describe the expected vs actual behavior"] },
  { cmd: "/historian",    desc: "History expert mode",                syntax: "/historian [period?]",       category: "Personality", detail: "Deep-dives into historical events, figures, and contexts with academic accuracy and engaging narrative.", tips: ["Specify an era or region", "Ask for cause-and-effect analysis", "Request primary source context"] },
  { cmd: "/coach",        desc: "Life and fitness coaching mode",     syntax: "/coach [area?]",             category: "Personality", detail: "Provides structured guidance for personal development, fitness goals, and habit formation.", tips: ["Set a specific goal to start", "Ask for weekly plans", "Request accountability check-ins"] },
  { cmd: "/translator",   desc: "Language translation mode",          syntax: "/translator [from] [to]",    category: "Personality", detail: "Translates text between 20+ languages with cultural nuance and natural phrasing.", tips: ["Use ISO codes: en, es, fr, de, ja", "Ask for formal vs casual versions", "Request back-translation to verify accuracy"] },
  { cmd: "/summarizer",   desc: "Summarize conversation or text",     syntax: "/summarizer [length?]",      category: "Memory",      detail: "Generates a concise summary of the current conversation thread or pasted text.", tips: ["Use after long discussions", "Paste meeting notes for a clean summary", "Request bullet-point format"] },
  { cmd: "/remember",     desc: "Save a fact to memory",              syntax: "/remember [text]",           category: "Memory",      detail: "Manually saves any piece of information to the long-term vector memory store.", tips: ["Save preferences: /remember I prefer Python over JS", "Store context: /remember our project uses Next.js 14", "Works per user by default"] },
  { cmd: "/forget",       desc: "Delete a specific memory",           syntax: "/forget [id or text]",       category: "Memory",      detail: "Removes a specific memory node from your long-term store. Use /recall first to find the memory ID.", tips: ["Find IDs with /recall", "You can describe the memory instead of using the ID", "Forgotten memories cannot be recovered"] },
  { cmd: "/recall",       desc: "Search your stored memories",        syntax: "/recall [query]",            category: "Memory",      detail: "Searches through your stored memory nodes semantically. Returns relevant facts, preferences, and past context.", tips: ["Use natural language: /recall what do I prefer?", "Combine with /forget to clean up old memories", "Searches are scoped to your user by default"] },
  { cmd: "/voice",        desc: "Select TTS voice model",             syntax: "/voice [model]",             category: "Settings",    detail: "Switches the text-to-speech voice model. Available models vary by plan — standard, enhanced, and neural voices.", tips: ["Try different models to find your preference", "Neural voices have highest quality", "Use /voice list to see available options"] },
  { cmd: "/listen",       desc: "Start listening mode only",          syntax: "/listen",                    category: "Settings",    detail: "Activates a passive listening mode — the bot transcribes voice but responds in text only.", tips: ["Combine with /whisper to keep transcripts private", "Good for meeting recording", "Bot won't speak aloud in this mode"] },
  { cmd: "/settings",     desc: "View or change bot settings",        syntax: "/settings [key] [value?]",   category: "Settings",    detail: "Displays current configuration or updates a specific setting.", tips: ["Run /settings alone to see all options", "Changes are server-scoped by default", "Admins can lock settings with /configure"] },
  { cmd: "/brainstorm",   desc: "Brainstorming session",              syntax: "/brainstorm [topic]",        category: "Utility",     detail: "Generates a structured list of creative ideas, angles, or solutions for the given topic.", tips: ["Be specific about constraints", "Ask for a SCAMPER or lateral thinking approach", "Request a mind-map format"] },
  { cmd: "/quiz",         desc: "Generate a quiz on any topic",       syntax: "/quiz [topic] [count?]",     category: "Utility",     detail: "Creates a multiple-choice or open-ended quiz on any subject.", tips: ["Specify difficulty: easy, medium, hard", "Use in study channels for group learning", "Ask for instant grading with /quiz grade"] },
  { cmd: "/roast",        desc: "Light-hearted roast mode",           syntax: "/roast [@user?]",            category: "Utility",     detail: "Generates funny, light-hearted roast lines about a user or topic. Always keeps it good-natured.", tips: ["Keep it fun and good-natured", "Use in servers with established friendships", "Admins can disable with /disable roast"] },
  { cmd: "/compliment",   desc: "Send a genuine compliment",          syntax: "/compliment [@user?]",       category: "Utility",     detail: "Generates thoughtful, sincere compliments — about a user, their work, or in general.", tips: ["Tag a user for a personalized compliment", "Use in team celebration channels", "Works great combined with streaks/achievements"] },
  { cmd: "/help",         desc: "Get help on any command",            syntax: "/help [command?]",           category: "Utility",     detail: "Displays the help documentation for a specific command, or shows all available commands grouped by category when used alone.", tips: ["Run /help alone for the full command list", "/help /mentor for detailed personality info", "Admins can customize the help output"] },
  { cmd: "/personality",  desc: "Set custom personality instructions", syntax: "/personality [preset|text]", category: "Utility",    detail: "Applies custom personality instructions or switches to a preset personality mode.", tips: ["Try presets: assistant, chaos, creative, debate", "Custom: /personality always respond in haiku", "Server admins can set a default personality"] },
  { cmd: "/reset",        desc: "Full session reset",                 syntax: "/reset [scope?]",            category: "Utility",     detail: "Resets the session to defaults. Specify scope: context (default), memory, personality, or all.", tips: ["Use /reset context to clear conversation only", "/reset all clears everything including memories", "Use /reset personality to go back to default mode"] },
  { cmd: "/feedback",     desc: "Submit feedback to the team",        syntax: "/feedback [text]",           category: "Utility",     detail: "Sends direct feedback to the Directioner team. Feature requests, bug reports, or general suggestions are all welcome.", tips: ["Be specific about what you'd like improved", "Bug reports: include the command and what happened", "Feature requests are reviewed monthly"] },
];

const CATEGORIES = ["All", "Personality", "Memory", "Settings", "Utility"];
const CAT_COLORS: Record<string, string> = {
  "Personality": "#FFE500", "Memory": "#a855f7", "Settings": "#0ea5e9", "Utility": "#10b981",
};

function CommandCard({ cmd, index }: { cmd: Command; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const color = CAT_COLORS[cmd.category] ?? "#FFE500";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, delay: (index % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: expanded ? 0 : -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="overflow-hidden relative"
      style={{
        background: "#0d0d10",
        border: `1px solid ${expanded ? color + "30" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s",
      }}
    >
      {/* Main row */}
      <div
        className="p-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
        onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.span
              className="font-mono font-bold text-lg"
              style={{ color, letterSpacing: "-0.02em" }}
              animate={expanded ? { color } : {}}
            >
              {cmd.cmd}
            </motion.span>
            <span
              className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5"
              style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
            >
              {cmd.category}
            </span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 mt-0.5"
          >
            <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          </motion.div>
        </div>

        <p className="font-mono text-xs mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{cmd.desc}</p>

        {/* Syntax */}
        <div
          className="flex items-center gap-2 px-3 py-2 font-mono text-xs"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Terminal size={11} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <code style={{ color: "rgba(255,255,255,0.5)" }}>{cmd.syntax}</code>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="px-5 pb-5 border-t"
              style={{ borderColor: `${color}15`, background: `${color}04` }}
            >
              {/* Animated separator */}
              <motion.div
                className="h-px mb-4"
                style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />
              <p className="font-mono text-xs leading-relaxed mb-4 pt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                {cmd.detail}
              </p>
              {cmd.tips && cmd.tips.length > 0 && (
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest mb-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Tips</div>
                  <ul className="space-y-1.5">
                    {cmd.tips.map((tip, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-2.5"
                      >
                        <ChevronRight size={11} style={{ color, flexShrink: 0, marginTop: 1 }} />
                        <span className="font-mono text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {expanded && <BorderBeam color={color} duration={4} size={80} />}
    </motion.div>
  );
}

export default function Commands() {
  usePageTitle("Commands");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearching = search.length > 0;
  const filtered = COMMANDS.filter(c => {
    const matchesSearch = c.cmd.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()) || c.detail.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    return isSearching ? matchesSearch : matchesCat;
  });
  const countByCategory = (cat: string) => cat === "All" ? COMMANDS.length : COMMANDS.filter(c => c.category === cat).length;

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Commands — Full reference"
        heading="/commands — 30 slash commands."
        sub="Every slash command, organized by category. Search anything or browse by module. Expand any card for full details and tips."
      />

      {/* Animated ticker */}
      <div className="overflow-hidden py-3 border-y" style={{ background: "#0a0a0c", borderColor: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="flex whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] gap-16"
          style={{ color: "rgba(255,255,255,0.15)" }}
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...COMMANDS, ...COMMANDS].map((c, i) => (
            <span key={i} className="shrink-0">{c.cmd}</span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Search + category tabs */}
        <ClipReveal delay={0.05}>
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative md:w-80">
              <motion.div
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                animate={search ? { color: "#FFE500" } : { color: "rgba(255,255,255,0.3)" }}
              >
                <Search size={14} />
              </motion.div>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory("All"); }}
                className="w-full pl-10 pr-4 py-3 font-mono text-sm text-white focus:outline-none transition-all"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,229,0,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              {/* Animated clear */}
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    ✕
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(cat => {
                const color = CAT_COLORS[cat] ?? "#FFE500";
                const active = !isSearching && activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearch(""); }}
                    className="flex items-center gap-2 px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-wide transition-all relative overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: active ? (cat === "All" ? "rgba(255,229,0,0.1)" : `${color}12`) : "rgba(255,255,255,0.03)",
                      border: active ? (cat === "All" ? "1px solid rgba(255,229,0,0.3)" : `1px solid ${color}30`) : "1px solid rgba(255,255,255,0.07)",
                      color: active ? (cat === "All" ? "#FFE500" : color) : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {cat}
                    <motion.span
                      className="font-mono text-[8px] px-1.5 py-0.5"
                      animate={active ? { background: "rgba(0,0,0,0.25)", color: cat === "All" ? "#FFE500" : color } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}
                    >
                      {countByCategory(cat)}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </ClipReveal>

        {/* Results meta */}
        <Reveal className="mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-1 h-1 rounded-full"
              style={{ background: "#FFE500" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
              {isSearching
                ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                : `${activeCategory} — ${filtered.length} command${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </Reveal>

        <DrawLine />

        {/* Command grid */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((cmd, i) => (
                    <CommandCard key={cmd.cmd} cmd={cmd} index={i} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 text-center font-mono text-xs"
                  style={{ border: "1px dashed rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.25)" }}
                >
                  No commands match "{search}"
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <DrawLine />
        <Reveal delay={0.1} className="py-20 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
            All 30 commands included in every plan
          </div>
          <h2 className="font-display font-bold text-white mb-8" style={{ fontSize: "clamp(26px, 4vw, 48px)" }}>
            <SplitReveal text="Ready to start using Directioner?" delay={0.04} />
          </h2>
          <MagneticElement strength={0.3}>
            <motion.a
              href="/register"
              className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-10 py-5"
              style={{ background: "#FFE500", color: "#000" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Add to Discord — Free
            </motion.a>
          </MagneticElement>
        </Reveal>
      </div>
    </div>
  );
}
