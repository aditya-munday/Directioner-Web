import { useRef, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, X, ChevronDown, ArrowUpRight, Zap } from "lucide-react";
import { Link } from "wouter";
import { PageHero, Reveal, DrawLine, SplitReveal } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { MagneticElement } from "@/components/animations";

const tiers = [
  {
    id: "free", name: "FREE", price: { monthly: 0, yearly: 0 }, tagline: "For personal servers",
    color: "rgba(255,255,255,0.35)",
    features: [
      { text: "1 bot instance", included: true }, { text: "100 messages / day", included: true },
      { text: "5 voice interactions / day", included: true }, { text: "Basic text modes", included: true },
      { text: "Community support", included: true }, { text: "Memory nodes", included: false },
      { text: "Analytics", included: false }, { text: "Priority support", included: false },
    ],
    cta: "Get Started Free", href: "/register", highlight: false,
    capacity: 15,
  },
  {
    id: "starter", name: "STARTER", price: { monthly: 9, yearly: 7 }, tagline: "For growing communities",
    color: "#10b981",
    features: [
      { text: "1 bot instance", included: true }, { text: "1,000 messages / day", included: true },
      { text: "50 voice interactions / day", included: true }, { text: "All 6 personality modes", included: true },
      { text: "1,000 memory nodes", included: true }, { text: "Basic analytics", included: true },
      { text: "Email support", included: true }, { text: "API access", included: false },
    ],
    cta: "Start Starter", href: "/register", highlight: false,
    capacity: 40,
  },
  {
    id: "pro", name: "PRO", price: { monthly: 29, yearly: 23 }, tagline: "For active servers",
    color: "#FFE500",
    features: [
      { text: "3 bot instances", included: true }, { text: "Unlimited messages", included: true },
      { text: "500 voice interactions / day", included: true }, { text: "All 6 personality modes", included: true },
      { text: "5,000 memory nodes", included: true }, { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true }, { text: "Custom wake word", included: true },
      { text: "GitHub integration", included: true }, { text: "99.9% uptime SLA", included: true },
    ],
    cta: "Start Pro", href: "/register", highlight: true,
    capacity: 75,
  },
  {
    id: "max", name: "MAX", price: { monthly: 79, yearly: 63 }, tagline: "For large communities",
    color: "#a855f7",
    features: [
      { text: "10 bot instances", included: true }, { text: "Unlimited everything", included: true },
      { text: "Unlimited voice", included: true }, { text: "All 6 personality modes", included: true },
      { text: "Unlimited memory nodes", included: true }, { text: "Custom dashboards", included: true },
      { text: "API access", included: true }, { text: "White-label option", included: true },
      { text: "Dedicated infrastructure", included: true }, { text: "24/7 phone support", included: true },
    ],
    cta: "Start Max", href: "/register", highlight: false,
    capacity: 100,
  },
];

const tableFeatures = [
  { feature: "Bot Instances",      free: "1",         starter: "1",        pro: "3",         max: "10" },
  { feature: "Messages / Day",     free: "100",       starter: "1,000",    pro: "Unlimited", max: "Unlimited" },
  { feature: "Voice Interactions", free: "5",         starter: "50",       pro: "500",       max: "Unlimited" },
  { feature: "Memory Nodes",       free: "—",         starter: "1,000",    pro: "5,000",     max: "Unlimited" },
  { feature: "Personality Modes",  free: "Basic",     starter: "All 6",    pro: "All 6",     max: "All 6" },
  { feature: "Analytics",          free: "—",         starter: "Basic",    pro: "Advanced",  max: "Custom" },
  { feature: "API Access",         free: "—",         starter: "—",        pro: "—",         max: "✓" },
  { feature: "Uptime SLA",         free: "—",         starter: "—",        pro: "99.9%",     max: "99.99%" },
  { feature: "Support",            free: "Community", starter: "Email",    pro: "Priority",  max: "24/7 Phone" },
  { feature: "White-label",        free: "—",         starter: "—",        pro: "—",         max: "✓" },
];

