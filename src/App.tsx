import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
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

import Home from '@/pages/index';
import Features from '@/pages/features';
import Commands from '@/pages/commands';
import Pricing from '@/pages/pricing';
import UseCases from '@/pages/use-cases';
import Explore from '@/pages/explore';
import FAQ from '@/pages/faq';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import Docs from '@/pages/docs';
import Blog from '@/pages/blog';
import Careers from '@/pages/careers';
import Terms from '@/pages/terms';
import Privacy from '@/pages/privacy';

import DashboardIndex from '@/pages/dashboard/index';
import Bots from '@/pages/dashboard/bots';
import BotDetails from '@/pages/dashboard/bot-details';
import Analytics from '@/pages/dashboard/analytics';
import Settings from '@/pages/dashboard/settings';
import Billing from '@/pages/dashboard/billing';
import Support from '@/pages/dashboard/support';
import Onboarding from '@/pages/dashboard/onboarding';

import Login from '@/pages/login';
import Register from '@/pages/register';
import ForgotPassword from '@/pages/forgot-password';
import AuthCallback from '@/pages/auth/callback';
import VerifyEmail from '@/pages/auth/verify-email';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

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
    </DashboardLayout>
  );
}

function Router() {
  return (
    <PageTransition>
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
        <Route path="/blog" component={Blog} />
        <Route path="/careers" component={Careers} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />

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
              {/* Global: page loader (once per session) + custom cursor */}
              <PageLoader />
              <CustomCursor />

              <ScrollToTop />
              <Navbar />
              <Router />
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
