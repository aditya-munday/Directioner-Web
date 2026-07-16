import { useState, useRef } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BookOpen, Terminal, Brain, Zap, Mic, MessageSquare,
  Database, Code2, GraduationCap, Users, Globe2, Target,
  Shield, ChevronRight, Search, ArrowUpRight, Check,
  Gamepad2, PenLine, Calendar, Star, Lightbulb, Settings2,
  Music, BarChart2, Hash, Lock, RefreshCw, Volume2, History,
  Languages, Activity, HelpCircle, Cpu, Bot, Sparkles, Eye,
} from "lucide-react";
import { PageHero, DrawLine, Reveal, SplitReveal } from "@/components/ui/motion-primitives";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const CORE_EXPERIENCE = [
  { label: "Natural conversations", detail: "Human-like, context-aware dialogue that flows naturally across multi-turn sessions without losing thread.", icon: MessageSquare, color: "#FFE500" },
  { label: "Voice and text interaction", detail: "Full support for both real-time voice responses in voice channels and text-based conversations in any text channel.", icon: Mic, color: "#0ea5e9" },
  { label: "Context-aware replies", detail: "Directioner reads the full thread context — up to 32k tokens — to provide replies that are coherent, relevant, and helpful.", icon: Brain, color: "#a855f7" },
  { label: "Real-time responses", detail: "Optimized inference pipeline delivers replies in under 400ms for text and under 200ms audio latency for voice.", icon: Zap, color: "#FFE500" },
  { label: "Multi-user conversations", detail: "Tracks multiple participants simultaneously in the same channel, maintaining separate context threads per user.", icon: Users, color: "#10b981" },
  { label: "Server-aware sessions", detail: "Each session is scoped to your Discord server — the bot understands your server's culture, channels, and member dynamics.", icon: Shield, color: "#6366f1" },
  { label: "Private conversations", detail: "Use /private mode for ephemeral, DM-only responses that aren't visible to other channel members.", icon: Lock, color: "#f43f5e" },
  { label: "Persistent memory", detail: "Long-term vector database stores user preferences, facts, and conversation history across every session indefinitely.", icon: Database, color: "#a855f7" },
  { label: "Instant interruption support", detail: "Mid-speech interruption detection allows users to redirect the bot's response without waiting for it to finish.", icon: Activity, color: "#0ea5e9" },
  { label: "High-quality speech output", detail: "State-of-the-art TTS with multiple voice models, adjustable speed, and expressive intonation to match conversation tone.", icon: Volume2, color: "#FFE500" },
  { label: "Multilingual support", detail: "Understands and responds in 20+ languages including English, Spanish, French, German, Japanese, Chinese, Hindi, and more.", icon: Globe2, color: "#10b981" },
  { label: "Smart conversation summaries", detail: "Automatically generates concise summaries of long discussions, meetings, or study sessions on demand or on a schedule.", icon: BookOpen, color: "#6366f1" },
];

