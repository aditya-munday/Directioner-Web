import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { PageHero, Reveal } from "@/components/ui/motion-primitives";

const CARD_BG = "#0f0f12";
const BORDER = "rgba(255,255,255,0.06)";
const YELLOW = "#FFE500";

const EFFECTIVE_DATE = "January 1, 2026";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By accessing or using Directioner (the "Service"), you agree to be bound by these Terms of
        Service ("Terms"). If you disagree with any part of these Terms, you may not access the
        Service. These Terms apply to all visitors, users, and others who access or use the Service.
        Use of the Service by anyone under 13 years of age is strictly prohibited.
      </p>
    ),
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: (
      <>
        <p>
          Directioner is a Discord bot management platform that provides AI-powered bot personalities,
          voice integration, analytics, and a management dashboard. The Service includes:
        </p>
        <ul>
          <li>A web-based dashboard for managing your Discord bots</li>
          <li>AI personality modules deployed to your Discord servers</li>
          <li>Usage analytics and server memory features</li>
          <li>Subscription-based access tiers (Free, Basic, Pro, Max)</li>
        </ul>
        <p className="mt-4">
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time
          with reasonable notice where possible.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "3. Accounts & Registration",
    content: (
      <>
        <p>To use certain features, you must register for an account. You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password confidential and not share it with third parties</li>
          <li>Be responsible for all activity that occurs under your account</li>
          <li>Notify us immediately of any unauthorised use of your account</li>
        </ul>
        <p className="mt-4">
          We reserve the right to terminate accounts that violate these Terms or are inactive for
          more than 12 consecutive months.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Harass, abuse, or harm any person or group</li>
          <li>
            Generate, distribute, or facilitate hate speech, illegal content, or content that
            infringes intellectual property rights
          </li>
          <li>Attempt to gain unauthorised access to any part of the Service or its systems</li>
          <li>
            Reverse-engineer, decompile, or attempt to extract the source code of the Service
          </li>
          <li>
            Use automated scripts or bots to access the Service in ways that exceed normal use
            or impair service performance
          </li>
          <li>Resell, sublicense, or commercially exploit the Service without written permission</li>
          <li>Spam Discord channels or users via the bot</li>
        </ul>
        <p className="mt-4">
          Violation of this section may result in immediate account suspension or termination.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    title: "5. Subscriptions & Billing",
    content: (
      <>
        <p>
          Paid plans are billed monthly or annually in advance via Razorpay. By subscribing, you
          authorise us to charge your payment method on a recurring basis.
        </p>
        <ul>
          <li>
            <strong>Free plan</strong> — limited features, no credit card required
          </li>
          <li>
            <strong>Basic / Pro / Max</strong> — see the Pricing page for current feature limits
            and pricing
          </li>
          <li>
            <strong>Cancellation</strong> — you may cancel at any time; access continues until the
            end of the current billing period; no partial refunds
          </li>
          <li>
            <strong>Upgrades / Downgrades</strong> — take effect immediately; prorated credits
            are applied to the next invoice
          </li>
          <li>
            <strong>Failed payments</strong> — we will retry up to three times over 7 days before
            downgrading your account to Free
          </li>
        </ul>
        <p className="mt-4">
          Prices are exclusive of applicable taxes. You are responsible for all taxes associated
          with your subscription.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "6. Refund Policy",
    content: (
      <>
        <p>
          We offer a <strong>7-day money-back guarantee</strong> on your first payment for any paid
          plan. After the 7-day window, payments are non-refundable except where required by
          applicable law.
        </p>
        <p className="mt-4">
          To request a refund within the 7-day window, email{" "}
          <a href="mailto:billing@directioner.app" className="underline" style={{ color: YELLOW }}>
            billing@directioner.app
          </a>{" "}
          with your account email and order ID.
        </p>
      </>
    ),
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    content: (
      <>
        <p>
          The Service, including its software, design, text, and graphics, is owned by Directioner
          and is protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p className="mt-4">
          <strong>Your content:</strong> You retain ownership of any content you submit to the
          Service (e.g., custom bot configurations, memory notes). By submitting content, you grant
          Directioner a limited, non-exclusive, royalty-free licence to use it solely to provide
          and improve the Service.
        </p>
        <p className="mt-4">
          <strong>Feedback:</strong> Any feedback or suggestions you provide may be used by us
          without obligation or compensation to you.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers & Limitation of Liability",
    content: (
      <>
        <p>
          The Service is provided on an <strong>"AS IS"</strong> and{" "}
          <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, express or implied,
          including but not limited to merchantability, fitness for a particular purpose, or
          non-infringement.
        </p>
        <p className="mt-4">
          To the maximum extent permitted by applicable law, Directioner shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages, including but not
          limited to loss of profits, data, or goodwill, arising out of your use of or inability
          to use the Service.
        </p>
        <p className="mt-4">
          Our total liability for any claim related to the Service shall not exceed the amount you
          paid us in the 12 months preceding the claim.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "9. Termination",
    content: (
      <p>
        We may terminate or suspend your access immediately, without prior notice, if you breach
        these Terms. You may terminate your account at any time by deleting it from the Settings
        page. Upon termination, your right to use the Service ceases immediately, and we will
        delete your data in accordance with our Privacy Policy.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "10. Governing Law & Disputes",
    content: (
      <p>
        These Terms shall be governed by and construed in accordance with applicable law. Any
        dispute arising from these Terms or your use of the Service shall first be attempted to
        be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall
        be submitted to binding arbitration. You waive any right to participate in a class-action
        lawsuit or class-wide arbitration.
      </p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: (
      <p>
        We reserve the right to modify these Terms at any time. Material changes will be notified
        via email and/or a dashboard notice at least 14 days in advance. Continued use of the
        Service after the effective date constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "12. Contact",
    content: (
      <p>
        Questions about these Terms? Contact us at{" "}
        <a href="mailto:legal@directioner.app" className="underline" style={{ color: YELLOW }}>
          legal@directioner.app
        </a>{" "}
        or join our{" "}
        <a href="https://discord.com/invite/directioner" className="underline" style={{ color: YELLOW }}>
          Discord server
        </a>
        .
      </p>
    ),
  },
];

export default function Terms() {
  usePageTitle("Terms of Service");

  return (
    <div style={{ background: "#070708", minHeight: "100vh" }}>
      <PageHero
        eyebrow="Legal — Terms of Service"
        heading="Terms of Service."
        sub={`Effective ${EFFECTIVE_DATE} · Plain-language terms that actually make sense.`}
      />

      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[220px_1fr] gap-12">
            {/* Sticky sidebar nav */}
            <aside className="hidden lg:block">
              <nav className="sticky top-28" aria-label="Terms sections">
                <div
                  className="font-mono text-[9px] uppercase tracking-[0.22em] mb-4"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Sections
                </div>
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block font-mono text-[11px] py-1.5 transition-colors"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
                        }
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main content */}
            <div className="space-y-12">
              {sections.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.04}>
                  <motion.section
                    id={s.id}
                    className="scroll-mt-28"
                    aria-labelledby={`heading-${s.id}`}
                  >
                    <h2
                      id={`heading-${s.id}`}
                      className="font-display font-bold text-white mb-6"
                      style={{ fontSize: "clamp(18px, 2.5vw, 24px)", letterSpacing: "-0.02em" }}
                    >
                      {s.title}
                    </h2>
                    <div
                      className="rounded-lg p-6 font-mono text-sm space-y-3 leading-relaxed"
                      style={{
                        background: CARD_BG,
                        border: `1px solid ${BORDER}`,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <style>{`
                        #${s.id} ul { list-style: none; padding: 0; margin: 0; }
                        #${s.id} li { padding-left: 1.25em; position: relative; margin-bottom: 0.4em; }
                        #${s.id} li::before { content: "→"; position: absolute; left: 0; color: ${YELLOW}; opacity: 0.7; }
                        #${s.id} strong { color: #fff; }
                      `}</style>
                      {s.content}
                    </div>
                  </motion.section>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
