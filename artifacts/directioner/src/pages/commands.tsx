import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronRight, Terminal } from "lucide-react";
import { PageHero, DrawLine, Reveal, SplitReveal } from "@/components/ui/motion-primitives";
import { ClipReveal } from "@/components/animations/ClipReveal";

/* ─── Command data ─────────────────────────────────────────────────────────── */

interface Command {
  cmd: string;
  desc: string;
  syntax: string;
  category: string;
  detail: string;
  tips?: string[];
}

const COMMANDS: Command[] = [
  // PERSONALITIES
  { cmd: "/mentor",       desc: "Switch to Mentor personality",     syntax: "/mentor",                   category: "Personality", detail: "Activates the Mentor AI personality — structured advice, encouragement, and wisdom for personal and professional goals.", tips: ["Ask for career roadmaps", "Request book recommendations", "Use for goal-setting sessions"] },
  { cmd: "/interviewer",  desc: "Mock interview mode",              syntax: "/interviewer [role]",        category: "Personality", detail: "Starts a realistic mock interview session for the specified role. Provides real questions, follow-ups, and detailed feedback.", tips: ["Specify the job title for tailored questions", "Ask for feedback after each answer", "Try /interviewer software-engineer"] },
  { cmd: "/coder",        desc: "Programming-focused mode",         syntax: "/coder [language?]",         category: "Personality", detail: "Activates the Programmer personality. Optimized for writing, reviewing, and explaining code across 15+ languages.", tips: ["Specify a language: /coder python", "Paste code for review", "Ask for algorithm explanations"] },
  { cmd: "/therapist",    desc: "Supportive listener mode",         syntax: "/therapist",                 category: "Personality", detail: "Switches to an empathetic, non-judgmental listening mode. Provides emotional support, reflection, and gentle guidance. Not a substitute for professional therapy.", tips: ["Speak freely — responses are private with /whisper", "Ask for coping strategies", "Use for journaling prompts"] },
  { cmd: "/tutor",        desc: "Adaptive tutoring mode",           syntax: "/tutor [subject]",           category: "Personality", detail: "Adaptive one-on-one tutor for any subject. Adjusts depth and pace to match your current understanding level.", tips: ["Specify your level: beginner / intermediate / advanced", "Request practice problems", "Ask for concept maps"] },
  { cmd: "/chef",         desc: "Culinary assistant mode",          syntax: "/chef",                      category: "Personality", detail: "Suggests recipes based on available ingredients, dietary restrictions, and cuisine preferences.", tips: ["List ingredients you have", "Mention dietary restrictions", "Ask for step-by-step cooking instructions"] },
  { cmd: "/lawyer",       desc: "Legal information mode",           syntax: "/lawyer [jurisdiction?]",    category: "Personality", detail: "Provides general legal information and explanations. Not legal advice — always consult a qualified attorney for your specific situation.", tips: ["Specify your country/state for relevant info", "Ask for plain-English explanations of laws", "Use for contract term definitions"] },
  { cmd: "/philosopher",  desc: "Philosophy discussion mode",       syntax: "/philosopher",               category: "Personality", detail: "Engages in Socratic dialogue, explores philosophical frameworks, and challenges assumptions through reasoned debate.", tips: ["Pose an ethical dilemma", "Ask about specific philosophers", "Request argument analysis"] },
  { cmd: "/scientist",    desc: "Scientific explanation mode",      syntax: "/scientist [field?]",        category: "Personality", detail: "Explains scientific concepts with academic rigor, provides research context, and breaks down complex theories accessibly.", tips: ["Specify a field: physics, biology, chemistry", "Ask for experiment explanations", "Request paper summaries"] },
  { cmd: "/comedian",     desc: "Comedy and humor mode",            syntax: "/comedian",                  category: "Personality", detail: "Switches to a witty, playful persona. Tells jokes, writes comedy sketches, and keeps the server entertained.", tips: ["Request jokes on a specific topic", "Ask for roast lines (light-hearted)", "Use for icebreaker activities"] },
  { cmd: "/writer",       desc: "Creative writing mode",            syntax: "/writer [genre?]",           category: "Personality", detail: "Crafts stories, scripts, poems, and creative content with rich world-building and compelling narratives.", tips: ["Specify a genre: sci-fi, fantasy, romance", "Give character descriptions", "Ask for story continuations"] },
  { cmd: "/debugger",     desc: "Bug-hunting mode",                 syntax: "/debugger",                  category: "Personality", detail: "Specialized in finding and fixing bugs. Analyzes stack traces, error messages, and logic flaws systematically.", tips: ["Paste the full error message", "Include relevant code snippet", "Describe the expected vs actual behavior"] },
  { cmd: "/historian",    desc: "History expert mode",              syntax: "/historian [period?]",       category: "Personality", detail: "Deep-dives into historical events, figures, and contexts with academic accuracy and engaging narrative.", tips: ["Specify an era or region", "Ask for cause-and-effect analysis", "Request primary source context"] },
  { cmd: "/coach",        desc: "Life and fitness coaching mode",   syntax: "/coach [area?]",             category: "Personality", detail: "Provides structured guidance for personal development, fitness goals, and habit formation.", tips: ["Set a specific goal to start", "Ask for weekly plans", "Request accountability check-ins"] },
  { cmd: "/translator",   desc: "Language translation mode",        syntax: "/translator [from] [to]",    category: "Personality", detail: "Translates text between 20+ languages with cultural nuance and natural phrasing. Supports real-time conversation translation.", tips: ["Use ISO codes: en, es, fr, de, ja", "Ask for formal vs casual versions", "Request back-translation to verify accuracy"] },
  // MEMORY
  { cmd: "/summarizer",   desc: "Summarize conversation or text",   syntax: "/summarizer [length?]",      category: "Memory",      detail: "Generates a concise summary of the current conversation thread or pasted text. Specify short, medium, or detailed length.", tips: ["Use after long discussions", "Paste meeting notes for a clean summary", "Request bullet-point format"] },
  { cmd: "/remember",     desc: "Save a fact to memory",            syntax: "/remember [text]",           category: "Memory",      detail: "Manually saves any piece of information to the long-term vector memory store. Recalled automatically in relevant future conversations.", tips: ["Save preferences: /remember I prefer Python over JS", "Store context: /remember our project uses Next.js 14", "Works per user by default"] },
  { cmd: "/forget",       desc: "Delete a specific memory",         syntax: "/forget [id or text]",       category: "Memory",      detail: "Removes a specific memory node from your long-term store. Use /recall first to find the memory ID.", tips: ["Find IDs with /recall", "You can describe the memory instead of using the ID", "Forgotten memories cannot be recovered"] },
  { cmd: "/recall",       desc: "Search your stored memories",      syntax: "/recall [query]",            category: "Memory",      detail: "Searches through your stored memory nodes semantically. Returns relevant facts, preferences, and past context.", tips: ["Use natural language: /recall what do I prefer?", "Combine with /forget to clean up old memories", "Searches are scoped to your user by default"] },
  // SETTINGS
  { cmd: "/voice",        desc: "Select TTS voice model",           syntax: "/voice [model]",             category: "Settings",    detail: "Switches the text-to-speech voice model. Available models vary by plan — standard, enhanced, and neural voices.", tips: ["Try different models to find your preference", "Neural voices have highest quality", "Use /voice list to see available options"] },
  { cmd: "/listen",       desc: "Start listening mode only",        syntax: "/listen",                    category: "Settings",    detail: "Activates a passive listening mode — the bot transcribes voice but responds in text only. Useful for transcription sessions.", tips: ["Combine with /whisper to keep transcripts private", "Good for meeting recording", "Bot won't speak aloud in this mode"] },
  { cmd: "/settings",     desc: "View or change bot settings",      syntax: "/settings [key] [value?]",   category: "Settings",    detail: "Displays current configuration or updates a specific setting. Run without arguments to see all available settings and current values.", tips: ["Run /settings alone to see all options", "Changes are server-scoped by default", "Admins can lock settings with /configure"] },
  // UTILITY
  { cmd: "/brainstorm",   desc: "Brainstorming session",            syntax: "/brainstorm [topic]",        category: "Utility",     detail: "Generates a structured list of creative ideas, angles, or solutions for the given topic. Works for business, creative, and technical problems.", tips: ["Be specific about constraints", "Ask for a SCAMPER or lateral thinking approach", "Request a mind-map format"] },
  { cmd: "/quiz",         desc: "Generate a quiz on any topic",     syntax: "/quiz [topic] [count?]",     category: "Utility",     detail: "Creates a multiple-choice or open-ended quiz on any subject. Optionally specify the number of questions and difficulty level.", tips: ["Specify difficulty: easy, medium, hard", "Use in study channels for group learning", "Ask for instant grading with /quiz grade"] },
  { cmd: "/roast",        desc: "Light-hearted roast mode",         syntax: "/roast [@user?]",            category: "Utility",     detail: "Generates funny, light-hearted roast lines about a user or topic. Always keeps it good-natured — no personal attacks.", tips: ["Keep it fun and good-natured", "Use in servers with established friendships", "Admins can disable with /disable roast"] },
  { cmd: "/compliment",   desc: "Send a genuine compliment",        syntax: "/compliment [@user?]",       category: "Utility",     detail: "Generates thoughtful, sincere compliments — about a user, their work, or in general. Good for community mood-boosting.", tips: ["Tag a user for a personalized compliment", "Use in team celebration channels", "Works great combined with streaks/achievements"] },
  { cmd: "/help",         desc: "Get help on any command",          syntax: "/help [command?]",           category: "Utility",     detail: "Displays the help documentation for a specific command, or shows all available commands grouped by category when used alone.", tips: ["Run /help alone for the full command list", "/help /mentor for detailed personality info", "Admins can customize the help output"] },
  { cmd: "/personality",  desc: "Set custom personality instructions", syntax: "/personality [preset|text]", category: "Utility",  detail: "Applies custom personality instructions or switches to a preset personality mode. Accepts free-form instructions for granular control.", tips: ["Try presets: assistant, chaos, creative, debate", "Custom: /personality always respond in haiku", "Server admins can set a default personality"] },
  { cmd: "/reset",        desc: "Full session reset",               syntax: "/reset [scope?]",            category: "Utility",     detail: "Resets the session to defaults. Specify scope: context (default), memory, personality, or all — to control exactly what is cleared.", tips: ["Use /reset context to clear conversation only", "/reset all clears everything including memories", "Use /reset personality to go back to default mode"] },
  { cmd: "/feedback",     desc: "Submit feedback to the team",      syntax: "/feedback [text]",           category: "Utility",     detail: "Sends direct feedback to the Directioner team. Feature requests, bug reports, or general suggestions are all welcome.", tips: ["Be specific about what you'd like improved", "Bug reports: include the command and what happened", "Feature requests are reviewed monthly"] },
];

