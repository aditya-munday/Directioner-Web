import { usePageTitle } from "@/hooks/use-page-title";
import { useBilling } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Check, Download, CreditCard as CardIcon, RefreshCw, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { openRazorpayCheckout } from "@/lib/razorpay";
import type { RazorpayResponse } from "@/lib/razorpay";

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, priceINR: 0, credits: 500, dailyLimit: 50,
    features: ['500 credits/month', '1 Discord server', 'Text only', '50 memory nodes', 'Community support'],
  },
  {
    id: 'basic', name: 'Basic', price: 4.99, priceINR: 415, credits: 5000, dailyLimit: 300,
    features: ['5,000 credits/month', '3 Discord servers', 'Text + voice (60min/day)', '500 memory nodes', 'Email support'],
  },
  {
    id: 'pro', name: 'Pro', price: 14.99, priceINR: 1249, credits: 25000, dailyLimit: 1500, popular: true,
    features: ['25,000 credits/month', '10 Discord servers', 'Unlimited voice', '5,000 memory nodes', 'Priority support (4h)', 'GPT-4o access', 'Advanced analytics'],
  },
  {
    id: 'max', name: 'Max', price: 39.99, priceINR: 3333, credits: Infinity, dailyLimit: Infinity,
    features: ['Unlimited credits', 'Unlimited servers', 'Unlimited voice', 'Unlimited memory', 'Dedicated SLA support', 'All models', 'API access + white-label'],
  },
];

const COUPON_CODES: Record<string, { desc: string; discount: number }> = {
  DISCORD20: { desc: '20% off first month', discount: 20 },
  BETA10: { desc: '10% off', discount: 10 },
  FREEPRO: { desc: '1 month Pro free', discount: 100 },
};

