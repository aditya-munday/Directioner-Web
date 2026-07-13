import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/lib/auth';

import { Navbar, Footer } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Home from '@/pages/index';
import Features from '@/pages/features';
import Commands from '@/pages/commands';
import Pricing from '@/pages/pricing';
import UseCases from '@/pages/use-cases';
import Explore from '@/pages/explore';
import FAQ from '@/pages/faq';
import About from '@/pages/about';
import Contact from '@/pages/contact';

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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <AuthProvider>
            <ErrorBoundary>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
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
