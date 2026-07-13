import { usePageTitle } from "@/hooks/use-page-title";
import { Gamepad2, GraduationCap, Code2, Sparkles, Globe2, Users, PartyPopper, HandHeart, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function UseCases() {
  usePageTitle("Use Cases");

  const cases = [
    { 
      icon: <Gamepad2 size={48} />, title: "GAMERS", 
      desc: "Level up your gaming server with AI strategy tips, game lore, tournament management, and 24/7 engagement.", 
      features: ["Game knowledge base", "Tournament brackets", "Lore questions", "Strategy coaching", "Player stats"],
      quote: "Our 5000-member gaming server hasn't been this active since launch day.",
      author: "@GamingKing_X"
    },
    { 
      icon: <GraduationCap size={48} />, title: "STUDENTS", 
      desc: "Transform your study server into a 24/7 tutoring hub with personalized explanations.", 
      features: ["30+ subjects", "Homework help", "Quiz mode", "Study schedules", "Exam prep"],
      quote: "Finals week survival mode activated. Directioner helped our whole server pass.",
      author: "@StudyHub"
    },
    { 
      icon: <Code2 size={48} />, title: "DEVELOPERS", 
      desc: "Your AI pair programmer, always available in your dev server.", 
      features: ["Code review", "Bug debugging", "Architecture discussions", "Documentation help", "15+ languages"],
      quote: "Replaced half our Stack Overflow visits. It just knows the answer.",
      author: "@DevCommunity"
    },
    { 
      icon: <Sparkles size={48} />, title: "CONTENT CREATORS", 
      desc: "Brainstorm ideas, write scripts, and generate creative content on demand.", 
      features: ["Script writing", "Caption generation", "Content calendar", "Trend analysis", "Repurposing ideas"],
      quote: "My content pipeline went from weekly to daily with Directioner's help.",
      author: "@ContentCreator"
    },
    { 
      icon: <Globe2 size={48} />, title: "COMMUNITIES", 
      desc: "Scale community management without burning out your mods.", 
      features: ["FAQ auto-response", "Onboarding new members", "Community summaries", "Conflict de-escalation"],
      quote: "Went from 3 mods drowning to 1 mod thriving. Game changer.",
      author: "@CommunityMgr"
    },
    { 
      icon: <Users size={48} />, title: "FRIEND GROUPS", 
      desc: "The AI friend that never sleeps, always has a take, and never judges your questions.", 
      features: ["Trivia nights", "Movie suggestions", "Recipe ideas", "Debate partner", "Daily jokes"],
      quote: "We use /chaos mode on Friday nights. Cannot recommend enough.",
      author: "@FriendGroup"
    },
    { 
      icon: <PartyPopper size={48} />, title: "EVENTS", 
      desc: "AI-powered event coordination from announcement to recap.", 
      features: ["Event scheduling", "RSVP tracking", "Hype messages", "Live updates", "Post-event summary"],
      quote: "Our community events doubled in attendance since adding Directioner.",
      author: "@EventManager"
    },
    { 
      icon: <HandHeart size={48} />, title: "NEW MEMBERS", 
      desc: "Instant, personalized onboarding for every new server member.", 
      features: ["Welcome messages", "Rule explanations", "Channel guidance", "FAQ answering", "Personality detection"],
      quote: "New member retention went from 30% to 70% in one month.",
      author: "@ServerOwner"
    },
    { 
      icon: <Rocket size={48} />, title: "TEAMS", 
      desc: "Your async AI teammate — captures decisions, tracks tasks, keeps everyone aligned.", 
      features: ["Meeting notes", "Action items", "Decision logging", "Daily standups", "Cross-timezone summaries"],
      quote: "Remote team of 12 spread across 5 timezones. Directioner keeps us sane.",
      author: "@StartupFounder"
    }
  ];

  return (
    <div className="pt-32 pb-32 overflow-hidden bg-background">
      <div className="text-center mb-32 px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase mb-6 text-white">Use Cases.</h1>
        <p className="font-mono text-primary border border-primary bg-primary/10 inline-block px-4 py-2 uppercase text-sm font-bold shadow-[0_0_15px_rgba(255,229,0,0.1)]">Deployable across infinite topologies.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {cases.map((c, i) => (
          <motion.div 
            key={i} 
            whileInView={{ opacity: 1, y: 0 }} 
            initial={{ opacity: 0, y: 40 }} 
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}
          >
            <div className="flex-1 space-y-8">
              <div className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 border border-primary px-2 py-1 inline-block">
                0{i+1} // {c.title}
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase text-white">{c.title}</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">{c.desc}</p>
              
              <ul className="space-y-2">
                {c.features.map(f => (
                  <li key={f} className="font-mono text-sm text-white flex items-center gap-2">
                    <span className="text-accent">✓</span> {f}
                  </li>
                ))}
              </ul>

              <div className="border-l-2 border-primary pl-6 py-2 mt-8 bg-card border-y border-r border-y-border border-r-border p-4">
                <p className="font-mono text-sm italic text-white mb-2">"{c.quote}"</p>
                <p className="font-mono text-[10px] text-primary uppercase">— {c.author}</p>
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center py-12 md:py-0">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-8 rounded-full border border-accent/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                <div className="absolute inset-16 rounded-full border border-primary/40 border-dashed animate-spin" style={{ animationDuration: '30s' }} />
                <div className="text-primary opacity-80 filter drop-shadow-[0_0_10px_rgba(255,229,0,0.5)]">
                  {c.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
