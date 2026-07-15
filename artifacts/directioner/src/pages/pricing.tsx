import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { PageHero, Reveal, DrawLine, SplitReveal } from "@/components/ui/motion-primitives";

const tiers = [
  {
    id: "free",
    name: "FREE",
    price: { monthly: 0, yearly: 0 },
    tagline: "For personal servers",
    color: "rgba(255,255,255,0.25)",
    features: [
      "1 bot instance",
      "100 messages / day",
      "5 voice interactions / day",
      "Basic text modes",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlight: false,
  },
  {
    id: "starter",
    name: "STARTER",
    price: { monthly: 9, yearly: 7 },
    tagline: "For growing communities",
    color: "#10b981",
    features: [
      "1 bot instance",
      "1,000 messages / day",
      "50 voice interactions / day",
      "All 6 personality modes",
      "1,000 memory nodes",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Starter",
    href: "/register",
    highlight: false,
  },
  {
    id: "pro",
    name: "PRO",
    price: { monthly: 29, yearly: 23 },
    tagline: "For active servers",
    color: "#FFE500",
    features: [
      "3 bot instances",
      "Unlimited messages",
      "500 voice interactions / day",
      "All 6 personality modes",
      "5,000 memory nodes",
      "Advanced analytics",
      "Priority support",
      "Custom wake word",
      "GitHub integration",
      "99.9% uptime SLA",
    ],
    cta: "Start Pro",
    href: "/register",
    highlight: true,
  },
  {
    id: "max",
    name: "MAX",
    price: { monthly: 79, yearly: 63 },
    tagline: "For large communities",
    color: "#a855f7",
    features: [
      "10 bot instances",
      "Unlimited everything",
      "Unlimited voice",
      "All 6 personality modes",
      "Unlimited memory nodes",
      "Custom dashboards",
      "API access",
      "White-label option",
      "Dedicated infrastructure",
      "24/7 phone support",
    ],
    cta: "Start Max",
    href: "/register",
    highlight: false,
  },
];

const tableFeatures = [
  { feature: "Bot Instances",        free: "1",     starter: "1",        pro: "3",            max: "10" },
  { feature: "Messages / Day",       free: "100",   starter: "1,000",    pro: "Unlimited",    max: "Unlimited" },
  { feature: "Voice Interactions",   free: "5",     starter: "50",       pro: "500",          max: "Unlimited" },
  { feature: "Memory Nodes",         free: "—",     starter: "1,000",    pro: "5,000",        max: "Unlimited" },
  { feature: "Personality Modes",    free: "Basic", starter: "All 6",    pro: "All 6",        max: "All 6" },
  { feature: "Analytics",            free: "—",     starter: "Basic",    pro: "Advanced",     max: "Custom" },
  { feature: "API Access",           free: "—",     starter: "—",        pro: "—",            max: "✓" },
  { feature: "Uptime SLA",           free: "—",     starter: "—",        pro: "99.9%",        max: "99.99%" },
  { feature: "Support",              free: "Community", starter: "Email", pro: "Priority",    max: "24/7 Phone" },
  { feature: "White-label",          free: "—",     starter: "—",        pro: "—",            max: "✓" },
];

const faqs = [
  { q: "Can I change my plan any time?", a: "Yes. Upgrade or downgrade at any time from your dashboard. Downgrades take effect at end of billing period." },
  { q: "Is there a free trial?", a: "Pro and Max have a 14-day free trial — no credit card required to start." },
  { q: "What payment methods do you accept?", a: "UPI, credit/debit card, net banking, and all major digital wallets via Razorpay." },
  { q: "What happens to my data if I cancel?", a: "Your data is retained for 30 days after cancellation so you can export it. After that, it is permanently deleted per our privacy policy." },
];

export default function Pricing() {
  usePageTitle("Pricing");
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Pricing — Simple plans"
        heading="Choose your tier."
        sub="Start free. Scale as your community grows. No lock-in."
      />

      {/* Billing toggle */}
      <Reveal className="flex items-center justify-center gap-4 pb-16 px-6">
        <span className="font-mono text-xs uppercase tracking-wide" style={{ color: yearly ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.8)" }}>Monthly</span>
        <button
          onClick={() => setYearly(!yearly)}
          className="relative w-14 h-7 rounded-full transition-colors"
          style={{ background: yearly ? "#FFE500" : "rgba(255,255,255,0.1)" }}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full"
            style={{ background: yearly ? "#000" : "#fff" }}
            animate={{ left: yearly ? "auto" : 4, right: yearly ? 4 : "auto" }}
            transition={{ type: "spring", stiffness: 600, damping: 40 }}
          />
        </button>
        <span className="font-mono text-xs uppercase tracking-wide" style={{ color: yearly ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}>Yearly</span>
        {yearly && (
          <span className="font-mono text-[9px] px-2 py-1 uppercase tracking-wide" style={{ background: "rgba(255,229,0,0.1)", color: "#FFE500", border: "1px solid rgba(255,229,0,0.2)" }}>
            Save 20%
          </span>
        )}
      </Reveal>

      {/* Tier cards */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-xl overflow-hidden flex flex-col"
            style={{
              background: tier.highlight ? "rgba(255,229,0,0.04)" : "#0f0f12",
              border: tier.highlight ? "1px solid rgba(255,229,0,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {tier.highlight && (
              <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #FFE500, transparent)" }} />
            )}
            <div className="p-8 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: tier.color }}>{tier.name}</div>
              <div className="font-mono text-xs mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>{tier.tagline}</div>
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={yearly ? "y" : "m"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-baseline gap-1"
                  >
                    <span className="font-display font-bold text-white" style={{ fontSize: 48, lineHeight: 1 }}>
                      ${yearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    {tier.price.monthly > 0 && (
                      <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>/mo</span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                      style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}35` }}>
                      <Check size={10} style={{ color: tier.color }} />
                    </div>
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Link
                href={tier.href}
                className="block w-full text-center font-mono font-bold text-sm uppercase tracking-wide px-5 py-3.5 transition-all"
                style={tier.highlight
                  ? { background: "#FFE500", color: "#000" }
                  : { border: `1px solid ${tier.color}40`, color: tier.color }}
              >
                {tier.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <DrawLine />

      {/* Comparison table */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              Full comparison
            </div>
            <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              <SplitReveal text="Everything side by side." />
            </h2>
          </Reveal>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <th className="py-4 font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Feature</th>
                  {tiers.map(t => (
                    <th key={t.id} className="py-4 text-center font-mono text-[10px] uppercase tracking-widest" style={{ color: t.color }}>
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableFeatures.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-4 font-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{row.feature}</td>
                    {[row.free, row.starter, row.pro, row.max].map((v, j) => (
                      <td key={j} className="py-4 text-center font-mono text-xs"
                        style={{ color: v === "—" ? "rgba(255,255,255,0.18)" : j === 2 ? "#FFE500" : "rgba(255,255,255,0.7)" }}>
                        {v}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <DrawLine />

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: "#070708" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-12">
            <h2 className="font-display font-bold text-white mb-2" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              Frequently Asked
            </h2>
          </Reveal>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  style={{ background: "#0f0f12" }}
                >
                  <span className="font-mono text-sm text-white">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.35)" }} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 font-mono text-xs leading-relaxed"
                        style={{ background: "#0f0f12", color: "rgba(255,255,255,0.42)" }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
