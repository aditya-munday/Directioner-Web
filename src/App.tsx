import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AuthProvider } from '@/lib/auth';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar, Footer } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/animations/PageLoader';
import { CustomCursor } from '@/components/animations/CustomCursor';
import { SkeletonBox } from '@/components/ui/skeleton-loader';

/* ─── Lazy-loaded pages (code splitting) ────────────────────────── */
const Home          = lazy(() => import('@/pages/index'));
const Features      = lazy(() => import('@/pages/features'));
const Commands      = lazy(() => import('@/pages/commands'));
const Pricing       = lazy(() => import('@/pages/pricing'));
const UseCases      = lazy(() => import('@/pages/use-cases'));
const Explore       = lazy(() => import('@/pages/explore'));
const FAQ           = lazy(() => import('@/pages/faq'));
const About         = lazy(() => import('@/pages/about'));
const Contact       = lazy(() => import('@/pages/contact'));
const Docs          = lazy(() => import('@/pages/docs'));
const Privacy       = lazy(() => import('@/pages/privacy'));
const Terms         = lazy(() => import('@/pages/terms'));

const DashboardIndex = lazy(() => import('@/pages/dashboard/index'));
const Bots           = lazy(() => import('@/pages/dashboard/bots'));
const BotDetails     = lazy(() => import('@/pages/dashboard/bot-details'));
const Analytics      = lazy(() => import('@/pages/dashboard/analytics'));
const Settings       = lazy(() => import('@/pages/dashboard/settings'));
const Billing        = lazy(() => import('@/pages/dashboard/billing'));
const Support        = lazy(() => import('@/pages/dashboard/support'));
const Onboarding     = lazy(() => import('@/pages/dashboard/onboarding'));

const Login          = lazy(() => import('@/pages/login'));
const Register       = lazy(() => import('@/pages/register'));
const ForgotPassword = lazy(() => import('@/pages/forgot-password'));
const AuthCallback   = lazy(() => import('@/pages/auth/callback'));
const VerifyEmail    = lazy(() => import('@/pages/auth/verify-email'));
const NotFound       = lazy(() => import('@/pages/not-found'));

/* ─── Query client ──────────────────────────────────────────────── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

/* ─── Page loading fallback ─────────────────────────────────────── */
function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col gap-6 p-12 max-w-4xl mx-auto w-full">
      <SkeletonBox className="h-10 w-1/3" />
      <SkeletonBox className="h-4 w-2/3" />
      <SkeletonBox className="h-4 w-1/2" />
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[...Array(3)].map((_, i) => (
          <SkeletonBox key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Page transition wrapper — fade + slight upward drift on route change */
function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/dashboard/bots/:id" component={BotDetails} />
          <Route path="/dashboard/bots" component={Bots} />
          <Route path="/dashboard/analytics" component={Analytics} />
          <Route path="/dashboard/settings" component={Settings} />
          <Route path="/dashboard/billing" component={Billing} />
          <Route path="/dashboard/support" component={Support} />
          <Route path="/dashboard/onboarding" component={Onboarding} />
          <Route component={DashboardIndex} />
        </Switch>
      </Suspense>
    </DashboardLayout>
  );
}

function Router() {
  return (
    <PageTransition>
      <Suspense fallback={<PageFallback />}>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/features" component={Features} />
          <Route path="/commands" component={Commands} />
          <Route path="/use-cases" component={UseCases} />
          <Route path="/explore" component={Explore} />
          <Route path="/faq" component={FAQ} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/docs" component={Docs} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />

          {/* Auth Routes */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/auth/verify-email" component={VerifyEmail} />

          {/* All /dashboard/* routes go to DashboardRoutes */}
          <Route path="/dashboard" component={DashboardRoutes} />
          <Route path="/dashboard/:rest+" component={DashboardRoutes} />

          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </PageTransition>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ErrorBoundary>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              {/* Skip to main content — accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:rounded"
                style={{ background: '#FFE500', color: '#000' }}
              >
                Skip to main content
              </a>

              {/* Global: page loader (once per session) + custom cursor */}
              <PageLoader />
              <CustomCursor />

              <ScrollToTop />
              <Navbar />
              <main id="main-content" tabIndex={-1}>
                <Router />
              </main>
              <Footer />
            </WouterRouter>
          </ErrorBoundary>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;