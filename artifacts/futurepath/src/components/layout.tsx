import { type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Radar, Target, Route as RouteIcon, UserRound, Globe2, Telescope, Languages } from 'lucide-react';
import { languages, useLanguage, type Language } from '@/lib/i18n';
import { SignalPlanNotice } from '@/components/bits';
import { useFP } from '@/lib/store';
const nav = [['/', 'Overview', LayoutDashboard], ['/radar', 'Signal radar', Radar], ['/matches', 'Role matches', Target], ['/pathway', 'Pathway', RouteIcon], ['/profile', 'Profile', UserRound], ['/impact', 'Impact', Globe2], ['/global-skills-tracker', 'Global Skills Tracker', Telescope]] as const;
export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { signalPlanUpdate, signals, dismissSignalPlanUpdate, rebuildPathway } = useFP();
  return (
    <div className="min-h-[100dvh] md:flex">
      <aside className="min-w-0 md:w-64 md:shrink-0 md:min-h-[100dvh] md:sticky md:top-0 md:h-[100dvh] bg-sidebar text-sidebar-foreground p-4 md:p-6 flex flex-col gap-4 md:border-r md:border-sidebar-border">
        <Link href="/" className="hidden md:block" data-testid="link-logo"><div className="font-display text-3xl font-semibold tracking-tight">Future<span className="text-sidebar-primary">Path</span></div><p className="text-xs opacity-60 mt-1">{t('A steady companion for career change')}</p></Link>
        <div>
          <label htmlFor="site-language" className="mb-1 flex items-center gap-2 text-xs"><Languages size={15} aria-hidden="true" />{t('Language')}</label>
          <select id="site-language" value={language} onChange={(e) => setLanguage(e.target.value as Language)} data-testid="select-language" className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sm text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
            {languages.map((l) => <option key={l.value} value={l.value} lang={l.value}>{l.label}</option>)}
          </select>
          <p className="hidden md:block mt-2 text-[11px] opacity-70 leading-relaxed">{t('External pages and course titles stay in their original language.')}</p>
        </div>
        <nav aria-label={t('Main navigation')} className="min-w-0 flex flex-wrap md:flex-col gap-1 md:mt-2 md:flex-1">
          {nav.map(([h, l, I]) => { const on = loc === h; return (
            <Link key={h} href={h} aria-current={on ? 'page' : undefined} data-testid={`link-nav-${l.toLowerCase().replace(/ /g, '-')}`} className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm whitespace-nowrap md:whitespace-normal transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${on ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'hover:bg-sidebar-accent'}`}><I size={17} className="shrink-0" />{t(l)}</Link>); })}
        </nav>
        <p className="hidden md:block text-[11px] opacity-60 leading-snug border-t border-sidebar-border pt-4">{t('Synthetic demo data only. Rule-based model, no LLM. Estimates, not forecasts.')}</p>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-12 md:py-12 max-w-6xl mx-auto w-full">
        {signalPlanUpdate && <SignalPlanNotice status={signalPlanUpdate} fetchedAt={signals.data?.fetchedAt} onDismiss={dismissSignalPlanUpdate} onRetry={rebuildPathway} />}
        {children}
        <footer className="mt-16 pt-6 border-t text-xs text-muted-foreground">{t('Job signals:')} <a className="underline" href="https://remotive.com" target="_blank" rel="noreferrer">Remotive</a> {t('(global remote feed, not representative of Malaysia).')} {t('Your profile, pathway, completed steps and badges stay in this browser. Matching sends only selected skill IDs, interests, experience, study hours and scenario; CV files are never read or uploaded.')}</footer>
      </main>
    </div>);
}