export default function Billing() {
  usePageTitle("Billing");
  const { user, updateProfile } = useAuth();
  const { data: history = [], loading, refetch } = useBilling(user?.id);
  const [upgrading, setUpgrading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [coupon, setCoupon] = useState('');
  const [couponResult, setCouponResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = PLANS.find(p => p.id === user?.tier) ?? PLANS[0];
  const creditsUsed = user?.credits_used ?? 0;
  const creditsLimit = user?.credits_limit ?? 500;
  const isUnlimited = creditsLimit === Infinity || creditsLimit === 9999999;
  const creditPct = isUnlimited ? 10 : Math.min(100, Math.round((creditsUsed / creditsLimit) * 100));

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPON_CODES[code]) {
      setCouponResult({ success: true, msg: `✓ Applied: ${COUPON_CODES[code].desc}` });
    } else {
      setCouponResult({ success: false, msg: '✗ Invalid code' });
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === user?.tier) return;
    const plan = PLANS.find(p => p.id === planId)!;
    setPaymentError(null);
    setPaymentSuccess(null);

    if (plan.price === 0) {
      // Downgrade to free — no payment needed
      await applyPlanChange(plan);
      return;
    }

    setUpgrading(true);
    setSelectedPlan(planId);

    try {
      // Apply coupon discount
      let priceINR = plan.priceINR;
      const couponCode = coupon.trim().toUpperCase();
      if (COUPON_CODES[couponCode]) {
        priceINR = Math.round(priceINR * (1 - COUPON_CODES[couponCode].discount / 100));
      }

      await openRazorpayCheckout({
        planName: plan.name,
        priceINR,
        userName: user?.full_name ?? user?.username,
        userEmail: user?.email,
        onSuccess: async (response: RazorpayResponse) => {
          await applyPlanChange(plan, response.razorpay_payment_id);
          setShowUpgrade(false);
          setPaymentSuccess(`✓ Payment successful! Upgraded to ${plan.name} plan.`);
        },
        onDismiss: () => {
          setUpgrading(false);
          setSelectedPlan(null);
        },
      });
    } catch (e: any) {
      setPaymentError(e.message ?? 'Payment failed. Please try again.');
      setUpgrading(false);
      setSelectedPlan(null);
    }
  };

  const applyPlanChange = async (plan: (typeof PLANS)[number], paymentId?: string) => {
    if (!supabase || !user) return;
    try {
      await supabase.from('profiles').update({
        tier: plan.id,
        credits_limit: plan.credits === Infinity ? 9999999 : plan.credits,
      }).eq('id', user.id);
      await updateProfile({ tier: plan.id as any, credits_limit: plan.credits === Infinity ? 9999999 : plan.credits });
      if (plan.price > 0) {
        await supabase.from('billing_history').insert({
          user_id: user.id,
          amount: plan.price,
          status: 'paid',
          description: `${plan.name} Plan — Monthly${paymentId ? ` (${paymentId.slice(0, 16)}…)` : ''}`,
        });
        await refetch();
      }
    } finally {
      setUpgrading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start pb-12">
      <div className="flex-1 space-y-10 w-full min-w-0">
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-display font-bold uppercase mb-1">Billing.</h1>
          <p className="font-mono text-xs text-muted-foreground uppercase">Manage your plan and payment history</p>
        </header>

        {/* Notifications */}
        {paymentSuccess && (
          <div className="flex items-center gap-3 bg-accent/10 border border-accent text-accent p-4 font-mono text-xs">
            <Check size={14} /> {paymentSuccess}
          </div>
        )}
        {paymentError && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500 text-red-400 p-4 font-mono text-xs">
            <AlertCircle size={14} /> {paymentError}
          </div>
        )}

        {/* Current Plan */}
        <section className="bg-card border border-border p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">Current Plan</div>
              <div className="font-display font-bold text-3xl text-white uppercase">{currentPlan.name}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-2xl text-primary">
                {currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}/mo`}
              </div>
              {currentPlan.price > 0 && (
                <div className="font-mono text-[10px] text-muted-foreground">≈ ₹{currentPlan.priceINR}/mo</div>
              )}
            </div>
          </div>

          {/* Credits progress */}
          <div className="mb-6">
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground uppercase mb-2">
              <span>Credits Used</span>
              <span>{isUnlimited ? '∞' : `${creditsUsed.toLocaleString()} / ${creditsLimit.toLocaleString()}`}</span>
            </div>
            <div className="h-1.5 bg-white/5 w-full">
              <div
                className={cn("h-full transition-all duration-700", creditPct > 80 ? "bg-red-400" : "bg-primary")}
                style={{ width: `${creditPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center border-t border-border pt-6">
            <div>
              <div className="font-display font-bold text-lg text-white">{isUnlimited ? '∞' : creditsLimit.toLocaleString()}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">Monthly</div>
            </div>
            <div>
              <div className="font-display font-bold text-lg text-white">{currentPlan.dailyLimit === Infinity ? '∞' : currentPlan.dailyLimit}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">Daily Limit</div>
            </div>
            <div>
              <div className="font-display font-bold text-lg text-white">
                {(() => {
                  const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(1);
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })()}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">Next Charge</div>
            </div>
          </div>
        </section>

        {/* Plan upgrade grid */}
        {user?.tier !== 'max' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg uppercase">Upgrade Plan</h2>
              <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <CardIcon size={10} />
                <span>Powered by Razorpay</span>
              </div>
            </div>

            {/* Razorpay note if key missing */}
            {!import.meta.env.VITE_RAZORPAY_KEY_ID && (
              <div className="flex items-start gap-3 bg-primary/5 border border-primary/30 p-4 mb-6 font-mono text-xs text-muted-foreground">
                <AlertCircle size={14} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Add <code className="text-primary">VITE_RAZORPAY_KEY_ID</code> to your Replit Secrets to enable live payments.
                  Plans can still be selected — payment will be simulated.
                </span>
              </div>
            )}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {PLANS.map((plan) => {
                const isCurrent = plan.id === user?.tier;
                const isLoading = upgrading && selectedPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative border p-6 flex flex-col transition-all",
                      (plan as any).popular ? "border-primary" : "border-border",
                      isCurrent ? "bg-primary/5" : "bg-card hover:border-primary/40"
                    )}
                  >
                    {(plan as any).popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black font-mono text-[9px] font-bold px-3 py-0.5 uppercase">
                        Most Popular
                      </div>
                    )}
                    <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">{plan.id === 'max' ? 'Enterprise' : 'Plan'}</div>
                    <div className="font-display font-bold text-xl text-white uppercase mb-1">{plan.name}</div>
                    <div className="mb-4 pb-4 border-b border-border">
                      <span className="font-display font-bold text-2xl text-white">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                      {plan.price > 0 && <span className="font-mono text-[10px] text-muted-foreground">/mo</span>}
                      {plan.priceINR > 0 && (
                        <div className="font-mono text-[10px] text-muted-foreground">≈ ₹{plan.priceINR}/mo</div>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
                          <Check size={10} className="text-primary shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrent || isLoading || (upgrading && selectedPlan !== plan.id)}
                      className={cn(
                        "w-full font-mono text-xs font-bold uppercase py-3 transition-all",
                        isCurrent
                          ? "bg-primary/10 text-primary border border-primary cursor-default"
                          : "bg-primary text-black hover:bg-white corner-brackets disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw size={12} className="animate-spin" /> Processing…
                        </span>
                      ) : isCurrent ? (
                        "Current Plan"
                      ) : plan.id === 'max' ? (
                        "Contact Sales"
                      ) : plan.price === 0 ? (
                        "Downgrade"
                      ) : (
                        "Upgrade via Razorpay →"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Coupon */}
        <section className="bg-card border border-border p-6">
          <div className="font-mono text-[10px] text-muted-foreground uppercase mb-4">Apply Coupon Code</div>
          <div className="flex gap-2 mb-3">
            <input
              value={coupon}
              onChange={e => { setCoupon(e.target.value); setCouponResult(null); }}
              className="flex-1 bg-background border border-border px-3 py-2 font-mono text-xs focus:outline-none focus:border-primary uppercase"
              placeholder="ENTER CODE"
              onKeyDown={e => e.key === 'Enter' && applyCoupon()}
            />
            <button
              onClick={applyCoupon}
              className="bg-primary text-black px-5 py-2 font-mono text-xs font-bold uppercase hover:bg-white transition-colors"
            >
              Apply
            </button>
          </div>
          {couponResult && (
            <div className={cn("font-mono text-xs mb-2", couponResult.success ? "text-accent" : "text-red-400")}>
              {couponResult.msg}
            </div>
          )}
          <div className="font-mono text-[10px] text-muted-foreground">Demo codes: DISCORD20 · BETA10 · FREEPRO</div>
        </section>

        {/* Billing history */}
        <section>
          <h2 className="font-display font-bold text-lg uppercase mb-4">Payment History</h2>
          {loading ? (
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground py-8">
              <RefreshCw size={12} className="animate-spin" /> Loading…
            </div>
          ) : history.length === 0 ? (
            <div className="border border-border bg-card p-8 text-center font-mono text-xs text-muted-foreground">
              No billing history yet. Upgrade a plan to see payments here.
            </div>
          ) : (
            <div className="border border-border divide-y divide-border">
              {history.map((record: any) => (
                <div key={record.id} className="flex items-center justify-between p-4 hover:bg-card/50 transition-colors">
                  <div>
                    <div className="font-mono text-xs text-white">{record.description}</div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      {new Date(record.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "font-mono text-[9px] uppercase px-2 py-0.5 border",
                      record.status === 'paid' ? "text-accent border-accent bg-accent/10" : "text-muted-foreground border-border"
                    )}>
                      {record.status}
                    </span>
                    <span className="font-display font-bold text-white">${Number(record.amount).toFixed(2)}</span>
                    {record.invoice_url && (
                      <a href={record.invoice_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Download size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-72 shrink-0 space-y-6">
        <div className="bg-card border border-border p-6 space-y-4">
          <div className="font-mono text-[10px] text-muted-foreground uppercase border-b border-border pb-3 mb-4">
            Plan Summary
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Plan</span>
            <span className="text-white font-bold">{currentPlan.name}</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Monthly (USD)</span>
            <span className="text-white">{currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}`}</span>
          </div>
          {currentPlan.price > 0 && (
            <div className="flex justify-between font-mono text-xs">
              <span className="text-muted-foreground">Monthly (INR)</span>
              <span className="text-white">₹{currentPlan.priceINR}</span>
            </div>
          )}
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Credits</span>
            <span className="text-white">{isUnlimited ? '∞' : creditsLimit.toLocaleString()}/mo</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Next Charge</span>
            <span className="text-white">{(() => {
              const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(1);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            })()}</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase mb-4">
            <CardIcon size={12} />
            <span>Payment via Razorpay</span>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            Payments are processed securely via Razorpay. Supports UPI, cards, net banking, and wallets.
          </div>
          <div className="mt-4 flex flex-wrap gap-1">
            {["UPI", "VISA", "MASTERCARD", "RUPAY", "NETBANKING"].map(m => (
              <span key={m} className="font-mono text-[9px] border border-border px-1.5 py-0.5 text-muted-foreground">{m}</span>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <div className="font-mono text-[10px] text-muted-foreground uppercase mb-3">Need Help?</div>
          <div className="space-y-2">
            <a href="/dashboard/support" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Zap size={10} /> Support Center
            </a>
            <a href="mailto:hello@directioner.bot" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Zap size={10} /> hello@directioner.bot
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
