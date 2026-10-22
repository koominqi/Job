import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter, LearningBadges, LearningProgress } from '@/components/bits';
import { useLanguage } from '@/lib/i18n';
import { matchExplanation } from '@/lib/i18n/career-text';
export default function Home() {
  const { t, date } = useLanguage();
  const { match, profile, pathway, done, toggle, signals, skillName, earnedBadges } = useFP();
  const top = match.data?.matches ?? [];
  const next = pathway?.steps.find((s) => !done.includes(s.id));
  const completed = pathway ? pathway.steps.filter((step) => done.includes(step.id)).length : 0;
  const lead = top[0];
  return (<div>
    <Head kicker="Overview" title="Hello Alex. Here is where you stand." sub="Alex is a clearly labelled synthetic profile. Edit it in Profile to see your own picture." />
    {match.isError ? <ErrorBox msg="Could not calculate role matches." retry={() => match.mutate({ data: profile })} /> : !lead ? <Skel n={2} h="h-40" /> : (
      <div className="grid md:grid-cols-5 gap-5">
        <section className="md:col-span-3 rounded-3xl bg-sidebar text-sidebar-foreground p-8 md:p-10 rise shadow-sm" data-testid="card-readiness">
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">{t('Closest role today')}</p>
          <h2 className="font-display text-4xl mt-2">{t(lead.role.title)}</h2>
          <div className="flex items-end gap-6 mt-6"><div className="font-display text-7xl text-sidebar-primary" data-testid="text-readiness">{Math.round(lead.readinessScore)}<span className="text-2xl">%</span></div><p className="text-sm opacity-80 pb-3">{t('skill readiness, {score} overall match score', { score: Math.round(lead.score) })}</p></div>
          <p className="text-sm opacity-80 mt-4">{matchExplanation(lead.explanation, t)}</p>
        </section>
        <section className="md:col-span-2 rounded-3xl border bg-card p-6 md:p-8 rise shadow-sm" style={{ animationDelay: '.1s' }} data-testid="card-next">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">{t('Next action')}</p>
          {next ? (<><h3 className="font-display text-2xl mt-2" translate="no">{next.title}</h3><p className="text-sm text-muted-foreground mt-1">{t('{hours}h, weeks {start}-{end}, {provider}', { hours: next.hours, start: next.weekStart, end: next.weekEnd, provider: next.provider })}</p>
            <div className="flex gap-2 mt-4 flex-wrap"><a href={next.url} target="_blank" rel="noreferrer" className="btn-primary" data-testid="link-next-course">{t('Open course')}</a><button onClick={() => toggle(next.id)} className="btn-quiet" data-testid="button-next-done">{t('Mark done')}</button></div>
            {pathway && <LearningProgress compact completed={completed} total={pathway.steps.length} hours={pathway.totalHours} weeks={pathway.totalWeeks} />}</>)
          : pathway ? <LearningProgress compact completed={completed} total={pathway.steps.length} hours={pathway.totalHours} weeks={pathway.totalWeeks} />
          : (<><h3 className="font-display text-2xl mt-2">{t('Pick a role to start')}</h3><p className="text-sm text-muted-foreground mt-1">{t('Choose from your matches and we will build an ordered plan.')}</p><Link href="/matches" className="btn-primary mt-4" data-testid="link-see-matches">{t('See matches')} <ArrowRight size={14} /></Link></>)}
        </section>
        <section className="md:col-span-5 rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
          <h3 className="font-display text-xl mb-4">{t('Top matches')}</h3>
          <div className="grid md:grid-cols-3 gap-4">{top.slice(0, 3).map((m) => (<Link key={m.role.id} href="/matches" className="lift block rounded-2xl border bg-background/60 p-4" data-testid={`card-match-${m.role.id}`}><div className="flex justify-between gap-2"><b>{t(m.role.title)}</b><span className="font-mono text-sm">{Math.round(m.score)}</span></div><Meter v={m.score} /><p className="text-xs text-muted-foreground mt-2">{t('Missing:')} {m.missingSkills.slice(0, 3).map(skillName).join(', ') || t('none')}</p></Link>))}</div>
        </section>
        {pathway && <div className="md:col-span-5"><LearningBadges earned={earnedBadges} completed={completed} total={pathway.steps.length} /></div>}
        <p className="md:col-span-5 text-sm text-muted-foreground">{t('Want wider context?')} <Link href="/global-skills-tracker" className="underline" data-testid="link-home-tracker">{t('Explore the Global Skills Tracker')}</Link> {t('(external UNESCO-UNEVOC source, not part of your scores).')}</p>
        <p className="md:col-span-5 text-xs text-muted-foreground" data-testid="text-signal-status">{t('Signals:')} {signals.data ? `${t(signals.data.status)}, ${t('fetched')} ${date(signals.data.fetchedAt)}` : t('loading')}. {t(match.data?.methodology ?? '')}</p>
      </div>)}
  </div>);
}
