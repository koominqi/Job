import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter } from '@/components/bits';
import { BadgeStrip } from '@/components/badges';
import { FAQ, Fact } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
export default function Home() {
  const { t, date } = useLanguage();
  const { match, profile, pathway, done, toggle, signals, skillName } = useFP();
  const top = match.data?.matches ?? [];
  const next = pathway?.steps.find((s) => !done.includes(s.id));
  const lead = top[0];
  return (<div>
    <Head kicker="Overview" title="Your career snapshot" sub="Based on a synthetic demo profile. Change it in Profile to explore other paths." />
    {match.isError ? <ErrorBox msg="Could not calculate role matches." retry={() => match.mutate({ data: profile })} /> : !lead ? <Skel n={2} h="h-40" /> : (
      <div className="grid md:grid-cols-5 gap-5">
        <section className="md:col-span-3 rounded-3xl bg-sidebar text-sidebar-foreground p-8 md:p-10 rise shadow-sm" data-testid="card-readiness">
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">{t('Closest role today')}</p>
          <h2 className="font-display text-4xl mt-2">{t(lead.role.title)}</h2>
          <div className="flex items-end gap-6 mt-6"><div className="font-display text-7xl text-sidebar-primary" data-testid="text-readiness">{Math.round(lead.readinessScore)}<span className="text-2xl">%</span></div><p className="text-sm opacity-80 pb-3">{t('skill readiness, {score} overall match score', { score: Math.round(lead.score) })}</p></div>
          <p className="text-xs opacity-75 mt-3">{t('Readiness is the share of this role\'s skills you selected. The match score is out of 100 and is not a chance of being hired.')}</p>
          <Link href="/matches" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sidebar-primary underline" data-testid="link-home-why">{t('See the full breakdown')} <ArrowRight size={14} aria-hidden="true" /></Link>
        </section>
        <section className="md:col-span-2 rounded-3xl border bg-card p-6 md:p-8 rise shadow-sm" style={{ animationDelay: '.1s' }} data-testid="card-next">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">{t('Next action')}</p>
          {next ? (<><h3 className="font-display text-2xl mt-2" translate="no">{next.title}</h3><p className="text-sm text-muted-foreground mt-1">{t('{hours}h, weeks {start}-{end}, {provider}', { hours: next.hours, start: next.weekStart, end: next.weekEnd, provider: next.provider })}</p>
            <div className="flex gap-2 mt-4 flex-wrap"><a href={next.url} target="_blank" rel="noreferrer" className="btn-primary" data-testid="link-next-course">{t('Open course')}</a><button onClick={() => toggle(next.id)} className="btn-quiet" data-testid="button-next-done">{t('Mark done')}</button><Link href="/pathway" className="btn-quiet" data-testid="link-home-pathway">{t('View full pathway')}</Link></div></>)
          : pathway ? <><h3 className="font-display text-2xl mt-2">{t(pathway.steps.length ? 'Pathway complete. Well done.' : 'Your profile already covers the mapped learning skills for this role.')}</h3><Link href="/impact" className="btn-quiet mt-4" data-testid="link-home-impact">{t('See SDG impact')}</Link></>
          : (<><h3 className="font-display text-2xl mt-2">{t('Pick a role to start')}</h3><p className="text-sm text-muted-foreground mt-1">{t('Choose from your matches and we will build an ordered plan.')}</p><Link href="/matches" className="btn-primary mt-4" data-testid="link-see-matches">{t('See matches')} <ArrowRight size={14} /></Link></>)}
          {pathway && <BadgeStrip steps={pathway.steps} done={done} />}
        </section>
        <section className="md:col-span-5 rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div><h3 className="font-display text-xl">{t('Top matches')}</h3><p className="text-sm text-muted-foreground">{t('Scores out of 100. Missing skills become steps in a pathway.')}</p></div>
            {signals.data && <p className="font-mono text-[11px] text-muted-foreground" data-testid="text-signal-status"><span translate="no">{signals.data.sourceName}</span> · {t('{count} postings, {date}', { count: signals.data.totalJobs, date: date(signals.data.fetchedAt) })}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-4">{top.slice(0, 3).map((m) => (<Link key={m.role.id} href="/matches" className="lift block rounded-2xl border bg-background/60 p-4" data-testid={`card-match-${m.role.id}`}><div className="flex justify-between gap-2"><b>{t(m.role.title)}</b><span className="font-mono text-sm">{Math.round(m.score)}</span></div><Meter v={m.score} /><p className="text-xs text-muted-foreground mt-2">{t('Missing:')} {m.missingSkills.slice(0, 3).map(skillName).join(', ') || t('none')}</p></Link>))}</div>
        </section>
      </div>)}
    <FAQ testId="faq-home" items={[
      { id: 'about', q: t('What is FuturePath?'), a: <p>{t('FuturePath is a demo for Malaysian working adults and graduates. It uses a synthetic person, dated public job posts and fixed, explainable rules. No language model or chatbot is involved, and nothing here is a hiring prediction.')}</p> },
      { id: 'data', q: t('What is real and what is synthetic?'), a: <>
        <Fact label="Synthetic:">{t('the starting profile. Please do not enter real personal data or CVs.')}</Fact>
        <Fact label="Public and dated:">{t('job posts from Remotive (a global remote sample), course links and UN goal pages.')}</Fact>
        <Fact label="Saved in this browser only:">{t('your profile, chosen pathway, completed steps and badges.')}</Fact>
        <Fact label="Sent for matching:">{t('selected skill IDs, sector interests, years of experience, weekly study hours and scenario.')}</Fact>
      </> },
      { id: 'wider', q: t('Where can I see wider official data?'), a: <p>{t('For wider official context, see the')} <Link href="/global-skills-tracker" className="underline" data-testid="link-home-tracker">{t('Global Skills Tracker')}</Link>{t('. It is external and does not feed these scores.')}</p> },
    ]} />
  </div>);
}
