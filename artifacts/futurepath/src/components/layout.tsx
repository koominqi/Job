import { type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Radar, Target, Route as RouteIcon, UserRound, Globe2, Telescope } from 'lucide-react';
const nav = [['/', 'Overview', LayoutDashboard], ['/radar', 'Signal radar', Radar], ['/matches', 'Role matches', Target], ['/pathway', 'Pathway', RouteIcon], ['/profile', 'Profile', UserRound], ['/impact', 'Impact', Globe2], ['/global-skills-tracker', 'Global Skills Tracker', Telescope]] as const;
export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  return (
    <div className="min-h-[100dvh] md:flex">
      <aside className="min-w-0 md:w-64 md:shrink-0 md:min-h-[100dvh] md:sticky md:top-0 md:h-[100dvh] bg-sidebar text-sidebar-foreground p-4 md:p-6 flex md:flex-col gap-4">
        <Link href="/" className="hidden md:block" data-testid="link-logo"><div className="font-display text-3xl font-semibold">Future<span className="text-primary">Path</span></div><p className="text-xs opacity-60 mt-1">A steady companion for career change</p></Link>
        <nav aria-label="Main navigation" className="min-w-0 flex md:flex-col gap-1 overflow-x-auto md:mt-6 flex-1">
          {nav.map(([h, l, I]) => { const on = loc === h; return (
            <Link key={h} href={h} aria-current={on ? 'page' : undefined} data-testid={`link-nav-${l.toLowerCase().replace(/ /g, '-')}`} className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${on ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent hover:translate-x-1'}`}><I size={17} />{l}</Link>); })}
        </nav>
        <p className="hidden md:block text-[11px] opacity-60 leading-snug border-t border-sidebar-border pt-4">Synthetic demo data only. Rule-based model, no LLM. Estimates, not forecasts.</p>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-12 md:py-12 max-w-6xl">{children}
        <footer className="mt-16 pt-6 border-t text-xs text-muted-foreground">Job signals: <a className="underline" href="https://remotive.com" target="_blank" rel="noreferrer">Remotive</a> (global remote feed, not representative of Malaysia). Profile is synthetic and stored only in this browser.</footer>
      </main>
    </div>);
}