const AI_PERSONALITIES = [
  { name: "Default Assistant", cmd: "/assistant", desc: "General-purpose AI companion. Helpful, balanced, and conversational for any topic or question.", category: "General", color: "#FFE500" },
  { name: "Mentor", cmd: "/mentor", desc: "A seasoned guide that offers wisdom, encouragement, and structured advice for personal and professional growth.", category: "Learning", color: "#10b981" },
  { name: "Interviewer", cmd: "/interviewer", desc: "Conducts realistic mock interviews with tailored questions, follow-ups, and detailed feedback on your answers.", category: "Career", color: "#6366f1" },
  { name: "Teacher", cmd: "/teacher", desc: "Patient, structured educator that breaks down complex topics into digestible lessons with examples and exercises.", category: "Learning", color: "#10b981" },
  { name: "Tutor", cmd: "/tutor", desc: "Adaptive one-on-one tutor for any subject. Adjusts depth and pace to match your current understanding level.", category: "Learning", color: "#10b981" },
  { name: "Programmer", cmd: "/coder", desc: "Expert coder across 15+ languages. Writes, reviews, debugs, and explains code with syntax-highlighted output.", category: "Technical", color: "#FFE500" },
  { name: "Software Architect", cmd: "/architect", desc: "Designs system architecture, reviews tech stacks, and advises on scalability patterns and best practices.", category: "Technical", color: "#FFE500" },
  { name: "Debugger", cmd: "/debug", desc: "Specialized in finding and fixing bugs. Analyzes stack traces, error messages, and logic flaws systematically.", category: "Technical", color: "#f43f5e" },
  { name: "Code Reviewer", cmd: "/review", desc: "Performs thorough code reviews focusing on correctness, performance, security, and maintainability.", category: "Technical", color: "#FFE500" },
  { name: "Mathematician", cmd: "/math", desc: "Solves problems across algebra, calculus, statistics, and discrete math with step-by-step explanations.", category: "Academic", color: "#a855f7" },
  { name: "Quant Research Mentor", cmd: "/quant", desc: "Guides quantitative finance concepts: derivatives, risk models, portfolio theory, and algorithmic strategies.", category: "Academic", color: "#a855f7" },
  { name: "Data Scientist", cmd: "/data", desc: "Helps with data analysis, visualization, ML model selection, feature engineering, and statistical interpretation.", category: "Technical", color: "#0ea5e9" },
  { name: "Cybersecurity Expert", cmd: "/security", desc: "Advises on threat modeling, vulnerability assessment, penetration testing concepts, and secure coding practices.", category: "Technical", color: "#f43f5e" },
  { name: "DevOps Engineer", cmd: "/devops", desc: "Covers CI/CD pipelines, containerization, infrastructure-as-code, monitoring, and deployment strategies.", category: "Technical", color: "#0ea5e9" },
  { name: "Product Manager", cmd: "/pm", desc: "Helps prioritize features, write PRDs, analyze user feedback, and structure product roadmaps.", category: "Business", color: "#6366f1" },
  { name: "Startup Advisor", cmd: "/startup", desc: "Shares actionable advice on fundraising, product-market fit, team building, and growth strategy.", category: "Business", color: "#6366f1" },
  { name: "Business Consultant", cmd: "/consult", desc: "Analyzes business models, competitive landscapes, and operational inefficiencies with structured frameworks.", category: "Business", color: "#6366f1" },
  { name: "Marketing Specialist", cmd: "/marketing", desc: "Creates campaigns, copy, and growth strategies. Covers SEO, content, paid channels, and brand positioning.", category: "Business", color: "#FFE500" },
  { name: "Sales Coach", cmd: "/sales", desc: "Trains objection handling, pitch delivery, negotiation techniques, and consultative selling approaches.", category: "Business", color: "#10b981" },
  { name: "Language Tutor", cmd: "/language", desc: "Teaches any language through conversation, grammar drills, vocabulary building, and cultural context.", category: "Learning", color: "#10b981" },
  { name: "Travel Planner", cmd: "/travel", desc: "Plans itineraries, recommends destinations, provides visa info, and offers local tips for any trip.", category: "Lifestyle", color: "#0ea5e9" },
  { name: "Fitness Coach", cmd: "/fitness", desc: "Designs workout plans, tracks progress, and gives nutrition guidance tailored to your goals.", category: "Lifestyle", color: "#f43f5e" },
  { name: "Chef", cmd: "/chef", desc: "Suggests recipes based on available ingredients, dietary restrictions, and cuisine preferences.", category: "Lifestyle", color: "#FFE500" },
  { name: "Creative Writer", cmd: "/creative", desc: "Crafts stories, scripts, poems, and creative content with rich world-building and compelling narratives.", category: "Creative", color: "#a855f7" },
  { name: "Storyteller", cmd: "/story", desc: "Delivers immersive, interactive narratives that adapt based on your choices and preferences.", category: "Creative", color: "#a855f7" },
  { name: "Dungeon Master", cmd: "/dm", desc: "Runs tabletop RPG campaigns with detailed world-building, NPC dialogue, and dynamic plot generation.", category: "Creative", color: "#f43f5e" },
  { name: "Debate Partner", cmd: "/debate", desc: "Takes opposing stances, argues rigorously, and challenges assumptions to sharpen your reasoning.", category: "Learning", color: "#6366f1" },
  { name: "Research Assistant", cmd: "/research", desc: "Synthesizes information, identifies sources, summarizes papers, and structures findings clearly.", category: "Academic", color: "#a855f7" },
  { name: "Exam Coach", cmd: "/exam", desc: "Prepares you for exams with practice questions, mock tests, spaced repetition, and performance analysis.", category: "Learning", color: "#10b981" },
  { name: "Interview Coach", cmd: "/interview", desc: "Prepares for behavioral, technical, and case interviews with personalized coaching and feedback.", category: "Career", color: "#6366f1" },
  { name: "Career Advisor", cmd: "/career", desc: "Guides career pivots, resume improvement, networking strategies, and professional brand development.", category: "Career", color: "#6366f1" },
];

