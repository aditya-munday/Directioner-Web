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
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p>We collect information you provide directly to us when you:</p>
        <ul>
          <li>Create an account (username, email address, password)</li>
          <li>Connect your Discord account via OAuth</li>
          <li>Connect your Google account via OAuth</li>
          <li>Use Directioner in your Discord servers (server ID, channel IDs, interaction logs)</li>
          <li>Contact us for support</li>
          <li>Subscribe to a paid plan (billing details processed by Razorpay — we do not store card numbers)</li>
        </ul>
        <p className="mt-4">We also automatically collect certain technical data:</p>
        <ul>
          <li>IP address and browser/device type</li>
          <li>Pages visited and features used (via Plausible Analytics — no cookies, no cross-site tracking)</li>
          <li>Web Vitals performance metrics</li>
          <li>Error logs (anonymised stack traces)</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve Directioner</li>
          <li>Authenticate you and secure your account</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send transactional emails (verification, password reset, billing receipts)</li>
          <li>Respond to your support requests</li>
          <li>Detect and prevent fraud, abuse, and security incidents</li>
          <li>Analyse aggregate usage patterns to guide product decisions</li>
        </ul>
        <p className="mt-4">We do <strong>not</strong> sell your personal data to third parties.</p>
      </>
    ),
  },
  {
    id: "data-storage",
    title: "3. Data Storage & Security",
    content: (
      <>
        <p>
          Your data is stored in PostgreSQL databases hosted by Supabase on infrastructure
          located in the European Union (eu-west-2) and/or the United States (us-east-1),
          depending on the project region you were assigned at registration.
        </p>
        <p className="mt-4">We protect your data using:</p>
        <ul>
          <li>TLS 1.3 encryption in transit</li>
          <li>AES-256 encryption at rest</li>
          <li>Row-level security (RLS) policies — you can only access your own data</li>
          <li>Bcrypt password hashing (via Supabase Auth)</li>
          <li>Regular automated database backups</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. Information Sharing",
    content: (
      <>
        <p>We share your information only in the following limited circumstances:</p>
        <ul>
          <li>
            <strong>Service providers:</strong> Supabase (database & auth), Razorpay (payments),
            Plausible Analytics (privacy-first analytics) — each bound by data processing agreements.
          </li>
          <li>
            <strong>Discord API:</strong> Interaction data is sent to Discord's servers as required
            to operate the bot. Discord's own privacy policy applies.
          </li>
          <li>
            <strong>Legal compliance:</strong> We may disclose information if required by law,
            court order, or to protect the safety of our users.
          </li>
          <li>
            <strong>Business transfers:</strong> In the event of a merger or acquisition, data may
            be transferred with advance notice to affected users.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    content: (
      <>
        <p>
          Directioner uses <strong>minimal, essential cookies only</strong>:
        </p>
        <ul>
          <li>
            <strong>Authentication session cookie</strong> — stores your encrypted session token
            so you stay logged in. Expires after 7 days of inactivity. Essential; cannot be disabled.
          </li>
          <li>
            <strong>Theme preference</strong> — stores your dark/light mode choice in{" "}
            <code>localStorage</code>. No server-side tracking.
          </li>
        </ul>
        <p className="mt-4">
          We use <strong>Plausible Analytics</strong> for site analytics. Plausible is cookie-free,
          does not fingerprint individual users, and does not share data with advertising networks.
          You can opt out by enabling "Do Not Track" in your browser.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: (
      <>
        <p>We retain your data for as long as your account is active. Specifically:</p>
        <ul>
          <li>Account data — until you delete your account</li>
          <li>Activity logs — rolling 90-day window</li>
          <li>Billing records — 7 years (required for tax compliance)</li>
          <li>Support correspondence — 2 years</li>
        </ul>
        <p className="mt-4">
          After account deletion, all personal data is permanently erased within 30 days,
          except billing records retained for legal obligations.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: (
      <>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li><strong>Access</strong> — request a copy of all data we hold about you</li>
          <li><strong>Rectification</strong> — correct inaccurate or incomplete data</li>
          <li><strong>Erasure</strong> — request deletion of your account and personal data</li>
          <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
          <li><strong>Restriction</strong> — limit how we process your data</li>
          <li><strong>Objection</strong> — object to processing based on legitimate interests</li>
        </ul>
        <p className="mt-4">
          To exercise any right, email{" "}
          <a href="mailto:privacy@directioner.app" className="underline" style={{ color: YELLOW }}>
            privacy@directioner.app
          </a>
          . We respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    content: (
      <p>
        Directioner is not directed at children under 13 (or under 16 in the EU). We do not
        knowingly collect personal data from children. If you believe a child has provided us
        with data, contact us and we will delete it promptly.
      </p>
    ),
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. We will notify you of material
        changes by email and/or by displaying a prominent notice in the dashboard at least
        14 days before the change takes effect. Continued use of Directioner after the
        effective date constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: (
      <p>
        Questions about this policy? Reach us at{" "}
        <a href="mailto:privacy@directioner.app" className="underline" style={{ color: YELLOW }}>
          privacy@directioner.app
        </a>{" "}
        or via our{" "}
        <a href="https://discord.com/invite/directioner" className="underline" style={{ color: YELLOW }}>
          Discord support server
        </a>
        .
      </p>
    ),
  },
];

export default function Privacy() {
  usePageTitle("Privacy Policy");

  return (
    <div style={{ background: "#070708", minHeight: "100vh" }}>
      <PageHero
        eyebrow="Legal — Privacy Policy"
        heading="Privacy Policy."
        sub={`Effective ${EFFECTIVE_DATE} · We keep it simple: your data is yours.`}
      />

      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[220px_1fr] gap-12">
            {/* Sticky sidebar nav */}
            <aside className="hidden lg:block">
              <nav className="sticky top-28" aria-label="Privacy policy sections">
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
                        #${s.id} code { background: rgba(255,229,0,0.1); color: ${YELLOW}; padding: 0.1em 0.4em; border-radius: 2px; font-size: 0.85em; }
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