const faqs = [
  { q: "Can I change my plan any time?", a: "Yes. Upgrade or downgrade at any time from your dashboard. Downgrades take effect at the end of the billing period so you keep access to your current plan's features until then." },
  { q: "Is there a free trial for paid plans?", a: "Pro and Max plans come with a 14-day free trial — no credit card required to start. If you decide it's not for you, just cancel before the trial ends and you won't be charged." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and all major digital wallets via Razorpay. All transactions are processed securely and we never store your payment details." },
  { q: "What happens to my data if I cancel?", a: "Your data is retained for 30 days after cancellation so you can export it at any time. After 30 days, it is permanently deleted per our privacy policy. We'll send you reminders before deletion." },
  { q: "Do you offer discounts for nonprofits or educational servers?", a: "Yes — we offer up to 50% discount for verified nonprofit organizations and educational institutions. Contact our support team with your credentials to apply." },
];

/* Animated capacity bar */
function CapacityBar({ value, color, inView }: { value: number; color: string; inView: boolean }) {
  return (
    <div className="mt-4 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Capacity</span>
        <span className="font-mono text-[8px]" style={{ color }}>
          {value === 100 ? "∞" : `${value}%`}
        </span>
      </div>
      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: value === 100 ? `linear-gradient(90deg, ${color}, ${color}aa)` : color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function Pricing() {
  usePageTitle("Pricing");
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Pricing — Simple plans"
        heading="Pricing that scales with you."
        sub="Start free. Scale as your community grows. No lock-in, no surprise fees — just straightforward pricing."
      />

      {/* Billing toggle */}
      <Reveal className="flex items-center justify-center gap-4 pb-20 px-6">
        <motion.span
          className="font-mono text-xs uppercase tracking-wide transition-colors"
          animate={{ color: yearly ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)" }}
        >
          Monthly
        </motion.span>
        <motion.button
          onClick={() => setYearly(!yearly)}
          className="relative w-14 h-7 rounded-full focus:outline-none overflow-hidden"
          style={{ background: yearly ? "#FFE500" : "rgba(255,255,255,0.1)" }}
          animate={{ background: yearly ? "#FFE500" : "rgba(255,255,255,0.1)" }}
          transition={{ duration: 0.3 }}
          aria-label="Toggle billing period"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full"
            style={{ background: yearly ? "#000" : "#fff" }}
            animate={{ left: yearly ? "auto" : 4, right: yearly ? 4 : "auto" }}
            transition={{ type: "spring", stiffness: 600, damping: 40 }}
          />
        </motion.button>
        <motion.span
          className="font-mono text-xs uppercase tracking-wide"
          animate={{ color: yearly ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}
        >
          Yearly
        </motion.span>
        <AnimatePresence>
          {yearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: -10 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-1.5 font-mono text-[9px] px-2.5 py-1 uppercase tracking-widest"
              style={{ background: "rgba(255,229,0,0.1)", color: "#FFE500", border: "1px solid rgba(255,229,0,0.25)" }}
            >
              <Zap size={9} /> Save 20%
            </motion.span>
          )}
        </AnimatePresence>
      </Reveal>

      {/* Tier cards */}
      <div ref={cardsRef} className="max-w-7xl mx-auto px-6 pb-28 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, i) => {
          const CardContent = (
            <div
              className="relative overflow-hidden flex flex-col h-full"
              style={{
                background: tier.highlight
                  ? "linear-gradient(145deg, rgba(255,229,0,0.06), rgba(255,229,0,0.02))"
                  : "linear-gradient(145deg, #111114, #0d0d10)",
                border: tier.highlight ? "1px solid rgba(255,229,0,0.35)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: tier.highlight ? "0 0 60px rgba(255,229,0,0.06)" : "none",
              }}
            >
              {tier.highlight && (
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #FFE500, transparent)" }} />
              )}
              {tier.highlight && (
                <div className="absolute top-4 right-4">
                  <motion.span
                    className="font-mono text-[8px] uppercase tracking-widest px-2.5 py-1"
                    style={{ background: "#FFE500", color: "#000", fontWeight: 700 }}
                    animate={{ boxShadow: ["0 0 0 0 rgba(255,229,0,0.4)", "0 0 0 6px rgba(255,229,0,0)", "0 0 0 0 rgba(255,229,0,0)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Most Popular
                  </motion.span>
                </div>
              )}
              {tier.highlight && <BorderBeam color="#FFE500" duration={4} />}

              <div className="p-7 flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-1 block font-bold" style={{ color: tier.color }}>
                  {tier.name}
                </div>
                <div className="font-mono text-[10px] mb-5" style={{ color: "rgba(255,255,255,0.28)" }}>{tier.tagline}</div>

                {/* Price */}
                <div className="mb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={yearly ? "y" : "m"}
                      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-baseline gap-1">
                        {tier.price.monthly > 0 && yearly && (
                          <span className="font-mono text-sm line-through mr-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                            ${tier.price.monthly}
                          </span>
                        )}
                        <span className="font-display font-bold text-white" style={{ fontSize: 48, lineHeight: 1 }}>
                          ${yearly ? tier.price.yearly : tier.price.monthly}
                        </span>
                        {tier.price.monthly > 0 && (
                          <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>/mo</span>
                        )}
                      </div>
                      {tier.price.monthly > 0 && yearly && (
                        <div className="mt-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5" style={{ background: "rgba(255,229,0,0.1)", color: "#FFE500", border: "1px solid rgba(255,229,0,0.2)" }}>
                            Save 20%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Capacity bar */}
                <CapacityBar value={tier.capacity} color={tier.highlight ? "#FFE500" : tier.color} inView={cardsInView} />

                {/* Features list */}
                <ul className="space-y-2.5 mt-5">
                  {tier.features.map((f, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -8 }}
                      animate={cardsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.05 + j * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-2.5"
                    >
                      {f.included ? (
                        <div className="w-4 h-4 flex items-center justify-center shrink-0" style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}35` }}>
                          <Check size={9} style={{ color: tier.highlight ? "#FFE500" : tier.color }} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <X size={9} style={{ color: "rgba(255,255,255,0.2)" }} strokeWidth={2.5} />
                        </div>
                      )}
                      <span className="font-mono text-xs" style={{ color: f.included ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)" }}>
                        {f.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <MagneticElement strength={0.15}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={tier.href}
                      className="flex items-center justify-center gap-2 w-full text-center font-mono font-bold text-sm uppercase tracking-wide px-5 py-3.5 transition-all"
                      style={
                        tier.highlight
                          ? { background: "#FFE500", color: "#000" }
                          : { border: `1px solid ${tier.color}40`, color: tier.color, background: `${tier.color}06` }
                      }
                    >
                      {tier.cta}
                      {tier.highlight && <ArrowUpRight size={14} />}
                    </Link>
                  </motion.div>
                </MagneticElement>
              </div>
            </div>
          );

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={cardsInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
              style={tier.highlight ? { marginTop: -12 } : {}}
            >
              {tier.highlight ? (
                <TiltCard intensity={5} glowColor="rgba(255,229,0,0.06)" className="flex flex-col h-full">{CardContent}</TiltCard>
              ) : CardContent}
            </motion.div>
          );
        })}
      </div>

      <DrawLine />

      {/* Comparison table */}
      <section className="py-28 px-6" style={{ background: "#08080a" }}>
        <div className="max-w-5xl mx-auto">
          <ClipReveal delay={0.05}>
            <div className="mb-14">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>Full comparison</div>
              <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                <SplitReveal text="Everything side by side." delay={0.04} />
              </h2>
            </div>
          </ClipReveal>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 540 }}>
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <th className="py-4 pr-6 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>Feature</th>
                  {tiers.map(t => (
                    <th key={t.id} className="py-4 text-center font-mono text-[9px] uppercase tracking-widest" style={{ color: t.highlight ? "#FFE500" : t.color }}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableFeatures.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b group"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <td className="py-4 pr-6 font-mono text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{row.feature}</td>
                    {[row.free, row.starter, row.pro, row.max].map((v, j) => (
                      <td key={j} className="py-4 text-center font-mono text-xs" style={{ color: v === "—" ? "rgba(255,255,255,0.15)" : j === 2 ? "#FFE500" : "rgba(255,255,255,0.65)" }}>
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
      <section className="py-28 px-6" style={{ background: "#070708" }}>
        <div className="max-w-3xl mx-auto">
          <ClipReveal delay={0.05}>
            <div className="mb-14">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>Support</div>
              <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>
                <SplitReveal text="Frequently asked." delay={0.04} />
              </h2>
            </div>
          </ClipReveal>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="overflow-hidden"
                style={{ border: `1px solid ${openFaq === i ? "rgba(255,229,0,0.2)" : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.3s" }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors"
                  style={{ background: openFaq === i ? "rgba(255,229,0,0.03)" : "#0e0e11" }}
                >
                  <span className="font-mono text-sm text-white pr-8">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0"
                  >
                    <ChevronDown size={15} style={{ color: openFaq === i ? "#FFE500" : "rgba(255,255,255,0.3)" }} />
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
                      <motion.div
                        initial={{ y: -8 }}
                        animate={{ y: 0 }}
                        className="px-6 pb-6 font-mono text-xs leading-relaxed border-t relative"
                        style={{ background: "#0f0f12", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,229,0,0.1)", paddingTop: 20 }}
                      >
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-[2px]"
                          style={{ background: "#FFE500" }}
                          initial={{ scaleY: 0, originY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        {faq.a}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-16 text-center">
            <p className="font-mono text-xs mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>Still have questions?</p>
            <MagneticElement strength={0.2}>
              <motion.a
                href="mailto:support@directioner.app"
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide"
                style={{ color: "#FFE500" }}
                whileHover={{ x: 3 }}
              >
                Contact support <ArrowUpRight size={14} />
              </motion.a>
            </MagneticElement>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
