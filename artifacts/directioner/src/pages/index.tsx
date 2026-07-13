import { useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { 
  OscilloscopeWave, 
  Typewriter, 
  StaggeredGrid, 
  BlueprintBackground, 
  DrawOnPath,
  FloatingParticles 
} from "@/components/animations";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ArrowRight, Mic, MessageSquare, Database, Sparkles } from "lucide-react";

import heroBlueprintSrc from "@/assets/hero-blueprint.png";
import memoryNodesSrc from "@/assets/memory-nodes.png";
import developerSrc from "@/assets/developer.png";

export default function Home() {
  usePageTitle("Production-Grade AI for Discord");
  const [selectedMode, setSelectedMode] = useState("/chat");

  const modes = [
    { cmd: "/chat", desc: "Default conversational AI" },
    { cmd: "/tutor", desc: "Educational mode, patient explanations" },
    { cmd: "/coder", desc: "Development mode, code-focused" },
    { cmd: "/chaos", desc: "Unpredictable chaotic AI (fun)" },
    { cmd: "/creative", desc: "Creative writing and brainstorming" },
    { cmd: "/debate", desc: "Devil's advocate mode" }
  ];

  return (
    <div className="overflow-hidden bg-background">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-32 pb-16">
        <FloatingParticles />
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <OscilloscopeWave color="hsl(var(--primary))" amplitude={60} frequency={3} speed={3} className="h-full scale-150" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center md:text-left">
          <div className="font-mono text-xs tracking-widest text-muted-foreground mb-8">
            <Typewriter text="// DISCORD BOT ————————————————————— V1.0.0" />
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] mb-8">
            <span className="text-primary block mb-2">Directioner.</span>
            Production-grade<br/>AI for Discord.
          </h1>
          
          <div className="font-mono text-sm border-l-2 border-primary pl-4 mb-12 py-1 max-w-2xl mx-auto md:mx-0 text-left">
            <Typewriter speed={10} prefix="> " text="AVAILABLE FOR DISCORD SERVERS." />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
            <Link href="/register" className="bg-primary text-black font-mono font-bold px-8 py-4 uppercase text-sm corner-brackets hover:bg-white transition-colors inline-flex items-center justify-center gap-2">
              ADD TO DISCORD ↗
            </Link>
            <Link href="/features" className="bg-transparent border border-border text-foreground hover:bg-white hover:text-black font-mono font-bold px-8 py-4 uppercase text-sm transition-colors inline-flex items-center justify-center">
              EXPLORE FEATURES
            </Link>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <div className="border-y border-border bg-card relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          <div className="p-8 text-center md:text-left">
            <div className="text-3xl md:text-4xl font-display font-black mb-2 text-white">
              <CountUpNumber target={3000} suffix="+" />
            </div>
            <div className="font-mono text-xs text-muted-foreground uppercase">SERVERS</div>
          </div>
          <div className="p-8 text-center md:text-left">
            <div className="text-3xl md:text-4xl font-display font-black mb-2 text-white">
              <CountUpNumber target={1200000} />
            </div>
            <div className="font-mono text-xs text-muted-foreground uppercase">MESSAGES PROCESSED</div>
          </div>
          <div className="p-8 text-center md:text-left">
            <div className="text-3xl md:text-4xl font-display font-black mb-2 text-white">
              99.9%
            </div>
            <div className="font-mono text-xs text-muted-foreground uppercase">UPTIME</div>
          </div>
          <div className="p-8 text-center md:text-left">
            <div className="text-3xl md:text-4xl font-display font-black mb-2 text-white">
              <CountUpNumber target={200} prefix="<" suffix="ms" />
            </div>
            <div className="font-mono text-xs text-muted-foreground uppercase">LATENCY</div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="border-b border-border bg-black py-3 overflow-hidden flex">
        <div className="flex whitespace-nowrap animate-ticker font-mono text-xs text-primary uppercase font-bold tracking-widest gap-8">
          <span>VOICE AI · MEMORY SYSTEM · MULTI-MODE · CODE ASSISTANT · 99.9% UPTIME · &lt;200ms LATENCY · MIT LICENSE · </span>
          <span>VOICE AI · MEMORY SYSTEM · MULTI-MODE · CODE ASSISTANT · 99.9% UPTIME · &lt;200ms LATENCY · MIT LICENSE · </span>
          <span>VOICE AI · MEMORY SYSTEM · MULTI-MODE · CODE ASSISTANT · 99.9% UPTIME · &lt;200ms LATENCY · MIT LICENSE · </span>
          <span>VOICE AI · MEMORY SYSTEM · MULTI-MODE · CODE ASSISTANT · 99.9% UPTIME · &lt;200ms LATENCY · MIT LICENSE · </span>
        </div>
      </div>

      {/* [01] CORE FEATURES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <SectionLabel number="01" name="CORE FEATURES" />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Mic, title: "Voice AI", desc: "Native voice channel integration with sub-second latency." },
              { icon: MessageSquare, title: "Text Intelligence", desc: "Context-aware responses across multiple channels." },
              { icon: Database, title: "Persistent Memory", desc: "Vector-based memory nodes for long-term recall." },
              { icon: Sparkles, title: "Multi-Mode", desc: "Switch personas instantly from tutor to chaos." }
            ].map((f, i) => (
              <div key={i} className="p-6 border border-border bg-card hover:border-primary/50 transition-colors">
                <f.icon className="text-primary mb-4" size={24} />
                <h4 className="font-mono text-sm font-bold uppercase mb-2 text-white">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
          
          <BlueprintBackground className="aspect-square flex items-center justify-center relative border border-border">
            <img src={heroBlueprintSrc} alt="Architecture" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
            <div className="absolute top-4 right-4 font-mono text-xs text-primary bg-black/80 px-2 py-1 border border-primary/30">FIG.01 // ARCHITECTURE</div>
            
            <div className="relative z-10 w-full max-w-sm border border-primary/30 p-6 bg-black/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white">DISCORD GATEWAY</span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="space-y-4 font-mono text-xs text-muted-foreground">
                <div className="flex justify-between items-center p-2 border border-white/5 bg-white/5"><span>Event Ingestion</span> <span className="text-primary">OK</span></div>
                <div className="flex justify-between items-center p-2 border border-white/5 bg-white/5"><span>Context Assembly</span> <span className="text-primary">OK</span></div>
                <div className="flex justify-between items-center p-2 border border-white/5 bg-white/5"><span>LLM Inference</span> <span className="text-primary">OK</span></div>
                <div className="flex justify-between items-center p-2 border border-white/5 bg-white/5"><span>Action Dispatch</span> <span className="text-primary">OK</span></div>
              </div>
            </div>
          </BlueprintBackground>
        </div>
      </section>

      {/* [02] MEMORY SYSTEM */}
      <section className="py-32 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="02" name="MEMORY SYSTEM" />
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <BlueprintBackground className="aspect-square relative border border-border order-2 lg:order-1">
              <img src={memoryNodesSrc} alt="Memory Nodes" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
              <div className="absolute top-4 left-4 font-mono text-xs text-primary bg-black/80 px-2 py-1 border border-primary/30">FIG.02 // VECTOR_DB</div>
              
              <DrawOnPath className="absolute inset-0 flex items-center justify-center z-10">
                <svg viewBox="0 0 100 100" className="w-full h-full text-primary opacity-50 p-12">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M50 10 L50 30 M50 70 L50 90 M10 50 L30 50 M70 50 L90 50" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                  <circle cx="50" cy="10" r="2" fill="currentColor" />
                  <circle cx="50" cy="90" r="2" fill="currentColor" />
                  <circle cx="10" cy="50" r="2" fill="currentColor" />
                  <circle cx="90" cy="50" r="2" fill="currentColor" />
                </svg>
              </DrawOnPath>
            </BlueprintBackground>
            
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Remember everything.<br/>Forget nothing.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">Directioner builds a vector-based graph of your community over time. It learns who people are, what they care about, and references past conversations naturally.</p>
              <p className="text-muted-foreground text-lg leading-relaxed">Most bots suffer from amnesia after 50 messages. We utilize semantic search to recall relevant context from months ago, injecting it directly into the current prompt.</p>
              <p className="text-muted-foreground text-lg leading-relaxed">You have full control over what is stored, with commands to selectively forget or wipe context entirely.</p>
              
              <ul className="space-y-4 pt-6">
                {[
                  "Cross-session memory recall",
                  "Per-user preference mapping",
                  "Automated thread summarization"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-mono text-sm text-white">
                    <span className="text-accent">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* [03] INTERACTION MODES */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="03" name="INTERACTION MODES" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-16 text-center max-w-2xl mx-auto">Change personality at the speed of thought.</h2>
          
          <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {modes.map((mode) => (
              <div 
                key={mode.cmd}
                onMouseEnter={() => setSelectedMode(mode.cmd)}
                className={`p-6 border bg-card cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedMode === mode.cmd 
                    ? "border-primary shadow-[0_0_15px_rgba(255,229,0,0.1)]" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-mono text-lg font-bold text-primary mb-2">{mode.cmd}</div>
                <div className="text-sm text-muted-foreground">{mode.desc}</div>
              </div>
            ))}
          </StaggeredGrid>

          <BlueprintBackground className="max-w-3xl mx-auto border border-border p-8 text-center">
            <div className="font-mono text-sm text-primary mb-2">FIG.03 // TERMINAL</div>
            <div className="text-2xl md:text-3xl font-mono text-white">
              <Typewriter key={selectedMode} text={`> /chatmode ${selectedMode.replace('/', '')}`} speed={30} />
            </div>
          </BlueprintBackground>
        </div>
      </section>

      {/* [04] PRICING PREVIEW */}
      <section className="py-32 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="04" name="PRICING" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: "Free", price: "0", features: ["500 credits/mo", "Text only", "50 Memory nodes"] },
              { name: "Basic", price: "4.99", features: ["5,000 credits/mo", "Voice (60min/day)", "500 Memory nodes"] },
              { name: "Pro", price: "14.99", popular: true, features: ["25,000 credits/mo", "Unlimited Voice", "5,000 Memory nodes"] },
              { name: "Max", price: "39.99", features: ["Unlimited credits", "API Access", "White-label"] }
            ].map((t) => (
              <div key={t.name} className={`relative flex flex-col bg-background border ${t.popular ? 'border-primary' : 'border-border'} p-8 hover:-translate-y-2 transition-transform duration-300`}>
                {t.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black font-mono text-[10px] font-bold px-3 py-1 uppercase border border-black">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold uppercase mb-2 text-white">{t.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-display font-black text-white">${t.price}</span>
                  <span className="text-muted-foreground font-mono text-xs">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {t.features.map(f => (
                    <li key={f} className="text-sm text-muted-foreground flex items-center gap-2 before:content-['✓'] before:text-accent before:font-mono">{f}</li>
                  ))}
                </ul>
                <Link href="/pricing" className={`w-full text-center font-mono text-xs font-bold uppercase py-3 transition-colors ${
                  t.popular ? "bg-primary text-black corner-brackets hover:bg-white" : "border border-border text-white hover:bg-white hover:text-black"
                }`}>
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/pricing" className="font-mono text-sm text-primary uppercase hover:underline">
              VIEW ALL FEATURES →
            </Link>
          </div>
        </div>
      </section>

      {/* [05] HOW IT WORKS */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="05" name="HOW IT WORKS" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-16">Zero friction deployment.</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* DrawOnPath Connectors (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-[2px] -translate-y-1/2 z-0">
              <DrawOnPath className="w-full h-full">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
                </svg>
              </DrawOnPath>
            </div>

            {[
              { num: "01", title: "Add Bot", desc: "Authorize Directioner in your server with one click." },
              { num: "02", title: "Configure", desc: "Use the dashboard or /setup to adjust personality and channels." },
              { num: "03", title: "Start Chatting", desc: "Mention the bot or use slash commands to begin." }
            ].map((step, i) => (
              <div key={i} className="bg-blueprint border border-white/10 p-8 relative z-10">
                <div className="text-5xl font-display font-black text-primary/20 absolute top-4 right-4">{step.num}</div>
                <div className="font-mono text-2xl font-bold text-primary mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-blueprint-foreground opacity-80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* [06] THE CREATOR */}
      <section className="py-32 px-6 border-t border-border bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2">
              <div className="aspect-square w-full max-w-sm mx-auto border border-primary p-2 relative">
                <div className="absolute -top-3 -left-3 corner-brackets text-primary w-full h-full" />
                <img src={developerSrc} alt="Aditya Munday" className="w-full h-full object-cover grayscale contrast-125" />
                <div className="absolute bottom-4 right-4 font-mono text-[10px] bg-black/80 text-primary px-2 py-1">FIG.06</div>
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-6">
              <SectionLabel number="06" name="THE CREATOR" />
              <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase">Built by<br/><span className="text-primary">Aditya Munday</span></h2>
              <div className="font-mono text-xs text-muted-foreground uppercase">// FOUNDER & LEAD ENGINEER</div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Directioner was built out of necessity. After moderating massive communities and wrestling with generic, amnesiac chatbots, I needed a tool that felt alive. Something that could handle code reviews, host trivia, and remember inside jokes—all with zero latency.
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                {["TypeScript", "Discord.js", "OpenAI", "Vector DB"].map(t => (
                  <span key={t} className="px-3 py-1 border border-border font-mono text-[10px] uppercase text-white bg-background">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* [07] TESTIMONIALS */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="07" name="TESTIMONIALS" />
          
          <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {[
              { q: "Directioner coordinates our raids so we don't have to.", u: "@GamingKing_X", s: "Gaming Hub" },
              { q: "The tutor mode helped our whole server pass finals week.", u: "@StudyPro", s: "CS 101 Group" },
              { q: "Like having a senior dev in the channel 24/7.", u: "@CodeNinja", s: "DevCommunity" },
              { q: "We use /chaos mode on Friday nights. Hilarious.", u: "@FridayCrew", s: "The Lounge" },
              { q: "Scaled our 10k server without hiring more mods.", u: "@ServerAdmin", s: "Anime Central" },
              { q: "New member retention went from 30% to 70%.", u: "@CommunityMgr", s: "Creator Space" }
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border p-8 hover:border-primary/30 transition-colors relative">
                <div className="text-4xl font-display font-black text-primary/20 absolute top-4 left-6">"</div>
                <p className="font-mono text-sm leading-relaxed text-white relative z-10 mb-6 mt-4">
                  {t.q}
                </p>
                <div className="flex justify-between items-end">
                  <div className="font-bold text-sm text-primary">{t.u}</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase">{t.s}</div>
                </div>
              </div>
            ))}
          </StaggeredGrid>

          {/* Trust Bar */}
          <div className="text-center border-t border-border pt-16">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-8">
              TRUSTED BY COMMUNITIES ON
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 font-mono font-bold text-xl md:text-2xl text-white/30 uppercase">
              <span>DISCORD</span>
              <span>GITHUB</span>
              <span>OPENAI</span>
              <span>LINEAR</span>
              <span>FIGMA</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6 border-t border-border hatch-pattern relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-background/80 p-16 border border-border backdrop-blur-sm">
          <h2 className="text-5xl md:text-7xl font-display font-black mb-8 uppercase text-white">Wake up your server.</h2>
          <Link href="/register" className="bg-primary text-black font-mono font-bold px-12 py-6 uppercase text-lg corner-brackets hover:bg-white transition-colors inline-block">
            ADD TO DISCORD ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