const SLASH_COMMANDS = [
  { cmd: "/mentor", desc: "Switch to Mentor personality", usage: "/mentor", category: "PERSONALITIES", detail: "Activates the Mentor AI personality — structured advice, encouragement, and wisdom for personal and professional goals." },
  { cmd: "/interviewer", desc: "Mock interview mode", usage: "/interviewer [role]", category: "PERSONALITIES", detail: "Starts a realistic mock interview session for the specified role. Provides real questions, follow-ups, and detailed feedback." },
  { cmd: "/teacher", desc: "Structured teaching mode", usage: "/teacher [subject]", category: "PERSONALITIES", detail: "Switches to Teacher mode for the given subject. Delivers structured lessons with examples and comprehension checks." },
  { cmd: "/assistant", desc: "Default general-purpose AI", usage: "/assistant", category: "PERSONALITIES", detail: "Resets to the Default Assistant personality. Balanced, helpful, and conversational for any topic." },
  { cmd: "/coder", desc: "Programming-focused mode", usage: "/coder [language?]", category: "PERSONALITIES", detail: "Activates the Programmer personality. Optimized for writing, reviewing, and explaining code across 15+ languages." },
  { cmd: "/architect", desc: "System design mode", usage: "/architect", category: "PERSONALITIES", detail: "Enables the Software Architect personality for system design discussions, tech stack advice, and architecture patterns." },
  { cmd: "/review", desc: "Code review mode", usage: "/review", category: "PERSONALITIES", detail: "Switches to Code Reviewer mode. Analyzes code for correctness, performance, security, and readability." },
  { cmd: "/math", desc: "Mathematics mode", usage: "/math [topic?]", category: "PERSONALITIES", detail: "Activates Mathematician mode for algebra, calculus, statistics, and discrete math with step-by-step solutions." },
  { cmd: "/quant", desc: "Quantitative finance mode", usage: "/quant", category: "PERSONALITIES", detail: "Enables Quant Research Mentor personality for derivatives, risk models, portfolio theory, and financial algorithms." },
  { cmd: "/translate", desc: "Real-time translation", usage: "/translate [text] [target-lang]", category: "UTILITIES", detail: "Translates any text into the specified target language. Supports 20+ languages with natural phrasing." },
  { cmd: "/summarize", desc: "Summarize the conversation", usage: "/summarize [length?]", category: "UTILITIES", detail: "Generates a concise summary of the current conversation thread. Optionally specify short, medium, or detailed." },
  { cmd: "/explain", desc: "Explain a concept", usage: "/explain [topic] [level?]", category: "UTILITIES", detail: "Explains any concept at the specified level: beginner, intermediate, or advanced." },
  { cmd: "/brainstorm", desc: "Brainstorming session", usage: "/brainstorm [topic]", category: "UTILITIES", detail: "Generates a structured list of creative ideas, angles, or solutions for the given topic." },
  { cmd: "/mode", desc: "Show current AI mode", usage: "/mode", category: "CONTROL", detail: "Displays the currently active AI personality and any custom instructions applied to the session." },
  { cmd: "/private", desc: "Enable private mode", usage: "/private [on|off]", category: "CONTROL", detail: "Toggles private (ephemeral) mode — responses are only visible to you and are not stored in channel history." },
  { cmd: "/public", desc: "Switch back to public mode", usage: "/public", category: "CONTROL", detail: "Returns the bot to public mode where responses are visible to all channel members." },
  { cmd: "/history", desc: "View conversation history", usage: "/history [count?]", category: "MEMORY", detail: "Displays the recent conversation history for the current session. Specify count to limit the entries shown." },
  { cmd: "/clear", desc: "Clear conversation context", usage: "/clear", category: "MEMORY", detail: "Clears the current conversation context window while preserving long-term memory nodes." },
  { cmd: "/reset", desc: "Full session reset", usage: "/reset [scope?]", category: "MEMORY", detail: "Resets the session to defaults. Specify scope: context (default), memory, or all." },
  { cmd: "/join", desc: "Join a voice channel", usage: "/join [channel?]", category: "VOICE", detail: "Directs the bot to join your current voice channel or a specified one. Begins voice interaction mode." },
  { cmd: "/leave", desc: "Leave voice channel", usage: "/leave", category: "VOICE", detail: "Disconnects the bot from the current voice channel and ends the active voice session." },
  { cmd: "/stop", desc: "Stop current voice output", usage: "/stop", category: "VOICE", detail: "Immediately stops the bot's current voice output. Useful for interrupting long responses." },
  { cmd: "/status", desc: "Show bot status", usage: "/status", category: "ADMIN", detail: "Displays real-time bot status including uptime, active sessions, memory usage, and API health." },
  { cmd: "/stats", desc: "Usage statistics", usage: "/stats [period?]", category: "ADMIN", detail: "Shows server usage statistics: messages processed, voice minutes used, commands run, and credits consumed." },
  { cmd: "/language", desc: "Set response language", usage: "/language [code]", category: "CONTROL", detail: "Sets the bot's response language using ISO language codes (e.g. en, es, fr, de, ja, zh, hi)." },
  { cmd: "/voice", desc: "Select voice model", usage: "/voice [model]", category: "VOICE", detail: "Switches the TTS voice model. Available models vary by plan: standard, enhanced, and neural voices." },
  { cmd: "/memory", desc: "View or manage memories", usage: "/memory [list|clear|search]", category: "MEMORY", detail: "Manages your memory nodes. List all memories, clear specific ones, or search across stored facts." },
  { cmd: "/stream", desc: "Toggle streaming responses", usage: "/stream [on|off]", category: "CONTROL", detail: "Enables or disables streaming mode where responses appear word-by-word as they are generated." },
  { cmd: "/ping", desc: "Check bot latency", usage: "/ping", category: "ADMIN", detail: "Returns the current bot round-trip latency to Discord's API servers and Directioner's inference endpoint." },
  { cmd: "/help", desc: "Get help on any command", usage: "/help [command?]", category: "ADMIN", detail: "Displays the help documentation for a specific command or shows all available commands when used alone." },
];

