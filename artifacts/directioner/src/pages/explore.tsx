import { usePageTitle } from "@/hooks/use-page-title";
import { Typewriter, StaggeredGrid } from "@/components/animations";
import { Link } from "wouter";

export default function Explore() {
  usePageTitle("Explore");

  const capabilities = [
    { 
      cat: "Ask Anything", 
      items: [
        "What's the best strategy for Valorant ranked?", 
        "Can you explain quantum entanglement simply?", 
        "Help me write a cover letter for a software engineer role.",
        "What should I cook for dinner with chicken and rice?",
        "Explain the difference between TCP and UDP.",
        "What are the best sci-fi books from 2024?",
        "How do I start a Discord server for my community?",
        "Debug this Python code for me...",
        "What's causing inflation right now?",
        "Teach me 5 Spanish phrases for travel.",
        "Write a poem about programming.",
        "What's a good workout routine for beginners?",
        "Explain machine learning to a 10-year-old.",
        "What's the history of the samurai?",
        "Help me plan a trip to Japan.",
        "What are some good budget tips for students?"
      ] 
    },
    { 
      cat: "Decision Helper", 
      items: [
        "Should I use React or Vue?", 
        "Should I start a YouTube channel?", 
        "Should I adopt a dog?",
        "What game should we play tonight?"
      ] 
    },
    { 
      cat: "New Interests", 
      items: ["Music Production", "Photography", "Machine Learning", "Hiking", "Chess", "Cooking"] 
    },
    { 
      cat: "Habit Building", 
      items: ["Morning Routine", "Reading Goal", "Exercise Streak", "Learning Daily"] 
    },
    { 
      cat: "Team Collaboration", 
      items: ["Daily Standup", "Meeting Notes", "Decision Log"] 
    },
    { 
      cat: "Entertainment Hub", 
      items: ["Trivia Challenge", "Story Mode", "Movie Night", "Music Quiz"] 
    }
  ];

  return (
    <div className="pt-32 pb-32 bg-background overflow-hidden">
      <div className="text-center mb-24 px-6 relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase mb-6 text-white">
          One Bot.<br/><span className="text-primary">Infinite Possibilities.</span>
        </h1>
        <div className="font-mono text-sm text-primary border border-primary bg-primary/10 inline-block px-4 py-2 mt-4 shadow-[0_0_15px_rgba(255,229,0,0.1)]">
          <Typewriter speed={15} prefix="> " text="CAPABILITY DIRECTORY // 8 SECTIONS" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* [01] ASK ANYTHING */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary text-black flex items-center justify-center font-mono font-bold text-xs">01</div>
            <h2 className="font-display text-2xl font-bold uppercase text-white">ASK ANYTHING</h2>
          </div>
          <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities[0].items.map((item, i) => (
              <div key={i} className="bg-card border border-border p-6 hover:border-primary/50 transition-colors group cursor-default">
                <p className="font-mono text-sm text-muted-foreground group-hover:text-white transition-colors">"{item}"</p>
              </div>
            ))}
          </StaggeredGrid>
        </section>

        {/* [02] - [06] OTHER CATEGORIES */}
        <section className="grid lg:grid-cols-2 gap-16 border-t border-border pt-16">
          {capabilities.slice(1).map((cat, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-primary/20 text-primary border border-primary flex items-center justify-center font-mono font-bold text-[10px]">0{idx+2}</div>
                <h2 className="font-display text-xl font-bold uppercase text-white">{cat.cat}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cat.items.map((item, j) => (
                  <div key={j} className="bg-background border border-border p-4 hover:border-primary/30 transition-colors">
                    <p className="font-mono text-xs text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* [07] FUTURE OF COMMUNITY */}
        <section className="border-t border-border pt-24 text-center max-w-4xl mx-auto">
          <div className="font-mono text-sm text-primary mb-6 uppercase tracking-widest border border-primary px-3 py-1 inline-block">07 // The Future</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase text-white mb-6 leading-tight">
            AI isn't replacing communities. It's giving them superpowers.
          </h2>
          <p className="text-lg text-muted-foreground font-mono leading-relaxed">
            The era of dead servers and overworked moderators is ending. Directioner is the bridge between human connection and machine intelligence, enabling communities of any size to thrive 24/7.
          </p>
        </section>

        {/* [08] GET STARTED CTA */}
        <section className="pt-16 pb-8 text-center">
          <Link href="/register" className="bg-primary text-black font-mono font-bold px-12 py-6 uppercase text-lg corner-brackets hover:bg-white transition-colors inline-block shadow-[0_0_30px_rgba(255,229,0,0.2)]">
            Deploy Now ↗
          </Link>
        </section>

      </div>
    </div>
  );
}
