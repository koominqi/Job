import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { matchCareerRoles } from '@workspace/api-client-react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter, Empty } from '@/components/bits';
import { useLanguage } from '@/lib/i18n';
import { matchExplanation } from '@/lib/i18n/career-text';
export default function Matches() {
  const { t, date } = useLanguage();
  const { match, profile, skillName, selectRole, path, roleId, signals } = useFP();
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
  return (<div>
    <Head kicker="Role matches" title="Ranked, with the working shown" sub={t('Scenario: {scenario}. Score blends skill readiness, interest fit and posting demand using fixed rules. No LLM is involved.', { scenario: t(profile.scenario) })} />
    {match.isError ? <ErrorBox msg="Matching failed." retry={() => match.mutate({ data: profile })} /> : match.isPending && !match.data ? <Skel n={5} /> : ms.length === 0 ? <Empty title="No matches yet" body="Add some skills in your profile." /> : (<div className="space-y-3">
      <section className="rounded-2xl border bg-card shadow-sm p-5" data-testid="card-scenario-comparison" aria-labelledby="scenario-comparison-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <h2 id="scenario-comparison-heading" className="font-display text-xl">{t('Compare both AI-change scenarios')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('Scenario scores are estimates, not forecasts. They use the dated Remotive posting snapshot and stated scoring assumptions.')}</p>
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
              <section key={scenario} aria-label={t(scenario)} className="rounded-xl border bg-background/60 p-4">
                <h3 className="font-semibold">{t(scenario === 'fast' ? 'Fast AI change' : 'Moderate change')}</h3>
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
        </div>}
      </section>
      {ms.map((m, i) => { const o = open === m.role.id; return (
        <div key={m.role.id} className="rounded-2xl border bg-card shadow-sm rise" style={{ animationDelay: `${i * 50}ms` }} data-testid={`card-role-${m.role.id}`}>
          <button onClick={() => setOpen(o ? null : m.role.id)} aria-expanded={o} className="w-full p-5 flex items-center gap-4 text-left" data-testid={`button-expand-${m.role.id}`}>
            <span className="font-display text-3xl text-primary w-10">{i + 1}</span>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><b>{t(m.role.title)}</b><span className="font-mono">{Math.round(m.score)}</span></div><Meter v={m.score} /><p className="text-xs text-muted-foreground mt-1">{t(m.role.sector)}, {t('outlook')} {t(m.role.outlook)} ({t('curated')})</p></div>
            <ChevronDown className={`transition-transform ${o ? 'rotate-180' : ''}`} />
          </button>
          {o && (<div className="px-5 pb-5 space-y-4 border-t pt-4">
            <p className="text-sm">{matchExplanation(m.explanation, t)}</p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono">{[['Readiness', m.readinessScore], ['Interest', m.interestScore], ['Demand', m.demandScore]].map(([l, v]) => (<div key={l as string}>{t(l as string)} {Math.round(v as number)}<Meter v={v as number} color="bg-accent" /></div>))}</div>
            <div className="text-sm"><b>{t('You have:')}</b> {m.matchedSkills.map(skillName).join(', ') || t('none yet')}</div>
            <div className="text-sm"><b>{t('Gaps:')}</b> {m.missingSkills.map(skillName).join(', ') || t('none')}</div>
            <p className="text-xs text-muted-foreground">{t(m.role.impact)} <a className="underline" href={m.role.sourceUrl} target="_blank" rel="noreferrer">{t('Role reference')}</a></p>
            <button disabled={path.isPending} onClick={() => selectRole(m.role.id, () => nav('/pathway'))} data-testid={`button-choose-${m.role.id}`} className="btn-primary">{path.isPending && <Loader2 size={14} className="animate-spin" />}{t(roleId === m.role.id ? 'Rebuild pathway' : 'Build pathway for this role')}</button>
            {path.isError && <ErrorBox msg="Could not build the pathway." />}
          </div>)}
        </div>); })}
      <p className="text-xs text-muted-foreground pt-3">{t(match.data?.methodology ?? '')} {t('Signal status:')} {t(match.data?.signalStatus ?? '')}. {t('Estimates, not factual forecasts.')}</p>
    </div>)}
  </div>);
}
