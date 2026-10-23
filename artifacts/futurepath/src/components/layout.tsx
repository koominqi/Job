import { type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Radar, Target, Route as RouteIcon, UserRound, Globe2, Telescope, Languages, type LucideIcon } from 'lucide-react';
import { languages, useLanguage, type Language } from '@/lib/i18n';
import { useFP } from '@/lib/store';

type NavItem = { href: string; label: string; icon: LucideIcon };
const overview: NavItem[] = [{ href: '/', label: 'Overview', icon: LayoutDashboard }];
// The journey order lives here, in the sidebar, instead of numbered steps on each page.
const journey: NavItem[] = [
  { href: '/profile', label: 'Profile', icon: UserRound },
  { href: '/radar', label: 'Signal radar', icon: Radar },
  { href: '/matches', label: 'Role matches', icon: Target },
  { href: '/pathway', label: 'Pathway', icon: RouteIcon },
  { href: '/impact', label: 'Impact', icon: Globe2 },
];
const resources: NavItem[] = [{ href: '/global-skills-tracker', label: 'Global Skills Tracker', icon: Telescope }];

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { pathway, done } = useFP();
  const steps = pathway?.steps.length ?? 0;
  const completed = pathway ? pathway.steps.filter((s) => done.includes(s.id)).length : 0;
  const list = (items: NavItem[], labelledBy?: string) => (
    <ul aria-labelledby={labelledBy} className="contents md:flex md:flex-col md:gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const on = loc === href;
        return (
          <li key={href}>
            <Link href={href} aria-current={on ? 'page' : undefined} data-testid={`link-nav-${label.toLowerCase().replace(/ /g, '-')}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap md:whitespace-normal transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${on ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'hover:bg-sidebar-accent'}`}>
              <Icon size={17} className="shrink-0" aria-hidden="true" />
              <span className="flex-1">{t(label)}</span>
              {href === '/pathway' && steps > 0 && <>
                <span aria-hidden="true" className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${on ? 'bg-sidebar-primary-foreground/15' : 'bg-sidebar-accent'}`} data-testid="text-nav-progress">{completed}/{steps}</span>
                <span className="sr-only">{t('{done} of {total} steps', { done: completed, total: steps })}</span>
              </>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
  const groupLabel = (id: string, text: string) => <p id={id} className="hidden px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-widest opacity-60 md:block">{text}</p>;
  return (
    <div className="min-h-[100dvh] md:flex">
      <aside className="min-w-0 md:w-64 md:shrink-0 md:min-h-[100dvh] md:sticky md:top-0 md:h-[100dvh] md:overflow-y-auto bg-sidebar text-sidebar-foreground p-4 md:p-6 flex flex-col gap-4 md:border-r md:border-sidebar-border">
        <Link href="/" className="hidden md:block" data-testid="link-logo"><div className="font-display text-3xl font-semibold tracking-tight">Future<span className="text-sidebar-primary">Path</span></div><p className="text-xs opacity-60 mt-1">{t('A steady companion for career change')}</p></Link>
        <div>
          <label htmlFor="site-language" className="mb-1 flex items-center gap-2 text-xs"><Languages size={15} aria-hidden="true" />{t('Language')}</label>
          <select id="site-language" value={language} onChange={(e) => setLanguage(e.target.value as Language)} data-testid="select-language" className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sm text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
            {languages.map((l) => <option key={l.value} value={l.value} lang={l.value}>{l.label}</option>)}
          </select>
          {language !== 'en' && <p className="hidden md:block mt-2 text-[11px] opacity-70 leading-relaxed">{t('External pages and course titles stay in their original language.')}</p>}
        </div>
        <nav aria-label={t('Main navigation')} className="min-w-0 flex flex-wrap gap-1 md:block md:flex-1">
          {list(overview)}
          {groupLabel('nav-journey', t('Your journey'))}
          {list(journey, 'nav-journey')}
          {groupLabel('nav-resources', t('Resources'))}
          {list(resources, 'nav-resources')}
        </nav>
        <p className="hidden md:block text-[11px] opacity-60 leading-snug border-t border-sidebar-border pt-4">{t('Synthetic demo data only. Rule-based model, no LLM. Estimates, not forecasts.')}</p>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-12 md:py-12 max-w-6xl mx-auto w-full">
        {children}
        <footer className="mt-16 pt-6 border-t text-xs text-muted-foreground">{t('Job signals:')} <a className="underline" href="https://remotive.com" target="_blank" rel="noreferrer">Remotive</a> {t('(global remote feed, not representative of Malaysia).')} {t('Your profile and progress stay in this browser.')}</footer>
      </main>
    </div>);
}
