/**
 * Razorpay checkout integration — secure server-side order flow.
 *
 * Flow:
 *  1. Client calls POST /api/billing/create-order → gets { orderId, amount, currency, keyId }
 *  2. Client opens Razorpay checkout with orderId
 *  3. On success, client calls POST /api/billing/verify-payment with the payment response
 *  4. Server verifies HMAC signature, upgrades tier, records billing row
 *
 * Required secrets (set in Replit Secrets):
 *   VITE_RAZORPAY_KEY_ID    — your Razorpay key_id (starts with rzp_test_ or rzp_live_)
 *   RAZORPAY_KEY_SECRET     — server-side only, never exposed to the browser
 */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;      // in paise
  currency: string;
  order_id: string;    // Razorpay order_id from server
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void; escape?: boolean };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: () => void): void;
}

/** Load the Razorpay checkout.js script (idempotent). */
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay !== "undefined") { resolve(); return; }
    const script = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.async   = true;
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script. Check your internet connection."));
    document.head.appendChild(script);
  });
}

export interface CreateOrderResult {
  orderId:  string;
  amount:   number;   // paise
  currency: string;
  keyId:    string;
  planId:   string;
  free?:    boolean;
}

/**
 * Call the API server to create a Razorpay order.
 * Returns null if the coupon makes it free.
 */
export async function createOrder(
  planId: string,
  couponCode: string | undefined,
  authToken: string,
): Promise<CreateOrderResult> {
  const apiBase = import.meta.env.VITE_API_URL as string | undefined ?? "/api";
  const res = await fetch(`${apiBase}/billing/create-order`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({ planId, couponCode: couponCode || undefined }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Payment service unavailable" }));
    throw new Error((err as { error?: string }).error ?? "Failed to create order");
  }

  return res.json() as Promise<CreateOrderResult>;
}

/**
 * Verify payment with the API server (HMAC signature check happens server-side).
 */
export async function verifyPayment(
  response: RazorpayResponse,
  authToken: string,
): Promise<{ success: boolean; planId: string }> {
  const apiBase = import.meta.env.VITE_API_URL as string | undefined ?? "/api";
  const res = await fetch(`${apiBase}/billing/verify-payment`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify(response),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Verification failed" }));
    throw new Error((err as { error?: string }).error ?? "Payment verification failed");
  }

  return res.json() as Promise<{ success: boolean; planId: string }>;
}

export interface OpenCheckoutOptions {
  orderId:    string;
  amount:     number;   // paise
  currency:   string;
  keyId:      string;
  planName:   string;
  userName?:  string;
  userEmail?: string;
  onSuccess:  (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}

/** Open the Razorpay checkout modal with a server-created order. */
export async function openRazorpayCheckout({
  orderId, amount, currency, keyId, planName,
  userName, userEmail, onSuccess, onDismiss,
}: OpenCheckoutOptions): Promise<void> {
  await loadRazorpayScript();

  const rzp = new window.Razorpay({
    key:         keyId,
    amount,
    currency,
    order_id:    orderId,
    name:        "Directioner",
    description: `${planName} Plan — Monthly Subscription`,
    image:       "/favicon.ico",
    prefill:     { name: userName, email: userEmail },
    theme:       { color: "#FFE500" },
    handler:     onSuccess,
    modal:       { ondismiss: onDismiss, escape: false },
  });

  rzp.open();
}
