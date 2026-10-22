import { type ReactNode } from 'react';
import { AlertTriangle, Award, Compass, LockKeyhole, Sparkles, Trophy } from 'lucide-react';
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

export function LearningProgress({ completed, total, hours, weeks, compact = false }: { completed: number; total: number; hours?: number; weeks?: number; compact?: boolean }) {
  const { t } = useLanguage();
  const safeCompleted = Math.max(0, Math.min(completed, total));
  const percent = total ? Math.round((safeCompleted / total) * 100) : 100;
  const headline = total === 0
    ? t('Your profile already covers the mapped learning skills for this role.')
    : safeCompleted === total
      ? t('Pathway complete. Well done.')
      : safeCompleted === 0
        ? t('Every journey starts with one step.')
        : t('You are making progress—keep building one skill at a time.');
  const summary = total ? t('{done} of {total} steps, {percent}%', { done: safeCompleted, total, percent }) : t('Your profile already covers the mapped learning skills for this role.');
  const progress = <div role="progressbar" aria-label={t('Learning progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><Meter v={percent} color="bg-accent" /></div>;

  if (compact) {
    return (
      <section className="mt-5 rounded-2xl border border-accent/25 bg-gradient-to-r from-accent/10 via-card to-primary/5 p-4" data-testid="card-learning-progress">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><Sparkles size={19} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t('Learning momentum')}</p>
            <p className="mt-1 text-sm font-medium leading-snug">{headline}</p>
          </div>
          <span className="font-display text-2xl font-semibold text-accent" data-testid="text-progress-percent">{percent}%</span>
        </div>
        <div className="mt-4">{progress}</div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span data-testid="text-progress">{summary}</span>
          {hours !== undefined && weeks !== undefined && <span>{t('{hours}h over {weeks} weeks', { hours, weeks })}</span>}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-card via-card to-accent/10 p-5 shadow-sm sm:p-7" data-testid="card-learning-progress" aria-labelledby="learning-progress-heading">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent"><Sparkles size={22} aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">{t('Learning momentum')}</p>
            <h2 id="learning-progress-heading" className="mt-1 font-display text-2xl leading-snug">{headline}</h2>
            <p className="mt-1 text-sm text-muted-foreground" data-testid="text-progress">{summary}</p>
            {hours !== undefined && weeks !== undefined && <p className="mt-2 text-xs text-muted-foreground">{t('{hours}h over {weeks} weeks', { hours, weeks })}</p>}
          </div>
        </div>
        <div className="relative grid size-20 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--accent)) ${percent}%, hsl(var(--muted)) ${percent}% 100%)` }} role="progressbar" aria-label={t('Learning progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} data-testid="text-progress-percent">
          <div className="grid size-[3.65rem] place-items-center rounded-full bg-card font-display text-xl font-semibold text-accent">{percent}%</div>
        </div>
      </div>
      <div className="mt-5">{progress}</div>
    </section>
  );
}

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
    <section className="mb-8 overflow-hidden rounded-3xl border bg-card shadow-sm" data-testid="card-learning-badges" aria-labelledby="learning-badges-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-gradient-to-r from-accent/10 via-card to-primary/5 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-accent/15 text-accent"><Trophy size={21} aria-hidden="true" /></span>
          <div>
            <h2 id="learning-badges-heading" className="font-display text-xl">{t('Skill badges')}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('Celebrate each learning milestone as you go.')}</p>
          </div>
        </div>
        <span className="rounded-full border border-accent/25 bg-card px-3 py-1.5 text-xs font-semibold text-accent">{t('{count} of {total} earned', { count: earned.length, total: learningBadges.length })}</span>
      </div>
      {next && <div className="mx-5 mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:mx-7 sm:p-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent"><Award size={23} aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent">{t('Next milestone')}</p>
          <h3 className="mt-0.5 font-display text-lg">{t(next.title)}</h3>
          <p className="text-sm text-muted-foreground">{t('{count} more steps to earn {badge}', { count: remaining, badge: t(next.title) })}</p>
        </div>
        <div className="w-full min-w-24 sm:w-28" aria-label={t('{count} more steps to earn {badge}', { count: remaining, badge: t(next.title) })}>
          <Meter v={next.id === 'pathway-finished' ? completed / total * 100 : completed / next.target * 100} color="bg-accent" />
          <p className="mt-1 text-right text-xs font-mono text-muted-foreground">{next.id === 'pathway-finished' ? `${completed}/${total}` : `${Math.min(completed, next.target)}/${next.target}`}</p>
        </div>
      </div>}
      <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-7">
        {learningBadges.map((badge) => {
          const hasBadge = earned.includes(badge.id);
          const target = badge.id === 'pathway-finished' ? total : badge.target;
          const badgeProgress = hasBadge ? 100 : Math.min(100, completed / target * 100);
          return (
            <div key={badge.id} data-testid={`badge-${badge.id}`} aria-label={`${t(badge.title)}: ${t(hasBadge ? 'Earned' : 'Not earned')}`} className={`relative flex min-h-36 flex-col rounded-2xl border p-4 transition-colors ${hasBadge ? 'border-accent/35 bg-gradient-to-br from-accent/10 to-card shadow-sm' : 'border-border bg-muted/30'}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`grid size-10 place-items-center rounded-xl ${hasBadge ? 'bg-accent/15 text-accent' : 'bg-background text-muted-foreground'}`}>{hasBadge ? <Award size={20} aria-hidden="true" /> : <LockKeyhole size={18} aria-hidden="true" />}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${hasBadge ? 'bg-accent/15 text-accent' : 'bg-background text-muted-foreground'}`}>{t(hasBadge ? 'Earned' : 'Not earned')}</span>
              </div>
              <div className="mt-3">
                <p className="font-display text-base font-semibold">{t(badge.title)}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(badge.description)}</p>
              </div>
              <div className="mt-auto pt-3"><Meter v={badgeProgress} color={hasBadge ? 'bg-accent' : 'bg-primary/55'} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