const HIGHLIGHTS = [
  { label: "Learns conversation context", desc: "Builds a rich contextual model of your server's conversations over time, becoming more relevant and accurate with every interaction.", icon: Brain, color: "#FFE500" },
  { label: "Adapts tone automatically", desc: "Detects the tone of each channel and message — formal, casual, playful, technical — and adjusts its communication style to match.", icon: Sparkles, color: "#a855f7" },
  { label: "Designed for communities", desc: "Built from the ground up for Discord servers of all sizes — from small study groups to massive gaming communities with tens of thousands of members.", icon: Users, color: "#10b981" },
  { label: "Built for creators", desc: "Supports creative workflows including world-building, storytelling, scriptwriting, brainstorming, and collaborative content creation.", icon: PenLine, color: "#6366f1" },
  { label: "Supports study groups", desc: "Ideal for academic Discord servers — group tutoring sessions, shared homework help, exam prep, and collaborative note-taking.", icon: GraduationCap, color: "#10b981" },
  { label: "Ideal for coding servers", desc: "First-class developer experience with code blocks, syntax highlighting, GitHub integration, and a bot that understands your stack.", icon: Code2, color: "#FFE500" },
  { label: "Useful for gaming communities", desc: "Enhances gaming servers with lore assistance, strategy coaching, build recommendations, and entertaining personality modes.", icon: Gamepad2, color: "#f43f5e" },
  { label: "Professional collaboration", desc: "Keeps distributed teams aligned with meeting summaries, decision logs, action item tracking, and async thread digests.", icon: Calendar, color: "#0ea5e9" },
  { label: "Friendly onboarding", desc: "Greets new members, answers questions about your server, explains rules, and helps newcomers get started without manual intervention.", icon: Star, color: "#FFE500" },
  { label: "Low-latency interaction", desc: "Engineered for real-time conversations — sub-400ms text responses and sub-200ms audio latency ensure seamless, natural exchanges.", icon: Zap, color: "#FFE500" },
  { label: "Rich personality system", desc: "30+ distinct AI personalities, each deeply specialized, making Directioner feel like having an expert teammate in every area.", icon: Bot, color: "#a855f7" },
  { label: "Always improving", desc: "Continuous model updates, community-driven feature requests, and an evolving prompt system mean Directioner gets better every week.", icon: RefreshCw, color: "#10b981" },
];

