import { Link } from 'wouter';
import { AlertTriangle, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Empty, Skel, ErrorBox } from '@/components/bits';
import { BadgeShelf } from '@/components/badges';
import { FAQ, Fact, NextLink } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
import { pathwaySummary } from '@/lib/i18n/career-text';
export default function Pathway() {
  const { t, date } = useLanguage();
  const { pathway: p, done, toggle, path, roleId, selectRole, rebuildPathway, skillName, signals, planUpdateFailed } = useFP();
  if (path.isPending && !p) return <div><Head kicker="Pathway" title="Building your plan" /><Skel n={4} /></div>;
  if (path.isError && roleId && !p) return <div><Head kicker="Pathway" title="Plan unavailable" /><ErrorBox msg="Pathway could not be generated." retry={() => selectRole(roleId)} /></div>;
  if (!p) return <div><Head kicker="Pathway" title="No pathway yet" /><Empty title="Choose a role first" body="Your ordered learning plan appears here once you pick a role."><Link href="/matches" className="btn-primary" data-testid="link-go-matches">{t('Go to matches')}</Link></Empty></div>;
  const nextId = p.steps.find((s) => !done.includes(s.id))?.id;
  const snapshot = signals.data && signals.data.status !== 'unavailable' ? signals.data.fetchedAt : null;
  return (<div>
    <Head kicker="Pathway" title={p.role.title} sub={pathwaySummary(p.summary, t)} />
    {planUpdateFailed && <div role="alert" className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm" data-testid="state-plan-update-failed">
      <AlertTriangle size={17} className="shrink-0 text-destructive" aria-hidden="true" />
      <span className="flex-1">{t('New job-post data arrived, but the plan could not be reordered. Your current steps and progress are unchanged.')}</span>
      <button onClick={rebuildPathway} disabled={path.isPending} className="btn-quiet !py-1.5 disabled:opacity-60" data-testid="button-retry-plan-update"><RefreshCw size={14} className={path.isPending ? 'animate-spin motion-reduce:animate-none' : ''} aria-hidden="true" />{t('Retry pathway update')}</button>
    </div>}
    <BadgeShelf steps={p.steps} done={done} hours={p.totalHours} weeks={p.totalWeeks} />
    {p.steps.length > 0 && <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="font-display text-2xl">{t('Learning steps')}</h2>
      {snapshot && <p className="font-mono text-[11px] text-muted-foreground" data-testid="text-plan-snapshot">{t('Ordered using job posts from {date}', { date: date(snapshot) })}</p>}
    </div>}
    <ol className="relative border-l-2 border-primary/30 ml-3 space-y-5">{p.steps.map((s, i) => { const d = done.includes(s.id); const isNext = s.id === nextId; return (
      <li key={s.id} className="pl-6 relative rise" style={{ animationDelay: `${i * 60}ms` }} data-testid={`step-${s.id}`}>
        <button onClick={() => toggle(s.id)} aria-label={t('toggle complete')} aria-pressed={d} data-testid={`button-toggle-${s.id}`} className={`absolute -left-[15px] top-4 size-7 rounded-full border-2 grid place-items-center transition-all motion-reduce:transition-none ${d ? 'bg-accent border-accent text-accent-foreground scale-110 motion-reduce:scale-100' : 'bg-background border-primary hover:scale-110 motion-reduce:hover:scale-100'}`}>{d && <Check size={14} aria-hidden="true" />}</button>
        <div className={`rounded-2xl border bg-card shadow-sm p-5 transition-opacity ${d ? 'opacity-70' : ''} ${isNext ? 'border-primary/50 ring-1 ring-primary/30' : ''}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-primary">{t('Step {n} of {total}', { n: i + 1, total: p.steps.length })}</span>
            {isNext && <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">{t('Start here')}</span>}
            {d && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">{t('Completed')}</span>}
          </div>
          <h3 className={`mt-1 font-display text-xl ${d ? 'line-through' : ''}`} translate="no">{s.title}</h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
            <div><dt className="text-muted-foreground">{t('Builds skill')}</dt><dd className="font-medium">{skillName(s.skillId)}</dd></div>
            <div><dt className="text-muted-foreground">{t('When')}</dt><dd className="font-medium">{t('Weeks {start}-{end}', { start: s.weekStart, end: s.weekEnd })}</dd></div>
            <div><dt className="text-muted-foreground">{t('Estimated time')}</dt><dd className="font-medium">{t('{hours} hours', { hours: s.hours })}</dd></div>
            <div><dt className="text-muted-foreground">{t('Provider and cost')}</dt><dd className="font-medium"><span translate="no">{s.provider}</span>, {t(s.cost)}</dd></div>
          </dl>
          <p className="mt-3 text-sm"><span className="text-muted-foreground">{t('You will be able to:')}</span> {t(s.outcome)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <a href={s.url} target="_blank" rel="noreferrer" className="btn-quiet !py-1.5" data-testid={`link-course-${s.id}`}>{t('Course')} <ExternalLink size={11} aria-hidden="true" /></a>
            <button onClick={() => toggle(s.id)} aria-pressed={d} className={d ? 'btn-quiet !py-1.5' : 'btn-primary !py-1.5'} data-testid={`button-step-done-${s.id}`}>{d ? <><Check size={13} aria-hidden="true" />{t('Completed, undo')}</> : t('Mark done')}</button>
            <span className="text-muted-foreground">SDG {s.sdgs.join(', ') || t('none')}</span>
          </div>
        </div></li>); })}</ol>
    <NextLink href="/impact" label="Impact" testId="link-next-impact" />
    <FAQ testId="faq-pathway" items={[
      { id: 'use', q: t('How to use this plan'), a: <>
        <Fact label="Order:">{t('steps cover your skill gaps for this role, with skills mentioned more often in postings placed first.')}</Fact>
        <Fact label="Hours and weeks:">{t('planning estimates based on your weekly study hours. Go at your own pace.')}</Fact>
        <Fact label="Courses:">{t('titles, providers and links are shown in their original language. Check availability and cost on the provider\'s site before enrolling.')}</Fact>
      </> },
      { id: 'updates', q: t('How automatic updates work'), a: <>
        <p>{t('When the app fetches a new Remotive snapshot—when its cache expires or after you refresh Signals on Radar—role matches are recalculated and your chosen pathway is reordered to prioritise missing skills mentioned more often. Completed lessons are preserved.')}</p>
        <p>{t('This uses a global remote-job sample, not Malaysian market statistics or a dedicated AI-research feed. Mentions are estimates, not forecasts.')}</p>
      </> },
      { id: 'badges', q: t('How do badges work?'), a: <p>{t('Each step you mark done earns the badge for the skill it builds, and finishing every step earns the Pathway finisher trophy. Progress is self-reported and saved only in this browser. Badges are motivation, not certificates.')}</p> },
      { id: 'guarantee', q: t('Are the hours and courses guaranteed?'), a: <p>{t(p.disclaimer)}</p> },
    ]} />
  </div>);
}
