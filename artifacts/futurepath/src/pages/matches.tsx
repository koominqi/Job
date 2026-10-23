import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { matchCareerRoles } from '@workspace/api-client-react';
import { ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter, Empty } from '@/components/bits';
import { JourneyRail, Explain, Fact, NextStep } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
import { matchExplanation } from '@/lib/i18n/career-text';
export default function Matches() {
  const { t, date } = useLanguage();
  const { match, profile, skillName, selectRole, path, roleId, signals, pathway } = useFP();
  const [open, setOpen] = useState<string | null>(null);
  const scenarioComparison = useMutation({
    mutationFn: async () => {
      const [moderate, fast] = await Promise.all([
        matchCareerRoles({ ...profile, scenario: 'moderate' }),
        matchCareerRoles({ ...profile, scenario: 'fast' }),
      ]);
      return { moderate, fast, fetchedAt: signals.data?.fetchedAt ?? '' };
    },
  });
  const comparisonIsStale = Boolean(scenarioComparison.data && scenarioComparison.data.fetchedAt !== (signals.data?.fetchedAt ?? ''));
  const [, nav] = useLocation();
  const ms = match.data?.matches ?? [];
  const feedOff = match.data?.signalStatus === 'unavailable';
  const postings = signals.data?.signals ?? [];
  return (<div>
    <Head kicker="Role matches" title="Ranked, with the working shown" sub={t('Scenario: {scenario}. Score blends skill readiness, interest fit and posting demand using fixed rules. No LLM is involved.', { scenario: t(profile.scenario) })} />
    <JourneyRail current="matches" />
    <div className="mb-6 grid gap-3 md:grid-cols-2">
      <Explain title="How to read a score" testId="explain-score" defaultOpen>
        <Fact label="Out of 100.">{t('A higher score means a closer fit with your selected skills and interests. It is a planning aid, not your chance of being hired.')}</Fact>
        <Fact label="Readiness:">{t('the share of the role\'s listed skills you selected.')}</Fact>
        <Fact label="Interest fit:">{t('100 if the role\'s sector is one you picked, otherwise 0.')}</Fact>
        <Fact label="Posting demand:">{t('the average mention share of the role\'s skills in the dated job-posting sample.')}</Fact>
      </Explain>
      <Explain title="Evidence, outlook and assumptions" testId="explain-evidence">
        <Fact label="Observed evidence:">{t('posting demand comes from a dated global remote-job sample (Remotive), not Malaysian market statistics or measured growth.')}</Fact>
        <Fact label="Editorial outlook:">{t('rising or declining labels are curated by FuturePath with a role reference link.')}</Fact>
        <Fact label="Scenario assumption:">{t('roles with a declining outlook lose 8 points (moderate) or 18 points (fast). These penalties are illustrative.')}</Fact>
        <Fact label="If the feed is unavailable:">{t('scores use 85% readiness + 15% interest and leave demand out.')}</Fact>
      </Explain>
    </div>
    {feedOff && <p role="status" className="mb-4 rounded-xl border border-accent/50 bg-accent/10 p-3 text-sm" data-testid="text-feed-unavailable">{t('No posting data right now: scores use 85% readiness + 15% interest, with demand excluded.')}</p>}
    {match.isError ? <ErrorBox msg="Matching failed." retry={() => match.mutate({ data: profile })} /> : match.isPending && !match.data ? <Skel n={5} /> : ms.length === 0 ? <Empty title="No matches yet" body="Add some skills in your profile." /> : (<div className="space-y-3">
      <section className="rounded-2xl border bg-card shadow-sm p-5" data-testid="card-scenario-comparison" aria-labelledby="scenario-comparison-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <h2 id="scenario-comparison-heading" className="font-display text-xl">{t('Compare both AI-change scenarios')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('Scenario scores are estimates, not forecasts. They use the dated Remotive posting snapshot and stated scoring assumptions.')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('This runs your saved profile under both assumptions side by side. It does not change your saved scenario.')}</p>
          </div>
          <button disabled={scenarioComparison.isPending} onClick={() => scenarioComparison.mutate()} className="btn-primary shrink-0 disabled:opacity-60" data-testid="button-compare-scenarios">
            {scenarioComparison.isPending && <Loader2 size={15} className="animate-spin" />}
            {t(scenarioComparison.isPending ? 'Comparing' : 'Compare scenarios')}
          </button>
        </div>
        {scenarioComparison.isError && <p role="alert" className="mt-3 text-sm text-destructive">{t('Scenario comparison failed.')}</p>}
        {comparisonIsStale && <p role="status" className="mt-3 text-sm text-muted-foreground">{t('The posting snapshot changed. Compare again for current data.')}</p>}
        <p className="mt-2 text-xs text-muted-foreground">{t('The job-posting sample does not measure future AI disruption. No single result is guaranteed.')}</p>
        {scenarioComparison.data && !comparisonIsStale && <div className="mt-4">
          <p className="mb-3 text-sm font-medium">{t('Top role matches under each assumption')} {scenarioComparison.data.fetchedAt && <span className="font-normal text-muted-foreground">({date(scenarioComparison.data.fetchedAt)})</span>}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {(['moderate', 'fast'] as const).map((scenario) => (
              <section key={scenario} aria-label={t(scenario)} className="rounded-xl border bg-background/60 p-4" data-testid={`card-compare-${scenario}`}>
                <h3 className="font-semibold">{t(scenario === 'fast' ? 'Fast AI change' : 'Moderate change')} {profile.scenario === scenario && <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{t('your saved scenario')}</span>}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{scenarioComparison.data[scenario].signalStatus === 'unavailable' ? t('No posting data: scores use 85% skills + 15% interest; the decline adjustment remains an illustrative assumption.') : t(scenario === 'fast' ? 'Weights: 55% skills + 15% interest + 30% posting demand; 18-point illustrative decline penalty.' : 'Weights: 65% skills + 15% interest + 20% posting demand; 8-point illustrative decline penalty.')}</p>
                <p className="mt-2 text-xs font-medium">{t('Estimated match score (out of 100)')}</p>
                <ol className="mt-2 space-y-2">{scenarioComparison.data[scenario].matches.slice(0, 3).map((item, index) => (
                  <li key={item.role.id} className="flex items-start justify-between gap-3 border-t pt-2 text-sm">
                    <span className="min-w-0"><span className="mr-2 font-mono text-primary">{index + 1}.</span>{t(item.role.title)}</span>
                    <span className="shrink-0 font-mono">{Math.round(item.score)} / 100</span>
                  </li>
                ))}</ol>
              </section>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t('If the order differs, the gap reflects the weighting assumption, not a prediction of which role will grow.')}</p>
        </div>}
      </section>
      <p className="pt-2 text-sm text-muted-foreground">{t('Open a role to see your skills, gaps and the job posts behind its demand score. Then build a pathway for it.')}</p>
      {ms.map((m, i) => { const o = open === m.role.id; const ev = postings.filter((p) => m.signalIds.includes(p.id)); const chosen = roleId === m.role.id; const viewExisting = chosen && pathway?.role.id === m.role.id; return (
        <div key={m.role.id} className={`rounded-2xl border bg-card shadow-sm rise ${chosen ? 'border-primary/60' : ''}`} style={{ animationDelay: `${i * 50}ms` }} data-testid={`card-role-${m.role.id}`}>
          <button onClick={() => setOpen(o ? null : m.role.id)} aria-expanded={o} aria-controls={`role-panel-${m.role.id}`} className="w-full p-5 flex items-center gap-4 text-left" data-testid={`button-expand-${m.role.id}`}>
            <span className="font-display text-3xl text-primary w-10">{i + 1}</span>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><b>{t(m.role.title)}{chosen && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{t('Your chosen role')}</span>}</b><span className="font-mono shrink-0" aria-label={t('{score} out of 100', { score: Math.round(m.score) })}>{Math.round(m.score)}<span className="text-xs text-muted-foreground">/100</span></span></div><Meter v={m.score} /><p className="text-xs text-muted-foreground mt-1">{t(m.role.sector)}, {t('outlook')} {t(m.role.outlook)} ({t('curated')}) · {t('{have} of {total} skills', { have: m.matchedSkills.length, total: m.matchedSkills.length + m.missingSkills.length })}</p></div>
            <ChevronDown className={`shrink-0 transition-transform ${o ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {o && (<div id={`role-panel-${m.role.id}`} className="px-5 pb-5 space-y-4 border-t pt-4">
            <p className="text-sm">{t(m.role.description)}</p>
            <p className="text-sm rounded-lg bg-muted/50 p-3">{matchExplanation(m.explanation, t)}</p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">{([['Readiness', m.readinessScore, 'Skills you selected that this role lists'], ['Interest', m.interestScore, 'Is the sector one you picked?'], ['Demand', m.demandScore, feedOff ? 'Excluded: feed unavailable' : 'Mention share in dated postings']] as const).map(([l, v, h]) => (<div key={l} className="rounded-lg border p-3"><div className="flex justify-between font-mono"><span>{t(l)}</span><span>{Math.round(v)}</span></div><Meter v={v} color="bg-accent" /><p className="mt-1 text-muted-foreground">{t(h)}</p></div>))}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm"><b>{t('You have:')}</b> {m.matchedSkills.map(skillName).join(', ') || t('none yet')}</div>
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm"><b>{t('Gaps:')}</b> {m.missingSkills.map(skillName).join(', ') || t('none')}<p className="mt-1 text-xs text-muted-foreground">{t('Your pathway turns these gaps into learning steps.')}</p></div>
            </div>
            <div data-testid={`evidence-${m.role.id}`}>
              <p className="text-sm font-medium">{t('Job posts behind the demand score')}</p>
              {ev.length === 0 ? <p className="text-xs text-muted-foreground mt-1">{t('No matching posts in the current sample. No evidence is shown rather than guessed.')}</p> : <ul className="mt-1 space-y-1">{ev.map((p) => (<li key={p.id} className="text-xs"><a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium underline" translate="no" data-testid={`link-evidence-${p.id}`}>{p.title}<ExternalLink size={11} aria-hidden="true" /></a> <span className="text-muted-foreground">{p.source}, {date(p.publishedAt)}</span></li>))}</ul>}
              <p className="mt-2 text-xs text-muted-foreground">{t(m.role.impact)} <a className="underline" href={m.role.sourceUrl} target="_blank" rel="noreferrer" data-testid={`link-role-ref-${m.role.id}`}>{t('Role reference')}</a></p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button disabled={path.isPending} onClick={() => viewExisting ? nav('/pathway') : selectRole(m.role.id, () => nav('/pathway'))} data-testid={`button-choose-${m.role.id}`} className="btn-primary disabled:opacity-60">{path.isPending && <Loader2 size={14} className="animate-spin" />}{t(viewExisting ? 'View full pathway' : 'Build pathway for this role')}</button>
              {!viewExisting && <span className="text-xs text-muted-foreground">{t('Choosing a role resets completed steps for the previous plan.')}</span>}
            </div>
            {path.isError && <ErrorBox msg="Could not build the pathway." />}
          </div>)}
        </div>); })}
      <p className="text-xs text-muted-foreground pt-3">{t(match.data?.methodology ?? '')} {t('Signal status:')} {t(match.data?.signalStatus ?? '')}. {t('Estimates, not factual forecasts.')}</p>
    </div>)}
    {roleId ? <NextStep href="/pathway" title="Continue your learning pathway" body="Your chosen role already has an ordered, timed plan." testId="link-next-pathway" back={{ href: '/radar', label: 'Back to signals' }} />
      : <NextStep href="/profile" title="Not seeing a good fit?" body="Adjust your skills or interests, then come back. Or open a role above and build its pathway." testId="link-next-profile" back={{ href: '/radar', label: 'Back to signals' }} />}
  </div>);
}