const FEATURES_DETAIL = [
  {
    num: "01", name: "VOICE ENGINE", icon: Mic, color: "#0ea5e9",
    headline: "Voice Conversations",
    desc: "Real-time, ultra-low latency voice responses directly in any Discord voice channel.",
    bullets: [
      "< 200ms audio latency end-to-end",
      "Multi-speaker recognition — tracks up to 8 voices simultaneously",
      "Noise cancellation built-in for clear communication",
      "Wake word activation — mention the bot by name or custom wake word",
      "Auto-join / auto-leave voice channels on member activity",
      "Adjustable voice model and speaking speed",
      "Push-to-talk and always-on listening modes",
      "Instant interruption — redirect mid-speech without waiting",
    ],
  },
  {
    num: "02", name: "TEXT INTELLIGENCE", icon: MessageSquare, color: "#FFE500",
    headline: "Text Intelligence",
    desc: "Understands thread context, replies naturally, and maintains conversational flow across all languages.",
    bullets: [
      "Thread context up to 32k tokens — never loses the plot",
      "Natural conversational flow — no robotic response patterns",
      "20+ languages supported with auto-detection",
      "Tone detection and automatic style matching",
      "Thread summarization — catch up on long discussions instantly",
      "Emoji and meme fluency for casual community interactions",
      "Markdown formatting with headers, lists, and code blocks",
      "DM forwarding for long responses that would clutter channels",
    ],
  },
  {
    num: "03", name: "MEMORY SYSTEM", icon: Database, color: "#a855f7",
    headline: "Memory System",
    desc: "Long-term vector database remembers user preferences, facts, and past conversations forever.",
    bullets: [
      "Vector database storage with semantic search",
      "Cross-session memory recall — persists indefinitely",
      "Per-user preference learning and personalization",
      "5,000 memory nodes on Pro, unlimited on Max",
      "User scope, server scope, and global scope memory",
      "Manual memory management via /memory commands",
      "Memory export and import for server migrations",
      "Automatic deduplication and relevance ranking",
    ],
  },
  {
    num: "04", name: "CODE & DEVELOPMENT", icon: Code2, color: "#FFE500",
    headline: "Coding Help",
    desc: "Your AI pair programmer — code review, generation, debugging, and architecture advice in Discord.",
    bullets: [
      "15+ programming languages with syntax highlighting",
      "Full code review with correctness, performance, and security checks",
      "Bug detection, root cause analysis, and fix suggestions",
      "Code generation from natural language descriptions",
      "GitHub Gist integration for sharing code snippets",
      "Algorithm complexity analysis (Big O notation)",
      "Architecture diagrams and system design guidance",
      "Test case generation and coverage suggestions",
    ],
  },
  {
    num: "05", name: "LEARNING & EDUCATION", icon: GraduationCap, color: "#10b981",
    headline: "Learning & Education",
    desc: "Adaptive tutor mode with quiz generation, flashcards, and source citations for any subject.",
    bullets: [
      "30+ academic subjects from math to literature",
      "Adaptive explanation depth matching your skill level",
      "Quiz mode with instant grading and explanations",
      "Flashcard generation for spaced repetition",
      "Source citations and reference suggestions",
      "Homework assistance across all grade levels",
      "Exam preparation with practice tests and analytics",
      "Study group coordination and shared note generation",
    ],
  },
  {
    num: "06", name: "WRITING TOOLS", icon: PenLine, color: "#6366f1",
    headline: "Writing Tools",
    desc: "Drafting, editing, creative writing — from essays to screenplays, with tone and style adjustment.",
    bullets: [
      "Essay drafting and structural editing",
      "Creative fiction, worldbuilding, and narrative design",
      "Tone and style adjustment (academic, casual, persuasive)",
      "Grammar, clarity, and conciseness improvements",
      "Content outlining and argument structuring",
      "Copywriting for marketing, ads, and social media",
      "Script and dialogue writing for video and podcasts",
      "Plagiarism avoidance and paraphrasing tools",
    ],
  },
  {
    num: "07", name: "PLANNING & PRODUCTIVITY", icon: Calendar, color: "#FFE500",
    headline: "Planning & Productivity",
    desc: "Async-native team coordination — task management, meeting summaries, and deadline tracking.",
    bullets: [
      "Task list management with priority tagging",
      "Meeting summary generation from voice transcripts",
      "Project breakdown into actionable milestones",
      "Deadline tracking with gentle channel reminders",
      "Daily standup facilitation and notes capture",
      "Action item extraction and assignment suggestions",
      "Decision logging for asynchronous team alignment",
      "Cross-timezone scheduling assistance",
    ],
  },
  {
    num: "08", name: "COMMUNITY TYPES", icon: Users, color: "#f43f5e",
    headline: "Community Types",
    desc: "Adapts to the specific needs and culture of any server — gaming, study, creative, business, and beyond.",
    bullets: [
      "Gaming communities — strategy, lore, build coaching",
      "Study groups — tutoring, exam prep, shared notes",
      "Developer servers — code help, architecture, debugging",
      "Creative communities — writing, art, music, storytelling",
      "Business teams — async coordination, meeting notes",
      "Anime, book club, investment, cooking, travel servers",
      "Fan communities — trivia, deep lore, character roleplay",
      "Language learning servers — immersive conversation practice",
    ],
  },
  {
    num: "09", name: "ENTERTAINMENT", icon: Gamepad2, color: "#FFE500",
    headline: "Entertainment",
    desc: "Keep the server engaged with interactive games, roleplay, trivia, and curated recommendations.",
    bullets: [
      "Trivia games with live scoring and leaderboards",
      "Interactive storytelling with branching narratives",
      "Character roleplay with persistent personalities",
      "Movie and music recommendations tailored to the server",
      "Joke modes, puns, and comedic personas",
      "D&D and tabletop RPG Dungeon Master mode",
      "Word games, riddles, and puzzle generation",
      "Weekly recap and highlight reel generation",
    ],
  },
  {
    num: "10", name: "ADAPTABLE COMMUNICATION", icon: Globe2, color: "#0ea5e9",
    headline: "Adaptable Communication",
    desc: "Automatically adjusts to match the channel, user, and cultural context — always appropriate.",
    bullets: [
      "Formal / casual tone switching per channel",
      "Language auto-detection and seamless switching",
      "Age-appropriate response filtering",
      "Cultural sensitivity and localization awareness",
      "Emoji and meme fluency for Gen-Z communities",
      "NSFW filtering with configurable content policies",
      "Accessibility-friendly plain language mode",
      "Response length adjustment (short / medium / long)",
    ],
  },
  {
    num: "11", name: "HABIT BUILDING", icon: Target, color: "#10b981",
    headline: "Habit Building",
    desc: "Personalized tracking, streak visibility, and gentle accountability for daily goals.",
    bullets: [
      "Daily check-in reminders at custom times",
      "Streak tracking with public accountability posts",
      "Goal setting, weekly review, and progress reports",
      "Accountability partner pairing for group challenges",
      "Habit visualization with progress summaries",
      "Custom reminder messages and motivational quotes",
      "Integration with server channels for public commitment",
      "Monthly performance reports and trend analysis",
    ],
  },
  {
    num: "12", name: "TEAM COLLABORATION", icon: Users, color: "#a855f7",
    headline: "Team Collaboration",
    desc: "The async AI teammate that captures decisions and keeps distributed teams aligned.",
    bullets: [
      "Meeting notes generation from voice or text discussions",
      "Action item extraction and automatic tracking",
      "Decision logging with context and rationale capture",
      "Async thread summaries for time-zone distributed teams",
      "Cross-channel context linking for related discussions",
      "Sprint summary and retrospective facilitation",
      "Knowledge base building from channel discussions",
      "Onboarding documentation generation for new members",
    ],
  },
];

