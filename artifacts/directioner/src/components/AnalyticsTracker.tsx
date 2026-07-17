import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/analytics';

/**
 * Invisible component that fires a Plausible page view on every SPA route change.
 * Place inside <WouterRouter> in App.tsx.
 */
export function AnalyticsTracker() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView();
  }, [location]);
  return null;
}
