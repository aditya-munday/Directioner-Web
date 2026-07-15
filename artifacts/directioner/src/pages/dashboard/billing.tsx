import { usePageTitle } from "@/hooks/use-page-title";
import { useBilling } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Check, Download, CreditCard as CardIcon, RefreshCw, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { openRazorpayCheckout } from "@/lib/razorpay";
import type { RazorpayResponse } from "@/lib/razorpay";

const BORDER = "rgba(255,255,255,0.06)";
const CARD   = "#0f0f12";
const YELLOW = "#FFE500";

const PLANS = [
  {
    id: "free",  name: "Free",    price: 0,     priceINR: 0,    credits: 500,      dailyLimit: 50,
    features: ["500 credits/month", "1 Discord server", "Text only", "50 memory nodes", "Community support"],
    color: "rgba(255,255,255,0.4)",
  },
  {
    id: "basic", name: "Basic",   price: 4.99,  priceINR: 415,  credits: 5000,     dailyLimit: 300,
    features: ["5,000 credits/month", "3 Discord servers", "Text + voice (60min/day)", "500 memory nodes", "Email support"],
    color: "#10b981",
  },
  {
    id: "pro",   name: "Pro",     price: 14.99, priceINR: 1249, credits: 25000,    dailyLimit: 1500, popular: true,
    features: ["25,000 credits/month", "10 Discord servers", "Unlimited voice", "5,000 memory nodes", "Priority support (4h)", "GPT-4o access", "Advanced analytics"],
    color: YELLOW,
  },
  {
    id: "max",   name: "Max",     price: 39.99, priceINR: 3333, credits: Infinity, dailyLimit: Infinity,
    features: ["Unlimited credits", "Unlimited servers", "Unlimited voice", "Unlimited memory", "Dedicated SLA", "All models", "API + white-label"],
    color: "#a855f7",
  },
];

const COUPONS: Record<string, { desc: string; discount: number }> = {
  DISCORD20: { desc: "20% off first month", discount: 20 },
  BETA10:    { desc: "10% off",             discount: 10 },
  FREEPRO:   { desc: "1 month Pro free",    discount: 100 },
};