const CATEGORIES = ["All", "Personality", "Memory", "Settings", "Utility"];

const CAT_COLORS: Record<string, string> = {
  "Personality": "#FFE500",
  "Memory":      "#a855f7",
  "Settings":    "#0ea5e9",
  "Utility":     "#10b981",
};

function CommandCard({ cmd, index }: { cmd: Command; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = CAT_COLORS[cmd.category] ?? "#FFE500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "#0d0d10",
        border: `1px solid ${expanded ? color + "30" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s",
      }}
    >
      {/* Main row */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={e => {
          if (!expanded) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={e => {
          if (!expanded) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {/* Top: command name + category badge + expand chevron */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono font-bold text-lg" style={{ color, letterSpacing: "-0.02em" }}>
              {cmd.cmd}
            </span>
            <span
              className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
            >
              {cmd.category}
            </span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 mt-0.5"
          >
            <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          </motion.div>
        </div>

        {/* Description */}
        <p className="font-mono text-xs mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
          {cmd.desc}
        </p>

        {/* Usage example */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded font-mono text-xs"
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
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="px-5 pb-5 border-t"
              style={{ borderColor: `${color}15`, background: `${color}05` }}
            >
              <p
                className="font-mono text-xs leading-relaxed mt-4 mb-4"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {cmd.detail}
              </p>
              {cmd.tips && cmd.tips.length > 0 && (
                <div>
                  <div
                    className="font-mono text-[9px] uppercase tracking-widest mb-2.5"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    Tips
                  </div>
                  <ul className="space-y-1.5">
                    {cmd.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <ChevronRight size={11} style={{ color, flexShrink: 0, marginTop: 1 }} />
                        <span className="font-mono text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Commands() {
  usePageTitle("Commands");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const isSearching = search.length > 0;

  const filtered = COMMANDS.filter(c => {
    const matchesSearch =
      c.cmd.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.detail.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    return (isSearching ? matchesSearch : matchesCat);
  });

  const countByCategory = (cat: string) =>
    cat === "All" ? COMMANDS.length : COMMANDS.filter(c => c.category === cat).length;

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Commands — Full reference"
        heading="/commands — 30 slash commands."
        sub="Every slash command, organized by category. Search anything or browse by module. Expand any card for full details and tips."
      />

      {/* Ticker */}
      <div
        className="overflow-hidden py-3 border-y"
        style={{ background: "#0a0a0c", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex whitespace-nowrap animate-ticker font-mono text-[9px] uppercase tracking-[0.22em] gap-16"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          {[...COMMANDS, ...COMMANDS].map((c, i) => (
            <span key={i}>{c.cmd}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Search + category tabs */}
        <ClipReveal delay={0.05}>
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative md:w-80">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              />
              <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory("All"); }}
                className="w-full pl-10 pr-4 py-3 font-mono text-sm text-white focus:outline-none transition-all rounded-lg"
                style={{
                  background: "#0f0f12",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(cat => {
                const color = CAT_COLORS[cat] ?? "#FFE500";
                const active = !isSearching && activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearch(""); }}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wide transition-all"
                    style={{
                      background: active
                        ? cat === "All" ? "rgba(255,229,0,0.1)" : `${color}12`
                        : "rgba(255,255,255,0.03)",
                      border: active
                        ? cat === "All" ? "1px solid rgba(255,229,0,0.3)" : `1px solid ${color}30`
                        : "1px solid rgba(255,255,255,0.07)",
                      color: active
                        ? cat === "All" ? "#FFE500" : color
                        : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {cat}
                    <span
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                      style={{
                        background: active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.05)",
                        color: active ? (cat === "All" ? "#FFE500" : color) : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {countByCategory(cat)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ClipReveal>

        {/* Results meta */}
        <Reveal className="mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
            {isSearching
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
              : `${activeCategory} — ${filtered.length} command${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </Reveal>

        <DrawLine />

        {/* Command grid */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((cmd, i) => (
                    <CommandCard key={cmd.cmd} cmd={cmd} index={i} />
                  ))}
                </div>
              ) : (
                <div
                  className="py-24 text-center rounded-xl font-mono text-xs"
                  style={{
                    border: "1px dashed rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  No commands match "{search}"
                </div>
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
          <h2
            className="font-display font-bold text-white mb-8"
            style={{ fontSize: "clamp(26px, 4vw, 48px)" }}
          >
            <SplitReveal text="Ready to start using Directioner?" delay={0.04} />
          </h2>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="/register"
              className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-8 py-4"
              style={{ background: "#FFE500", color: "#000" }}
            >
              Add to Discord — Free
            </a>
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
}