const PERSONALITY_CATEGORIES = ["All", "General", "Technical", "Learning", "Academic", "Business", "Career", "Creative", "Lifestyle"];
const CMD_CATEGORIES = ["All", "PERSONALITIES", "UTILITIES", "CONTROL", "MEMORY", "VOICE", "ADMIN"];

/* ─── Tab config ─────────────────────────────────────────────────────────── */

const TABS = [
  { id: "overview",       label: "Overview",         icon: BookOpen  },
  { id: "personalities",  label: "AI Personalities", icon: Bot       },
  { id: "commands",       label: "Slash Commands",   icon: Terminal  },
  { id: "features",       label: "All Features",     icon: Sparkles  },
  { id: "highlights",     label: "Highlights",       icon: Star      },
  { id: "getting-started", label: "Getting Started", icon: Zap       },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Tag({ children, color = "#FFE500" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {children}
    </span>
  );
}

function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "rgba(255,229,0,0.12)", border: "1px solid rgba(255,229,0,0.25)" }}>
        <Check size={9} className="text-primary" strokeWidth={3} />
      </div>
      <span className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{text}</span>
    </div>
  );
}

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Tab content ────────────────────────────────────────────────────────── */

function OverviewTab() {
  return (
    <div className="space-y-20">
      {/* Intro */}
      <FadeIn>
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            // ABOUT DIRECTIONER
          </p>
          <h2 className="font-display font-bold text-white text-4xl md:text-5xl tracking-tight leading-[0.92] mb-6">
            The AI companion<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>built for Discord.</span>
          </h2>
          <p className="font-mono text-sm leading-loose" style={{ color: "rgba(255,255,255,0.45)" }}>
            Directioner is a next-generation Discord AI companion built for communities, gaming, studying, coding,
            business, entertainment, moderation, and productivity. It delivers fast, natural conversations across
            text and voice while adapting to every member's unique needs — from a casual gaming server to a
            professional dev team's workspace.
          </p>
        </div>
      </FadeIn>

      <DrawLine />

      {/* Core Experience */}
      <div>
        <FadeIn>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>01</p>
          <h3 className="font-display font-bold text-white text-3xl mb-10 tracking-tight">Core Experience</h3>
        </FadeIn>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CORE_EXPERIENCE.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.04}>
              <div
                className="p-5 h-full flex flex-col gap-3 group cursor-default transition-all duration-300"
                style={{
                  background: "#0e0e11",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${item.color}30`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={14} style={{ color: item.color }} />
                  <span className="font-mono text-[11px] font-bold" style={{ color: item.color }}>
                    {item.label}
                  </span>
                </div>
                <p className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {item.detail}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <DrawLine />

      {/* Stats */}
      <div>
        <FadeIn>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>02</p>
          <h3 className="font-display font-bold text-white text-3xl mb-10 tracking-tight">By the Numbers</h3>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: "3,000+", label: "Discord servers" },
            { val: "30+",    label: "AI personalities" },
            { val: "29+",    label: "Slash commands" },
            { val: "20+",    label: "Languages supported" },
            { val: "99.9%",  label: "Uptime SLA" },
            { val: "<200ms", label: "Voice latency" },
            { val: "32k",    label: "Context window tokens" },
            { val: "5,000",  label: "Memory nodes (Pro)" },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.05}>
              <div className="p-6" style={{ background: "#0e0e11", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="font-display font-bold text-white text-3xl tracking-tight">{s.val}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonalitiesTab() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = AI_PERSONALITIES.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.cmd.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            31 Distinct Personalities
          </p>
          <h2 className="font-display font-bold text-white text-4xl tracking-tight leading-[0.92] mb-4">AI Personalities</h2>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Each personality is deeply specialized with its own system prompt, communication style, and domain expertise.
            Switch between them instantly with a single slash command.
          </p>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="text"
              placeholder="Search personalities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 font-mono text-xs w-full sm:w-64 outline-none"
              style={{
                background: "#0e0e11",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="font-mono text-[10px] uppercase tracking-wide px-3 py-2 transition-all duration-200"
                style={{
                  background: activeCategory === cat ? "#FFE500" : "transparent",
                  color: activeCategory === cat ? "#000" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${activeCategory === cat ? "#FFE500" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 flex flex-col gap-3 group"
              style={{ background: "#0e0e11", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-bold text-white text-base mb-1">{p.name}</div>
                  <code className="font-mono text-[11px] font-bold" style={{ color: p.color }}>{p.cmd}</code>
                </div>
                <Tag color={p.color}>{p.category}</Tag>
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 font-mono text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          No personalities match "{search}"
        </div>
      )}
    </div>
  );
}

function CommandsTab() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = SLASH_COMMANDS.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = !search || c.cmd.includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const CAT_COLORS: Record<string, string> = {
    "PERSONALITIES": "#FFE500",
    "UTILITIES": "#10b981",
    "CONTROL": "#6366f1",
    "MEMORY": "#a855f7",
    "VOICE": "#0ea5e9",
    "ADMIN": "#f43f5e",
  };

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            30 Commands · 6 Categories
          </p>
          <h2 className="font-display font-bold text-white text-4xl tracking-tight leading-[0.92] mb-4">Slash Commands</h2>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Every slash command available in Directioner, organized by category. Click any command to see full
            documentation including usage syntax and detailed description.
          </p>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 font-mono text-xs w-full sm:w-64 outline-none"
              style={{ background: "#0e0e11", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CMD_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="font-mono text-[10px] uppercase tracking-wide px-3 py-2 transition-all duration-200"
                style={{
                  background: activeCategory === cat ? (CAT_COLORS[cat] ?? "#FFE500") : "transparent",
                  color: activeCategory === cat ? "#000" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${activeCategory === cat ? (CAT_COLORS[cat] ?? "#FFE500") : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Command list */}
      <div className="space-y-1">
        {filtered.map((cmd, i) => (
          <motion.div
            key={cmd.cmd}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.02 }}
          >
            <button
              className="w-full text-left transition-all duration-200 group"
              onClick={() => setExpanded(expanded === cmd.cmd ? null : cmd.cmd)}
              style={{
                background: expanded === cmd.cmd ? "#0e0e11" : "transparent",
                border: `1px solid ${expanded === cmd.cmd ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <code
                  className="font-mono text-sm font-bold w-36 shrink-0"
                  style={{ color: CAT_COLORS[cmd.category] ?? "#FFE500" }}
                >
                  {cmd.cmd}
                </code>
                <span className="font-mono text-xs flex-1" style={{ color: "rgba(255,255,255,0.5)" }}>{cmd.desc}</span>
                <Tag color={CAT_COLORS[cmd.category] ?? "#FFE500"}>{cmd.category}</Tag>
                <ChevronRight
                  size={13}
                  className="shrink-0 transition-transform duration-200"
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    transform: expanded === cmd.cmd ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            </button>
            <AnimatePresence>
              {expanded === cmd.cmd && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-5 border-x border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0d" }}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Description</p>
                        <p className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{cmd.detail}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Usage</p>
                        <code className="font-mono text-sm px-3 py-2 block" style={{ background: "#141418", color: "#FFE500", border: "1px solid rgba(255,229,0,0.15)" }}>
                          {cmd.usage}
                        </code>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 font-mono text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          No commands match "{search}"
        </div>
      )}
    </div>
  );
}

function FeaturesTab() {
  const [activeFeature, setActiveFeature] = useState(0);
  const feat = FEATURES_DETAIL[activeFeature];

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            12 Core Modules
          </p>
          <h2 className="font-display font-bold text-white text-4xl tracking-tight leading-[0.92] mb-4">All Features</h2>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Comprehensive documentation for every feature module. Select a module to see the full capability breakdown.
          </p>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {FEATURES_DETAIL.map((f, i) => (
            <button
              key={f.num}
              onClick={() => setActiveFeature(i)}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 group"
              style={{
                background: activeFeature === i ? "#0e0e11" : "transparent",
                border: `1px solid ${activeFeature === i ? `${f.color}30` : "transparent"}`,
              }}
            >
              <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{f.num}</span>
              <f.icon size={13} style={{ color: activeFeature === i ? f.color : "rgba(255,255,255,0.3)" }} />
              <span
                className="font-mono text-[11px] uppercase tracking-wide"
                style={{ color: activeFeature === i ? "#fff" : "rgba(255,255,255,0.4)" }}
              >
                {f.name}
              </span>
            </button>
          ))}
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feat.num}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-8"
            style={{ background: "#0e0e11", border: `1px solid ${feat.color}20` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>{feat.num}</span>
              <div className="h-px w-4" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: feat.color }}>{feat.name}</span>
            </div>
            <h3 className="font-display font-bold text-white text-3xl tracking-tight mb-3">{feat.headline}</h3>
            <p className="font-mono text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>{feat.desc}</p>

            <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              Full Capability List
            </p>
            <div>
              {feat.bullets.map(b => <CheckRow key={b} text={b} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function HighlightsTab() {
  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            12 Key Differentiators
          </p>
          <h2 className="font-display font-bold text-white text-4xl tracking-tight leading-[0.92] mb-4">Highlights</h2>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            The defining characteristics that set Directioner apart from every other Discord bot.
          </p>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-4">
        {HIGHLIGHTS.map((h, i) => (
          <FadeIn key={h.label} delay={i * 0.05}>
            <div
              className="p-6 flex gap-5 h-full"
              style={{ background: "#0e0e11", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-10 h-10 shrink-0 flex items-center justify-center"
                style={{ background: `${h.color}12`, border: `1px solid ${h.color}25` }}>
                <h.icon size={16} style={{ color: h.color }} />
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-white mb-2">{h.label}</div>
                <p className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{h.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function GettingStartedTab() {
  const steps = [
    {
      num: "01",
      title: "Add to Discord",
      desc: "Click the 'Add to Discord' button and authorize Directioner on your server. Select the channels it should have access to.",
      code: null,
      notes: ["Requires Manage Server permission", "Takes less than 60 seconds", "No credit card required for Free plan"],
    },
    {
      num: "02",
      title: "Run Setup Wizard",
      desc: "Type /setup in any channel to run the interactive configuration wizard. Choose your default AI personality, response language, and active channels.",
      code: "/setup",
      notes: ["Requires Administrator permission", "Sets default personality and language", "Configures channel access permissions"],
    },
    {
      num: "03",
      title: "Configure Permissions",
      desc: "Use /permissions to verify the bot has the correct Discord permissions. The wizard will guide you through fixing any missing permissions.",
      code: "/permissions",
      notes: ["Read Messages, Send Messages (required)", "Connect, Speak (required for voice)", "Manage Messages (optional — for whisper mode)"],
    },
    {
      num: "04",
      title: "Choose a Personality",
      desc: "Switch the bot's personality to match your server's needs. Use /mode to check the current setting, or pick one of the 30+ personalities with a slash command.",
      code: "/mentor\n/coder\n/assistant",
      notes: ["Personalities can differ per channel", "Server admins can lock a personality", "Users can override in private mode"],
    },
    {
      num: "05",
      title: "Enable Voice (Optional)",
      desc: "Join a voice channel and use /join to invite the bot. It will start listening immediately and respond to voice input.",
      code: "/join\n/voice neural-1\n/stop",
      notes: ["Bot must have Connect and Speak permissions", "Works in any standard voice channel", "Stage channels require additional setup"],
    },
    {
      num: "06",
      title: "Configure Memory",
      desc: "Directioner automatically builds memory from conversations. Use /memory list to see what it has learned, or /remember to manually add important facts.",
      code: "/memory list\n/remember Our server focuses on Python and ML\n/forget [memory-id]",
      notes: ["Memory is per-user and per-server scoped", "5,000 nodes on Pro, unlimited on Max", "Memory export available in dashboard"],
    },
  ];

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            Setup in under 5 minutes
          </p>
          <h2 className="font-display font-bold text-white text-4xl tracking-tight leading-[0.92] mb-4">Getting Started</h2>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            From zero to a fully configured AI companion in your Discord server. Follow these steps in order.
          </p>
        </div>
      </FadeIn>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <FadeIn key={step.num} delay={i * 0.07}>
            <div className="grid lg:grid-cols-[1fr_1fr] gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Left */}
              <div className="p-7" style={{ background: "#0e0e11" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.2)" }}>{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{step.title}</h3>
                <p className="font-mono text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>{step.desc}</p>
                <div className="space-y-2">
                  {step.notes.map(note => (
                    <div key={note} className="flex items-start gap-2">
                      <span className="font-mono text-[10px] mt-0.5" style={{ color: "#FFE500" }}>—</span>
                      <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right — code block */}
              <div className="p-7 flex items-center" style={{ background: "#090910", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                {step.code ? (
                  <div className="w-full">
                    <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>// Command</p>
                    <pre
                      className="font-mono text-sm p-4 overflow-x-auto"
                      style={{ background: "#0d0d14", border: "1px solid rgba(255,229,0,0.12)", color: "#FFE500", lineHeight: 1.8 }}
                    >
                      {step.code}
                    </pre>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <div
                      className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-6 py-3"
                      style={{ background: "#FFE500", color: "#000" }}
                    >
                      Add to Discord
                      <ArrowUpRight size={14} />
                    </div>
                    <p className="font-mono text-[10px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
                      discord.com/oauth2/authorize
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Use cases quick nav */}
      <DrawLine />
      <FadeIn>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
            Common server types
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Gaming Server", cmds: "/chatmode, /story, /dm", icon: Gamepad2 },
              { label: "Dev Community", cmds: "/coder, /architect, /review", icon: Code2 },
              { label: "Study Group",   cmds: "/tutor, /math, /exam", icon: GraduationCap },
              { label: "Business Team", cmds: "/pm, /consult, /summarize", icon: BarChart2 },
            ].map((s, i) => (
              <div key={s.label} className="p-4" style={{ background: "#0e0e11", border: "1px solid rgba(255,255,255,0.06)" }}>
                <s.icon size={16} className="mb-2" style={{ color: "#FFE500" }} />
                <div className="font-mono text-xs font-bold text-white mb-1">{s.label}</div>
                <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{s.cmds}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Docs() {
  usePageTitle("Documentation");
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":       return <OverviewTab />;
      case "personalities":  return <PersonalitiesTab />;
      case "commands":       return <CommandsTab />;
      case "features":       return <FeaturesTab />;
      case "highlights":     return <HighlightsTab />;
      case "getting-started": return <GettingStartedTab />;
      default:               return <OverviewTab />;
    }
  };

  return (
    <div style={{ background: "#070708", minHeight: "100vh" }}>
      <PageHero
        eyebrow="Documentation — Complete Reference"
        heading="Docs."
        sub="Everything about Directioner — features, personalities, commands, and setup guides in one place."
      />

      {/* Sticky tab bar */}
      <div
        className="sticky top-14 z-40 border-b"
        style={{ background: "rgba(7,7,8,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-4 font-mono text-[11px] uppercase tracking-wide whitespace-nowrap border-b-2 transition-all duration-200"
                style={{
                  borderColor: activeTab === tab.id ? "#FFE500" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.38)",
                }}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