export default function Billing() {
  usePageTitle("Billing");
  const { user, updateProfile } = useAuth();
  const { data: history = [], loading, refetch } = useBilling(user?.id);
  const [upgrading, setUpgrading]     = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [coupon, setCoupon]           = useState("");
  const [couponResult, setCouponResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan  = PLANS.find(p => p.id === user?.tier) ?? PLANS[0];
  const creditsUsed  = user?.credits_used  ?? 0;
  const creditsLimit = user?.credits_limit ?? 500;
  const isUnlimited  = creditsLimit === Infinity || creditsLimit === 9999999;
  const creditPct    = isUnlimited ? 10 : Math.min(100, Math.round((creditsUsed / creditsLimit) * 100));

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    setCouponResult(COUPONS[code]
      ? { ok: true,  msg: `✓ Applied: ${COUPONS[code].desc}` }
      : { ok: false, msg: "✗ Invalid coupon code" }
    );
  };

  const applyPlanChange = async (plan: typeof PLANS[number], paymentId?: string) => {
    if (!supabase || !user) return;
    await supabase.from("profiles").update({
      tier: plan.id,
      credits_limit: plan.credits === Infinity ? 9999999 : plan.credits,
    }).eq("id", user.id);
    await updateProfile({ tier: plan.id as any, credits_limit: plan.credits === Infinity ? 9999999 : plan.credits });
    if (plan.price > 0) {
      await supabase.from("billing_history").insert({
        user_id: user.id,
        amount: plan.price,
        status: "paid",
        description: `${plan.name} Plan — Monthly${paymentId ? ` (${paymentId.slice(0, 16)}…)` : ""}`,
      });
      await refetch();
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === user?.tier) return;
    const plan = PLANS.find(p => p.id === planId)!;
    setPaymentError(null); setPaymentSuccess(null);
    if (plan.price === 0) { await applyPlanChange(plan); return; }
    setUpgrading(true); setSelectedPlan(planId);
    try {
      let priceINR = plan.priceINR;
      const code = coupon.trim().toUpperCase();
      if (COUPONS[code]) priceINR = Math.round(priceINR * (1 - COUPONS[code].discount / 100));
      await openRazorpayCheckout({
        planName: plan.name, priceINR,
        userName: user?.full_name ?? user?.username,
        userEmail: user?.email,
        onSuccess: async (r: RazorpayResponse) => {
          await applyPlanChange(plan, r.razorpay_payment_id);
          setPaymentSuccess(`✓ Payment successful! Upgraded to ${plan.name} plan.`);
        },
        onDismiss: () => { setUpgrading(false); setSelectedPlan(null); },
      });
    } catch (e: any) {
      setPaymentError(e.message ?? "Payment failed. Please try again.");
    } finally { setUpgrading(false); setSelectedPlan(null); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start pb-12">
      <div className="flex-1 space-y-8 w-full min-w-0">
        {/* Header */}
        <header className="pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "rgba(255,255,255,0.25)" }}>BILLING & PLANS</div>
          <h1 className="font-display font-bold text-white leading-none"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
            Billing.
          </h1>
        </header>

        {/* Notifications */}
        {paymentSuccess && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 font-mono text-xs rounded-lg"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
            <Check size={14} /> {paymentSuccess}
          </motion.div>
        )}
        {paymentError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 font-mono text-xs rounded-lg"
            style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e" }}>
            <AlertCircle size={14} /> {paymentError}
          </motion.div>
        )}

        {/* Current plan card */}
        <div className="p-8 rounded-xl" style={{ background: CARD, border: `1px solid rgba(255,229,0,0.2)` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,229,0,0.5), transparent)" }} />
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1"
                style={{ color: "rgba(255,255,255,0.25)" }}>Current Plan</div>
              <div className="font-display font-bold text-white uppercase"
                style={{ fontSize: 36 }}>{currentPlan.name}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold" style={{ fontSize: 28, color: YELLOW }}>
                {currentPlan.price === 0 ? "Free" : `$${currentPlan.price}/mo`}
              </div>
              {currentPlan.price > 0 && (
                <div className="font-mono text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  ≈ ₹{currentPlan.priceINR}/mo
                </div>
              )}
            </div>
          </div>
          {/* Credits bar */}
          <div className="mb-6">
            <div className="flex justify-between font-mono text-[10px] uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <span>Credits Used</span>
              <span>{isUnlimited ? "∞" : `${creditsUsed.toLocaleString()} / ${creditsLimit.toLocaleString()}`}</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${creditPct}%`, background: creditPct > 80 ? "#f43f5e" : YELLOW }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
            {[
              { label: "Monthly",    val: isUnlimited ? "∞" : creditsLimit.toLocaleString() },
              { label: "Daily Limit", val: currentPlan.dailyLimit === Infinity ? "∞" : String(currentPlan.dailyLimit) },
              { label: "Next Charge", val: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(1); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); })() },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-white text-xl">{val}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest mt-1"
                  style={{ color: "rgba(255,255,255,0.25)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan grid */}
        {user?.tier !== "max" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white uppercase text-xl">Upgrade Plan</h2>
              <div className="flex items-center gap-1.5 font-mono text-[10px]"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                <CardIcon size={11} /> Powered by Razorpay
              </div>
            </div>
            {!import.meta.env.VITE_RAZORPAY_KEY_ID && (
              <div className="flex items-start gap-3 p-4 mb-5 font-mono text-xs rounded-lg"
                style={{ background: "rgba(255,229,0,0.05)", border: "1px solid rgba(255,229,0,0.2)", color: "rgba(255,255,255,0.45)" }}>
                <AlertCircle size={14} style={{ color: YELLOW }} className="shrink-0 mt-0.5" />
                <span>Add <code style={{ color: YELLOW }}>VITE_RAZORPAY_KEY_ID</code> to Replit Secrets to enable live payments. Plans can still be selected — payment will be simulated.</span>
              </div>
            )}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
              {PLANS.map(plan => {
                const isCurrent = plan.id === user?.tier;
                const isLoading = upgrading && selectedPlan === plan.id;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-xl p-6 flex flex-col"
                    style={{
                      background: isCurrent ? `${plan.color}06` : CARD,
                      border: `1px solid ${(plan as any).popular ? `${plan.color}50` : isCurrent ? `${plan.color}30` : BORDER}`,
                    }}
                  >
                    {(plan as any).popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono font-bold text-[9px] uppercase px-3 py-0.5"
                        style={{ background: YELLOW, color: "#000" }}>
                        Most Popular
                      </div>
                    )}
                    <div className="font-mono text-[9px] uppercase tracking-widest mb-1"
                      style={{ color: "rgba(255,255,255,0.25)" }}>{plan.id === "max" ? "Enterprise" : "Plan"}</div>
                    <div className="font-display font-bold text-white text-xl uppercase mb-1" style={{ color: plan.color }}>{plan.name}</div>
                    <div className="mb-5 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <span className="font-display font-bold text-white text-2xl">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                      {plan.price > 0 && <span className="font-mono text-[10px] ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>/mo</span>}
                      {plan.priceINR > 0 && (
                        <div className="font-mono text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>≈ ₹{plan.priceINR}/mo</div>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 font-mono text-[10px]"
                          style={{ color: "rgba(255,255,255,0.5)" }}>
                          <Check size={10} className="shrink-0 mt-0.5" style={{ color: plan.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrent || isLoading || (upgrading && selectedPlan !== plan.id)}
                      className="w-full font-mono font-bold text-xs uppercase py-3 transition-all disabled:opacity-50"
                      style={isCurrent
                        ? { background: `${plan.color}12`, border: `1px solid ${plan.color}40`, color: plan.color, cursor: "default" }
                        : { background: plan.color, color: plan.color === YELLOW ? "#000" : "#000" }}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw size={12} className="animate-spin" /> Processing…
                        </span>
                      ) : isCurrent ? "Current Plan"
                        : plan.id === "max" ? "Contact Sales"
                        : plan.price === 0 ? "Downgrade"
                        : "Upgrade via Razorpay →"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coupon */}
        <div className="p-6 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4"
            style={{ color: "rgba(255,255,255,0.25)" }}>Apply Coupon</div>
          <div className="flex gap-2 mb-2">
            <input
              value={coupon}
              onChange={e => { setCoupon(e.target.value); setCouponResult(null); }}
              onKeyDown={e => e.key === "Enter" && applyCoupon()}
              placeholder="ENTER CODE"
              className="flex-1 px-4 py-3 font-mono text-sm text-white uppercase focus:outline-none transition-colors"
              style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
            <button onClick={applyCoupon}
              className="px-6 font-mono font-bold text-sm uppercase transition-all"
              style={{ background: YELLOW, color: "#000" }}>
              Apply
            </button>
          </div>
          {couponResult && (
            <div className="font-mono text-xs mb-2" style={{ color: couponResult.ok ? "#10b981" : "#f43f5e" }}>
              {couponResult.msg}
            </div>
          )}
          <div className="font-mono text-[9px] uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.2)" }}>
            Demo codes: DISCORD20 · BETA10 · FREEPRO
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="font-display font-bold text-white uppercase text-lg mb-4">Payment History</h2>
          {loading ? (
            <div className="flex items-center gap-2 font-mono text-xs py-8"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              <RefreshCw size={12} className="animate-spin" /> Loading…
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs rounded-xl"
              style={{ border: `1px dashed ${BORDER}`, color: "rgba(255,255,255,0.2)" }}>
              No billing history yet.
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
              {history.map((record: any, i: number) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 transition-colors"
                  style={{
                    background: i % 2 === 0 ? CARD : "transparent",
                    borderBottom: i < history.length - 1 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  <div>
                    <div className="font-mono text-xs text-white">{record.description}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest mt-0.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(record.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded"
                      style={record.status === "paid"
                        ? { border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.08)", color: "#10b981" }
                        : { border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.3)" }}>
                      {record.status}
                    </span>
                    <span className="font-display font-bold text-white">${Number(record.amount).toFixed(2)}</span>
                    {record.invoice_url && (
                      <a href={record.invoice_url} target="_blank" rel="noopener noreferrer"
                        className="transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = YELLOW; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                        <Download size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="p-6 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4 pb-3"
            style={{ color: "rgba(255,255,255,0.25)", borderBottom: `1px solid ${BORDER}` }}>
            Plan Summary
          </div>
          {[
            { k: "Plan",         v: currentPlan.name },
            { k: "Monthly (USD)", v: currentPlan.price === 0 ? "Free" : `$${currentPlan.price}` },
            ...(currentPlan.price > 0 ? [{ k: "Monthly (INR)", v: `₹${currentPlan.priceINR}` }] : []),
            { k: "Credits",      v: isUnlimited ? "∞" : `${creditsLimit.toLocaleString()}/mo` },
            { k: "Next Charge",  v: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(1); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); })() },
          ].map(({ k, v }) => (
            <div key={k} className="flex justify-between font-mono text-xs py-2.5"
              style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
              <span className="text-white font-bold">{v}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            <CardIcon size={11} /> Payment via Razorpay
          </div>
          <div className="font-mono text-[10px] leading-relaxed mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}>
            Secure payments via Razorpay. Supports UPI, cards, net banking, and wallets.
          </div>
          <div className="flex flex-wrap gap-1">
            {["UPI", "VISA", "MC", "RUPAY", "NB"].map(m => (
              <span key={m} className="font-mono text-[8px] px-1.5 py-0.5 uppercase"
                style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.3)" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="font-mono text-[10px] uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Need Help?</div>
          {[
            { label: "Support Center", href: "/dashboard/support" },
            { label: "hello@directioner.bot", href: "mailto:hello@directioner.bot" },
          ].map(l => (
            <a key={l.label} href={l.href}
              className="flex items-center gap-2 font-mono text-xs py-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.35)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = YELLOW; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
              <Zap size={10} /> {l.label}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}
