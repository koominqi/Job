import { Link } from 'wouter';
import { Check, ExternalLink } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Empty, Meter, Skel, ErrorBox, LearningBadges } from '@/components/bits';
import { useLanguage } from '@/lib/i18n';
import { pathwaySummary } from '@/lib/i18n/career-text';
export default function Pathway() {
  const { t } = useLanguage();
  const { pathway: p, done, toggle, path, roleId, selectRole, skillName, earnedBadges } = useFP();
  if (path.isPending) return <div><Head kicker="Pathway" title="Building your plan" /><Skel n={4} /></div>;
  if (path.isError && roleId && !p) return <div><Head kicker="Pathway" title="Plan unavailable" /><ErrorBox msg="Pathway could not be generated." retry={() => selectRole(roleId)} /></div>;
  if (!p) return <div><Head kicker="Pathway" title="No pathway yet" /><Empty title="Choose a role first" body="Your ordered learning plan appears here once you pick a role."><Link href="/matches" className="btn-primary" data-testid="link-go-matches">{t('Go to matches')}</Link></Empty></div>;
  const completed = p.steps.filter((step) => done.includes(step.id)).length;
  const pct = Math.round((completed / Math.max(1, p.steps.length)) * 100);
  return (<div>
    <Head kicker="Pathway" title={p.role.title} sub={pathwaySummary(p.summary, t)} />
    <section className="mb-6 rounded-xl border border-accent/50 bg-accent/5 p-5" aria-labelledby="auto-update-heading">
      <h2 id="auto-update-heading" className="font-display text-xl">{t('How automatic updates work')}</h2>
      <p className="mt-2 text-sm">{t('When the app fetches a new Remotive snapshot—when its cache expires or after you refresh Signals on Radar—role matches are recalculated and your chosen pathway is reordered to prioritise missing skills mentioned more often. Completed lessons are preserved.')}</p>
      <p className="mt-2 text-xs text-muted-foreground">{t('This uses a global remote-job sample, not Malaysian market statistics or a dedicated AI-research feed. Mentions are estimates, not forecasts.')}</p>
    </section>
    <div className="rounded-2xl border bg-card shadow-sm p-5 mb-6"><div className="flex flex-wrap gap-2 justify-between text-sm mb-2"><span data-testid="text-progress">{t('{done} of {total} steps, {percent}%', { done: completed, total: p.steps.length, percent: pct })}</span><span className="font-mono">{t('{hours}h over {weeks} weeks', { hours: p.totalHours, weeks: p.totalWeeks })}</span></div><Meter v={pct} color="bg-accent" /></div>
    <LearningBadges earned={earnedBadges} completed={completed} total={p.steps.length} />
    <ol className="relative border-l-2 border-primary/30 ml-3 space-y-5">{p.steps.map((s, i) => { const d = done.includes(s.id); return (
      <li key={s.id} className="pl-6 relative rise" style={{ animationDelay: `${i * 60}ms` }} data-testid={`step-${s.id}`}>
        <button onClick={() => toggle(s.id)} aria-label={t('toggle complete')} aria-pressed={d} data-testid={`button-toggle-${s.id}`} className={`absolute -left-[15px] top-4 size-7 rounded-full border-2 grid place-items-center transition-all ${d ? 'bg-accent border-accent text-accent-foreground scale-110' : 'bg-background border-primary hover:scale-110'}`}>{d && <Check size={14} />}</button>
        <div className={`rounded-2xl border bg-card shadow-sm p-5 transition-opacity ${d ? 'opacity-60' : ''}`}>
          <p className="font-mono text-xs text-primary">{t('WEEKS')} {s.weekStart}-{s.weekEnd}, {s.hours}{t('H,')} {skillName(s.skillId)}</p>
          <h3 className={`font-display text-xl ${d ? 'line-through' : ''}`} translate="no">{s.title}</h3>
          <p className="text-sm text-muted-foreground">{t(s.outcome)}</p>
          <p className="text-xs mt-2">{s.provider}, {t(s.cost)}, SDG {s.sdgs.join(', ') || t('none')} <a href={s.url} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1 ml-2" data-testid={`link-course-${s.id}`}>{t('Course')} <ExternalLink size={11} /></a></p>
        </div></li>); })}</ol>
    <p className="text-xs text-muted-foreground mt-8">{t(p.disclaimer)}</p>
  </div>);
}
