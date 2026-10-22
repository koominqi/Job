import { type ReactNode } from 'react';
import { AlertTriangle, Award, Compass } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/i18n';
import { learningBadges, type LearningBadgeId } from '@/lib/learning';
export const Skel = ({ n = 3, h = 'h-24' }: { n?: number; h?: string }) => (<div className="space-y-3" data-testid="state-loading">{Array.from({ length: n }).map((_, i) => <div key={i} className={`skel ${h}`} />)}</div>);
export const ErrorBox = ({ msg, retry }: { msg: string; retry?: () => void }) => { const { t } = useLanguage(); return (
  <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 flex gap-3 items-start" data-testid="state-error"><AlertTriangle className="text-destructive shrink-0" /><div><p className="font-medium">{t(msg)}</p>{retry && <button onClick={retry} data-testid="button-retry" className="btn-quiet mt-3">{t('Try again')}</button>}</div></div>); };
export const Empty = ({ title, body, children }: { title: string; body: string; children?: ReactNode }) => { const { t } = useLanguage(); return (
  <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-card/60 p-10 text-center" data-testid="state-empty"><Compass className="mx-auto mb-3 text-primary" /><h3 className="font-display text-xl">{t(title)}</h3><p className="text-muted-foreground mt-1 mb-4 text-sm max-w-md mx-auto">{t(body)}</p>{children}</div>); };
export const Meter = ({ v, color = 'bg-primary' }: { v: number; color?: string }) => (<div className="h-2.5 rounded-full bg-muted overflow-hidden"><div className={`bar h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, v))}%` }} /></div>);
export const Head = ({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) => { const { t } = useLanguage(); return (<header className="mb-8 rise"><p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">{t(kicker)}</p><h1 className="font-display text-4xl md:text-5xl font-semibold mt-1 leading-tight break-words">{t(title)}</h1>{sub && <p className="text-muted-foreground mt-2 max-w-2xl">{t(sub)}</p>}</header>); };

export function SignalPlanNotice({ status, fetchedAt, onDismiss, onRetry }: { status: 'updated' | 'error'; fetchedAt?: string; onDismiss: () => void; onRetry: () => void }) {
  const { t, date } = useLanguage();
  const failed = status === 'error';
  return (
    <aside role={failed ? 'alert' : 'status'} data-testid="notice-signal-replan" className={`mb-6 rounded-xl border p-4 ${failed ? 'border-destructive/50 bg-destructive/5' : 'border-accent/60 bg-accent/10'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t(failed ? 'Pathway update needs attention' : 'Your learning pathway was automatically updated')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t(failed ? 'A new Remotive posting snapshot was found, but the saved pathway could not be refreshed. Your role and completed steps are safe; retry when the service is available.' : 'A new dated Remotive posting snapshot arrived. Role matches were recalculated and your chosen pathway was reordered using its skill-mention counts. Completed steps were kept.')}</p>
          {fetchedAt && <p className="mt-1 text-xs text-muted-foreground">{t('Snapshot date:')} {date(fetchedAt)}</p>}
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm"><Link className="underline" href="/matches">{t('Review role matches')}</Link><Link className="underline" href="/radar">{t('View source and date')}</Link></p>
        </div>
        <div className="flex items-center gap-3">
          {failed && <button onClick={onRetry} className="text-sm font-medium underline" data-testid="button-retry-pathway-update">{t('Retry pathway update')}</button>}
          <button onClick={onDismiss} className="text-sm underline" data-testid="button-dismiss-pathway-update">{t('Dismiss')}</button>
        </div>
      </div>
    </aside>
  );
}

export function LearningBadges({ earned, completed, total }: { earned: LearningBadgeId[]; completed: number; total: number }) {
  const { t } = useLanguage();
  if (!total) return null;
  const next = learningBadges.find((badge) => !earned.includes(badge.id));
  const remaining = next?.id === 'pathway-finished' ? Math.max(0, total - completed) : next ? Math.max(0, next.target - completed) : 0;
  return (
    <section className="mb-8 rounded-2xl border bg-card p-6 shadow-sm" data-testid="card-learning-badges" aria-labelledby="learning-badges-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="learning-badges-heading" className="font-display text-xl">{t('Skill badges')}</h2>
        <span className="text-xs font-mono text-muted-foreground">{t('{count} of {total} earned', { count: earned.length, total: learningBadges.length })}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">{next ? t('{count} more steps to earn {badge}', { count: remaining, badge: t(next.title) }) : t('You earned every badge. Keep learning with another role.')}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {learningBadges.map((badge) => {
          const hasBadge = earned.includes(badge.id);
          return (
            <div key={badge.id} data-testid={`badge-${badge.id}`} aria-label={`${t(badge.title)}: ${t(hasBadge ? 'Earned' : 'Not earned')}`} className={`flex items-start gap-3 rounded-lg border p-3 ${hasBadge ? 'border-primary/40 bg-primary/5' : 'opacity-70'}`}>
              <Award className={`mt-0.5 shrink-0 ${hasBadge ? 'text-primary' : 'text-muted-foreground'}`} size={20} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t(badge.title)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(badge.description)}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide">{t(hasBadge ? 'Earned' : 'Not earned')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
