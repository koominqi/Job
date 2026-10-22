import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { StoreProvider } from '@/lib/store';
import { Layout } from '@/components/layout';
import Home from '@/pages/home';
import Radar from '@/pages/radar';
import Matches from '@/pages/matches';
import Pathway from '@/pages/pathway';
import Profile from '@/pages/profile';
import Impact from '@/pages/impact';
import GlobalSkillsTracker from '@/pages/global-skills-tracker';
import { LanguageProvider, useLanguage } from '@/lib/i18n';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { t } = useLanguage();
  useEffect(() => {
    const titles: Record<string, string> = { '/': 'Overview', '/radar': 'Signal radar', '/matches': 'Role matches', '/pathway': 'Learning pathway', '/profile': 'Skills profile', '/impact': 'SDG impact', '/global-skills-tracker': 'Global Skills Tracker' };
    document.title = `${t(titles[location] ?? 'Page not found')} | FuturePath`;
    const d = t(location === '/global-skills-tracker' ? 'Explore job-market trends and discover the skills employers need, via the official UNESCO-UNEVOC Global Skills Tracker.' : 'Explore future-ready careers, understand your skills gaps and build a personalised, SDG-linked reskilling pathway with transparent public job-market signals.');
    const m = document.querySelector('meta[name="description"]');
    m?.setAttribute('content', d);
  }, [location, t]);
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <LanguageProvider><QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <StoreProvider>
            <Layout>
              <RoutedErrorBoundary>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/radar" component={Radar} />
                  <Route path="/matches" component={Matches} />
                  <Route path="/pathway" component={Pathway} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/impact" component={Impact} />
                  <Route path="/global-skills-tracker" component={GlobalSkillsTracker} />
                  <Route component={NotFound} />
                </Switch>
              </RoutedErrorBoundary>
            </Layout>
          </StoreProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider></LanguageProvider>
  );
}

export default App;
