import { type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, Info } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export const JOURNEY = [
  { key: 'profile', href: '/profile', label: 'Profile', hint: 'Choose skills, interests, study time and a scenario' },
  { key: 'radar', href: '/radar', label: 'Signals', hint: 'See which skills dated job posts mention' },
  { key: 'matches', href: '/matches', label: 'Matches', hint: 'Compare ranked roles and skill gaps' },
  { key: 'pathway', href: '/pathway', label: 'Pathway', hint: 'Follow timed learning steps' },
  { key: 'impact', href: '/impact', label: 'SDG impact', hint: 'See possible links to the 17 UN goals' },
] as const;
export type JourneyKey = (typeof JOURNEY)[number]['key'];

/** Navigate the journey without mistaking a visited route for completed learning. */
export function JourneyRail({ current }: { current?: JourneyKey }) {
  const { t } = useLanguage();
  return (
    <nav aria-label={t('Your FuturePath journey')} className="mb-8" data-testid="nav-journey">
      <ol className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {JOURNEY.map((s, i) => {
          const on = s.key === current;
          return (
            <li key={s.key} className="min-w-0">
              <Link href={s.href} aria-current={on ? 'step' : undefined} title={t(s.hint)} data-testid={`link-journey-${s.key}`}
                className={`group flex h-full flex-col gap-1 rounded-xl border px-2 py-2 sm:px-3 transition-colors ${on ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/50 hover:bg-muted/60'}`}>
                <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-start">
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px] ${on ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
                  <span className="min-w-0 break-words text-center text-[11px] font-medium leading-snug sm:text-left sm:text-sm">{t(s.label)}</span>
                </span>
                <span className={`hidden text-[11px] leading-snug lg:block ${on ? 'opacity-85' : 'text-muted-foreground'}`}>{t(s.hint)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Progressive disclosure: short summary, details on demand. */
export function Explain({ title, children, testId, defaultOpen = false }: { title: string; children: ReactNode; testId: string; defaultOpen?: boolean }) {
  const { t } = useLanguage();
  return (
    <details open={defaultOpen} className="group rounded-xl border bg-card/80 open:bg-card open:shadow-sm" data-testid={testId}>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden" data-testid={`toggle-${testId}`}>
        <Info size={15} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="flex-1">{t(title)}</span>
        <ChevronDown size={16} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="space-y-2 border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </details>
  );
}

/** A plain-language fact row with a small label. */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useLanguage();
  return <p><b className="font-medium text-foreground">{t(label)}</b> {children}</p>;
}

export function NextStep({ href, title, body, testId, back }: { href: string; title: string; body: string; testId: string; back?: { href: string; label: string } }) {
  const { t } = useLanguage();
  return (
    <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/5 via-card to-accent/5 p-5" aria-label={t('Next step')}>
      <div className="min-w-0 max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">{t('Next step')}</p>
        <p className="mt-1 font-display text-xl">{t(title)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t(body)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {back && <Link href={back.href} className="text-sm underline" data-testid={`${testId}-back`}>{t(back.label)}</Link>}
        <Link href={href} className="btn-primary group" data-testid={testId}>{t('Continue')} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
