import { usePageTitle } from "@/hooks/use-page-title";
import { 
  OscilloscopeWave, 
  Typewriter, 
  BlueprintBackground, 
  BlueprintScanLine 
} from "@/components/animations";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { motion } from "framer-motion";

import voiceWaveSrc from "@/assets/voice-wave.png";
import codeTerminalSrc from "@/assets/code-terminal.png";
import memoryNodesSrc from "@/assets/memory-nodes.png";
import aiBrainSrc from "@/assets/ai-brain.png";
import communitySrc from "@/assets/community.png";

export default function Features() {
  usePageTitle("Features");

  const sections = [
    { 
      num: "01", name: "VOICE", title: "Voice Conversations", 
      desc: "Real-time, ultra-low latency voice responses directly in any Discord voice channel.", 
      image: voiceWaveSrc,
      features: [
        "< 200ms audio latency",
        "Multi-speaker recognition",
        "Noise cancellation",
        "Wake word activation ('Hey Directioner')",
        "Auto-join/leave channels"
      ] 
    },
    { 
      num: "02", name: "TEXT", title: "Text Intelligence", 
      desc: "Understands thread context, replies naturally, and maintains conversational flow.", 
      image: codeTerminalSrc,
      features: [
        "Thread context awareness (up to 32k tokens)",
        "Natural conversational flow",
        "20+ languages supported",
        "Tone detection and matching",
        "Thread summarization"
      ] 
    },
    { 
      num: "03", name: "MEMORY", title: "Memory System", 
      desc: "Long-term vector database remembers user preferences and past chats.", 
      image: memoryNodesSrc,
      features: [
        "Vector database storage",
        "Cross-session memory recall",
        "Per-user preference learning",
        "5,000 memory nodes on Pro tier",
        "Memory scope: user / server / global"
      ] 
    },
    { 
      num: "04", name: "CODE", title: "Coding Help", 
      desc: "Syntax highlighting, code review, and generation for 15+ programming languages.", 
      image: codeTerminalSrc,
      features: [
        "15+ programming languages",
        "Syntax highlighting in Discord",
        "Code review and suggestions",
        "Bug detection and fixes",
        "GitHub Gist integration"
      ] 
    },
    { 
      num: "05", name: "LEARN", title: "Learning & Education", 
      desc: "Tutor mode adapts explanations for 30+ academic subjects.", 
      image: aiBrainSrc,
      features: [
        "30+ academic subjects",
        "Adaptive explanation depth",
        "Quiz and flashcard mode",
        "Source citations",
        "Homework assistance"
      ] 
    },
    { 
      num: "06", name: "WRITE", title: "Writing Tools", 
      desc: "Drafting, editing, and creative writing assistance on demand.", 
      image: aiBrainSrc,
      features: [
        "Essay drafting and editing",
        "Creative fiction writing",
        "Tone and style adjustment",
        "Grammar and clarity fixes",
        "Content outlining"
      ] 
    },
    { 
      num: "07", name: "PLAN", title: "Planning & Productivity", 
      desc: "Organize tasks, summarize meetings, and track project deadlines directly in Discord.", 
      image: codeTerminalSrc,
      features: [
        "Task list management",
        "Meeting summary generation",
        "Project breakdown",
        "Deadline tracking",
        "Daily standups"
      ] 
    },
    { 
      num: "08", name: "COMMUNITY", title: "Community Types", 
      desc: "Adapts to the specific needs and culture of any server type.", 
      image: communitySrc,
      features: [
        "Gaming · Study · Developer",
        "Creative · Music · Sports",
        "Anime · Book Club · Investment",
        "Cooking · Travel · Language",
        "Business · Fan Clubs"
      ] 
    },
    { 
      num: "09", name: "FUN", title: "Entertainment", 
      desc: "Keep the server engaged with interactive games, roleplay, and media recommendations.", 
      image: communitySrc,
      features: [
        "Trivia games with scoring",
        "Interactive storytelling",
        "Joke mode",
        "Movie/music recommendations",
        "Character roleplay"
      ] 
    },
    { 
      num: "10", name: "ADAPT", title: "Adaptable Communication", 
      desc: "Automatically adjusts its tone to match the channel, user, or situation.", 
      image: aiBrainSrc,
      features: [
        "Formal/casual toggle",
        "Language auto-detection",
        "Age-appropriate responses",
        "Cultural sensitivity",
        "Emoji/meme fluency"
      ] 
    },
    { 
      num: "11", name: "HABIT", title: "Habit Building", 
      desc: "Personalized tracking and gentle reminders for daily goals.", 
      image: memoryNodesSrc,
      features: [
        "Daily check-in reminders",
        "Streak tracking",
        "Goal setting and review",
        "Accountability partners",
        "Progress visualization"
      ] 
    },
    { 
      num: "12", name: "TEAM", title: "Team Collaboration", 
      desc: "The async AI teammate that captures decisions and keeps everyone aligned.", 
      image: codeTerminalSrc,
      features: [
        "Meeting notes generation",
        "Action item tracking",
        "Decision logging",
        "Async thread summaries",
        "Cross-channel context"
      ] 
    }
  ];

  return (
    <div className="pb-32 bg-background overflow-hidden">
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-20 border-b border-border">
        <div className="absolute inset-0 z-0 opacity-30 origin-center rotate-90 scale-150">
          <OscilloscopeWave color="hsl(160 100% 48%)" amplitude={80} speed={4} className="h-full" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 uppercase text-white">Capabilities.</h1>
          <div className="font-mono text-sm text-primary border border-primary bg-primary/10 inline-block px-4 py-2 shadow-[0_0_15px_rgba(255,229,0,0.1)]">
            <Typewriter speed={15} prefix="> " text="12 MODULES ONLINE AND FUNCTIONING." />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32 py-32">
        {sections.map((sec, i) => (
          <motion.div 
            key={sec.num}
            whileInView={{ opacity: 1, y: 0 }} 
            initial={{ opacity: 0, y: 40 }} 
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
              <div className="flex-1 space-y-6">
                <SectionLabel number={sec.num} name={sec.name} />
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white">{sec.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{sec.desc}</p>
                <ul className="space-y-3 pt-4">
                  {sec.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="text-accent mt-1 font-mono">✓</span>
                      <span className="text-sm text-white font-mono">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <BlueprintBackground className="aspect-video relative overflow-hidden border border-border">
                  <img src={sec.image} alt={sec.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                  <div className="absolute top-3 right-3 font-mono text-xs text-primary bg-black/80 px-2 py-1 border border-primary/30 z-20">
                    FIG.{sec.num} // {sec.name}
                  </div>
                  <BlueprintScanLine />
                </BlueprintBackground>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
