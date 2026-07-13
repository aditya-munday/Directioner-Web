import { usePageTitle } from "@/hooks/use-page-title";
import { OscilloscopeWave } from "@/components/animations";
import { Link } from "wouter";
import { Check, X as XIcon } from "lucide-react";

export default function Pricing() {
  usePageTitle("Pricing");

  const tiers = [
    { 
      name: "Free", price: "0", 
      features: ["500 credits/month • 50/day", "1 Discord server", "Text channels only", "50 memory nodes", "Community support", "Basic AI model (GPT-3.5)", "5 commands/hour rate limit"],
      cta: "Get Started Free",
      isPrimary: false
    },
    { 
      name: "Basic", price: "4.99", 
      features: ["5,000 credits/month • 300/day", "3 Discord servers", "Text + voice (60 min/day)", "500 memory nodes", "Email support (48h response)", "Basic AI model", "20 commands/hour"],
      cta: "Start Basic",
      isPrimary: false
    },
    { 
      name: "Pro", price: "14.99", popular: true,
      features: ["25,000 credits/month • 1,500/day", "10 Discord servers", "Text + unlimited voice", "5,000 memory nodes", "Priority support (4h response)", "GPT-4o + GPT-4o Mini", "Advanced analytics", "Custom personality presets", "100 commands/hour"],
      cta: "Start Pro",
      isPrimary: true
    },
    { 
      name: "Max", price: "39.99", 
      features: ["Unlimited credits", "Unlimited servers", "Unlimited voice", "Unlimited memory", "Dedicated support + SLA", "All models incl. GPT-4 Turbo", "White-label option", "API access", "Custom integrations", "Unlimited commands"],
      cta: "Contact Sales",
      isPrimary: false
    }
  ];

  return (
    <div className="pt-32 pb-32 bg-background">
      <section className="relative text-center px-6 py-24 mb-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center mix-blend-screen">
          <OscilloscopeWave color="hsl(var(--primary))" amplitude={60} speed={4} opacity={0.3} className="absolute inset-x-0" />
          <OscilloscopeWave color="hsl(var(--accent))" amplitude={80} speed={3} opacity={0.2} className="absolute inset-x-0 mt-20" />
          <OscilloscopeWave color="hsl(var(--primary))" amplitude={30} speed={6} opacity={0.4} className="absolute inset-x-0 -mt-20 scale-y-50" />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase mb-6 text-white">Simple pricing.</h1>
          <p className="text-xl text-primary font-mono uppercase bg-primary/10 border border-primary inline-block px-6 py-2">Unlimited potential.</p>
        </div>
      </section>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {tiers.map((t) => (
          <div key={t.name} className={`relative flex flex-col bg-card border ${t.popular ? 'border-primary shadow-[0_0_20px_rgba(255,229,0,0.1)]' : 'border-border'} p-8 hover:-translate-y-2 transition-transform duration-300`}>
            {t.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black font-mono text-[10px] font-bold px-4 py-1 uppercase border border-black shadow-sm">
                Most Popular
              </div>
            )}
            
            <h3 className="font-display text-2xl font-bold uppercase mb-2 text-white">{t.name}</h3>
            <div className="mb-8 border-b border-border pb-6">
              <span className="text-4xl md:text-5xl font-display font-black text-white">${t.price}</span>
              <span className="text-muted-foreground font-mono text-xs uppercase">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white font-mono">
                  <Check size={16} className="text-accent shrink-0 mt-0.5" />
                  <span className="opacity-90">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={t.name === 'Max' ? '/contact' : '/register'}
              className={`w-full text-center font-mono text-sm font-bold uppercase py-4 transition-colors ${
                t.isPrimary
                  ? "bg-primary text-black corner-brackets hover:bg-white"
                  : "bg-transparent border border-border text-white hover:bg-white hover:text-black"
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-6 mb-32 hidden md:block">
        <h2 className="text-3xl font-display font-bold uppercase text-white mb-8 text-center">Compare Plans</h2>
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-6 font-bold text-muted-foreground uppercase">Features</th>
                <th className="p-6 font-bold text-white uppercase text-center border-l border-border">Free</th>
                <th className="p-6 font-bold text-white uppercase text-center border-l border-border">Basic</th>
                <th className="p-6 font-bold text-primary uppercase text-center border-l border-primary/50 bg-primary/5">Pro</th>
                <th className="p-6 font-bold text-white uppercase text-center border-l border-border">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { label: "Credits / month", values: ["500", "5,000", "25,000", "Unlimited"] },
                { label: "Daily limit", values: ["50", "300", "1,500", "Unlimited"] },
                { label: "Servers", values: ["1", "3", "10", "Unlimited"] },
                { label: "Voice Support", values: [false, "60 min/day", "Unlimited", "Unlimited"] },
                { label: "Memory nodes", values: ["50", "500", "5,000", "Unlimited"] },
                { label: "Support", values: ["Community", "Email (48h)", "Priority (4h)", "Dedicated + SLA"] },
                { label: "AI Model", values: ["GPT-3.5", "Basic", "GPT-4o + Mini", "All incl. Turbo"] },
                { label: "Analytics", values: ["Basic", "Basic", "Advanced", "Advanced"] },
                { label: "Custom personality", values: [false, false, true, true] },
                { label: "API access", values: [false, false, false, true] },
                { label: "White-label", values: [false, false, false, true] },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 text-muted-foreground font-bold">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className={`p-6 text-center border-l ${j===2 ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                      {typeof v === 'boolean' ? (
                        v ? <Check size={20} className="text-accent mx-auto" /> : <XIcon size={20} className="text-muted-foreground opacity-50 mx-auto" />
                      ) : (
                        <span className="text-white">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-display font-bold uppercase text-white mb-8 text-center">Pricing FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time. Upgrades are pro-rated, downgrades take effect at the next billing cycle." },
            { q: "What if I run out of credits?", a: "Your bot will temporarily pause processing new messages until the daily or monthly reset. You can also purchase a one-time credit top-up." },
            { q: "Is there a free trial for paid plans?", a: "No, but the Free tier is forever free and provides a great way to test the core text functionality." },
            { q: "How does billing work?", a: "We use Stripe for secure monthly billing. You can cancel your subscription anytime from the dashboard." },
            { q: "What is your refund policy?", a: "We offer pro-rated refunds within the first 14 days of a new subscription if you're unhappy with the service." }
          ].map((faq, i) => (
            <div key={i} className="border border-border bg-card p-6">
              <h3 className="font-mono font-bold text-white uppercase mb-2">Q: {faq.q}</h3>
              <p className="font-mono text-sm text-muted-foreground">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
