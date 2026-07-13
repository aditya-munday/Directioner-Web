import { usePageTitle } from "@/hooks/use-page-title";
import { OscilloscopeWave, BlueprintBackground, Typewriter } from "@/components/animations";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { Github, Twitter, MessageSquare } from "lucide-react";

import aiBrainSrc from "@/assets/ai-brain.png";
import developerSrc from "@/assets/developer.png";

export default function About() {
  usePageTitle("About");

  const techStack = [
    { name: "Discord.js v14", desc: "Real-time Discord API gateway" },
    { name: "Node.js 20", desc: "Non-blocking event loop runtime" },
    { name: "OpenAI API", desc: "GPT-4o language model integration" },
    { name: "PostgreSQL 16", desc: "Primary relational database" },
    { name: "Redis 7", desc: "Cache layer and session store" },
    { name: "TypeScript 5", desc: "Full type-safe codebase" },
    { name: "WebSockets", desc: "Real-time bidirectional communication" },
    { name: "WebRTC", desc: "Native voice channel streaming" }
  ];

  return (
    <div className="bg-background overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 text-center border-b border-border">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <OscilloscopeWave color="hsl(var(--primary))" amplitude={40} speed={5} className="h-full scale-150" />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase mb-6 text-white">Origin Story.</h1>
          <div className="font-mono text-sm text-muted-foreground border border-border inline-block px-4 py-2 bg-card">
            <Typewriter speed={15} prefix="> " text="SYSTEM INITIALIZATION SEQUENCE" />
          </div>
        </div>
      </section>

      {/* [01] THE STORY */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-border">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <SectionLabel number="01" name="THE STORY" />
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>Discord is where the internet lives. 500M registered users, millions of active servers, and yet — managing, engaging, and enriching those communities has always been a human-only, exhausting endeavor.</p>
              <p>Directioner was born from frustration. Our gaming server was growing fast, but keeping members engaged, answering repetitive questions, and maintaining personality 24/7 was impossible.</p>
              <p>We didn't want another command bot. We wanted something that felt like a real community member — something that remembered you, understood context, had personality, and could switch from helping with homework to hosting trivia to debugging code, all in the same server.</p>
            </div>
          </div>
          <BlueprintBackground className="aspect-square relative border border-border">
            <img src={aiBrainSrc} alt="AI Brain" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
            <div className="absolute top-4 right-4 font-mono text-xs text-primary bg-black/80 px-2 py-1 border border-primary/30">FIG.01 // CORE_LOGIC</div>
          </BlueprintBackground>
        </div>
      </section>

      {/* [02] VISION PILLARS */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-border">
        <SectionLabel number="02" name="VISION PILLARS" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Privacy First", desc: "Memory data is siloed per server. Never sold or shared." },
            { title: "Developer Native", desc: "Built by a developer, for developers. Extensible and transparent." },
            { title: "Community Focused", desc: "Adapts to any community type — gaming, study, creative." },
            { title: "Production Grade", desc: "99.9% uptime SLA. Handles millions of messages with low latency." }
          ].map((p, i) => (
            <div key={i} className="bg-card border border-border p-8 hover:border-primary/50 transition-colors">
              <div className="font-mono text-xl font-bold text-primary mb-4">0{i+1}.</div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* [03] CREATOR */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-border bg-card">
        <div className="grid md:grid-cols-5 gap-16 items-center max-w-5xl mx-auto">
          <div className="md:col-span-2 flex justify-center">
            <div className="aspect-square w-64 border-2 border-primary p-2 relative">
              <div className="absolute -inset-2 border border-primary/30" />
              <img src={developerSrc} alt="Aditya Munday" className="w-full h-full object-cover grayscale contrast-125" />
            </div>
          </div>
          <div className="md:col-span-3 space-y-6">
            <SectionLabel number="03" name="THE CREATOR" />
            <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase">Aditya Munday</h2>
            <div className="font-mono text-sm text-primary uppercase border border-primary/30 bg-primary/10 inline-block px-3 py-1">
              // FOUNDER & LEAD ENGINEER
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Directioner is designed, engineered, and maintained as a solo pursuit of building the ultimate Discord companion. Every feature, from the vector database architecture to the real-time voice synthesis pipeline, was hand-coded with an obsession for performance and developer experience.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="p-3 border border-border bg-background hover:border-primary text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="p-3 border border-border bg-background hover:border-primary text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="p-3 border border-border bg-background hover:border-primary text-white transition-colors"><MessageSquare size={20} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* [04] TECH STACK */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-border">
        <SectionLabel number="04" name="TECH STACK" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map(tech => (
            <div key={tech.name} className="border border-border bg-card p-6 hover:border-primary/50 transition-colors group">
              <div className="font-mono text-sm font-bold text-white uppercase mb-2 group-hover:text-primary transition-colors">{tech.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{tech.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* [05] ROADMAP */}
      <section className="py-24 px-6 max-w-3xl mx-auto border-b border-border">
        <SectionLabel number="05" name="ROADMAP" />
        <div className="space-y-8 mt-12 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {[
            { q: "Q1 2025", title: "Beta Launch", desc: "Core text AI, basic memory", status: "done" },
            { q: "Q2 2025", title: "Voice Integration", desc: "Real-time voice in channels", status: "done" },
            { q: "Q3 2025", title: "Multi-Mode", desc: "/tutor /coder /chaos /creative", status: "done" },
            { q: "Q4 2025", title: "Analytics Dashboard", desc: "Usage tracking and web portal", status: "done" },
            { q: "Q1 2026", title: "V1.0 Production", desc: "Stable release, SLAs", status: "current" },
            { q: "Q2 2026", title: "API Access", desc: "Third-party integrations", status: "upcoming" },
            { q: "Q3 2026", title: "White-label", desc: "Custom bot deployments", status: "upcoming" }
          ].map((r, i) => (
            <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card absolute left-0 md:left-1/2 -translate-x-1/2 z-10 group-hover:border-primary transition-colors">
                {r.status === 'done' && <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                {r.status === 'current' && <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />}
                {r.status === 'upcoming' && <div className="w-2 h-2 rounded-full border border-muted-foreground" />}
              </div>
              <div className="w-full md:w-5/12 pl-12 md:pl-0 md:group-odd:pr-12 md:group-even:pl-12">
                <div className={`p-6 border ${r.status === 'current' ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-mono text-xs font-bold ${r.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`}>{r.q}</span>
                    {r.status === 'current' && <span className="bg-primary text-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase">Current</span>}
                    {r.status === 'upcoming' && <span className="border border-border px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-foreground">Upcoming</span>}
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-1 uppercase">{r.title}</h4>
                  <p className="font-mono text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* [06] LEGAL */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <SectionLabel number="06" name="LICENSE & LEGAL" />
        
        <div className="bg-card border border-border p-8 mb-8 overflow-x-auto">
          <div className="font-mono text-sm text-primary mb-4 font-bold">MIT License</div>
          <pre className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
{`Copyright (c) 2025 Directioner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border bg-card p-6">
            <h3 className="font-mono text-sm font-bold text-white uppercase mb-2">Privacy Policy</h3>
            <p className="text-sm text-muted-foreground mb-4">We do not sell data to third parties. Memory vectors are strictly siloed per server. You own your community's data.</p>
            <a href="#" className="font-mono text-xs text-primary uppercase hover:underline">Read Full Policy →</a>
          </div>
          <div className="border border-border bg-card p-6">
            <h3 className="font-mono text-sm font-bold text-white uppercase mb-2">Terms of Use</h3>
            <p className="text-sm text-muted-foreground mb-4">Usage is subject to fair use limits. API abuse will result in termination. Uptime SLAs apply to Pro/Max only.</p>
            <a href="#" className="font-mono text-xs text-primary uppercase hover:underline">Read Full Terms →</a>
          </div>
        </div>
      </section>
    </div>
  );
}
