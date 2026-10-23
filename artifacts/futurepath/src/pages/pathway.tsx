import { Link } from 'wouter';
import { Check, ExternalLink } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Empty, Skel, ErrorBox, LearningBadges, LearningProgress } from '@/components/bits';
import { JourneyRail, Explain, Fact, NextStep } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
import { pathwaySummary } from '@/lib/i18n/career-text';
export default function Pathway() {
  const { t } = useLanguage();
  const { pathway: p, done, toggle, path, roleId, selectRole, skillName, earnedBadges } = useFP();
  const rail = <JourneyRail current="pathway" />;
  if (path.isPending) return <div><Head kicker="Pathway" title="Building your plan" />{rail}<Skel n={4} /></div>;
  if (path.isError && roleId && !p) return <div><Head kicker="Pathway" title="Plan unavailable" />{rail}<ErrorBox msg="Pathway could not be generated." retry={() => selectRole(roleId)} /></div>;
  if (!p) return <div><Head kicker="Pathway" title="No pathway yet" />{rail}<Empty title="Choose a role first" body="Your ordered learning plan appears here once you pick a role."><Link href="/matches" className="btn-primary" data-testid="link-go-matches">{t('Go to matches')}</Link></Empty></div>;
  const completed = p.steps.filter((step) => done.includes(step.id)).length;
  const nextId = p.steps.find((s) => !done.includes(s.id))?.id;
  return (<div>
    <Head kicker="Pathway" title={p.role.title} sub={pathwaySummary(p.summary, t)} />
    {rail}
    <div className="mb-6 grid gap-3 md:grid-cols-2">
      <Explain title="How to use this plan" testId="explain-pathway-use" defaultOpen>
        <Fact label="Order:">{t('steps cover your skill gaps for this role, with skills mentioned more often in postings placed first.')}</Fact>
        <Fact label="Hours and weeks:">{t('planning estimates based on your weekly study hours. Go at your own pace.')}</Fact>
        <Fact label="Courses:">{t('titles, providers and links are shown in their original language. Check availability and cost on the provider\'s site before enrolling.')}</Fact>
        <Fact label="Completion:">{t('mark a step done yourself. Progress and badges are saved only in this browser and are not certificates.')}</Fact>
      </Explain>
      <Explain title="How automatic updates work" testId="explain-pathway-updates">
        <p>{t('When the app fetches a new Remotive snapshot—when its cache expires or after you refresh Signals on Radar—role matches are recalculated and your chosen pathway is reordered to prioritise missing skills mentioned more often. Completed lessons are preserved.')}</p>
        <p className="text-xs">{t('This uses a global remote-job sample, not Malaysian market statistics or a dedicated AI-research feed. Mentions are estimates, not forecasts.')}</p>
      </Explain>
    </div>
    <LearningProgress completed={completed} total={p.steps.length} hours={p.totalHours} weeks={p.totalWeeks} />
    <LearningBadges earned={earnedBadges} completed={completed} total={p.steps.length} />
    <p className="mb-4 text-xs text-muted-foreground">{t('Badges reflect steps you marked complete yourself. They are motivation, not certification.')}</p>
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
    <p className="text-xs text-muted-foreground mt-8">{t(p.disclaimer)}</p>
    <NextStep href="/impact" title="See how this role could contribute to the UN goals" body="Your role and its learning steps are linked to possible SDG contributions." testId="link-next-impact" back={{ href: '/matches', label: 'Back to matches' }} />
  </div>);
}
