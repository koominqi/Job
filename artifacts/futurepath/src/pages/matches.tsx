import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter, Empty } from '@/components/bits';
export default function Matches() {
  const { match, profile, skillName, selectRole, path, roleId } = useFP();
  const [open, setOpen] = useState<string | null>(null);
  const [, nav] = useLocation();
  const ms = match.data?.matches ?? [];
  return (<div>
    <Head kicker="Role matches" title="Ranked, with the working shown" sub={`Scenario: ${profile.scenario}. Score blends skill readiness, interest fit and posting demand using fixed rules. No LLM is involved.`} />
    {match.isError ? <ErrorBox msg="Matching failed." retry={() => match.mutate({ data: profile })} /> : match.isPending && !match.data ? <Skel n={5} /> : ms.length === 0 ? <Empty title="No matches yet" body="Add some skills in your profile." /> : (<div className="space-y-3">
      {ms.map((m, i) => { const o = open === m.role.id; return (
        <div key={m.role.id} className="rounded-xl border bg-card rise" style={{ animationDelay: `${i * 50}ms` }} data-testid={`card-role-${m.role.id}`}>
          <button onClick={() => setOpen(o ? null : m.role.id)} className="w-full p-5 flex items-center gap-4 text-left" data-testid={`button-expand-${m.role.id}`}>
            <span className="font-display text-3xl text-primary w-10">{i + 1}</span>
            <div className="flex-1"><div className="flex justify-between"><b>{m.role.title}</b><span className="font-mono">{Math.round(m.score)}</span></div><Meter v={m.score} /><p className="text-xs text-muted-foreground mt-1">{m.role.sector}, outlook {m.role.outlook} (curated)</p></div>
            <ChevronDown className={`transition-transform ${o ? 'rotate-180' : ''}`} />
          </button>
          {o && (<div className="px-5 pb-5 space-y-4 border-t pt-4">
            <p className="text-sm">{m.explanation}</p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono">{[['Readiness', m.readinessScore], ['Interest', m.interestScore], ['Demand', m.demandScore]].map(([l, v]) => (<div key={l as string}>{l} {Math.round(v as number)}<Meter v={v as number} color="bg-accent" /></div>))}</div>
            <div className="text-sm"><b>You have:</b> {m.matchedSkills.map(skillName).join(', ') || 'none yet'}</div>
            <div className="text-sm"><b>Gaps:</b> {m.missingSkills.map(skillName).join(', ') || 'none'}</div>
            <p className="text-xs text-muted-foreground">{m.role.impact} <a className="underline" href={m.role.sourceUrl} target="_blank" rel="noreferrer">Role reference</a></p>
            <button disabled={path.isPending} onClick={() => selectRole(m.role.id, () => nav('/pathway'))} data-testid={`button-choose-${m.role.id}`} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm inline-flex gap-2 items-center">{path.isPending && <Loader2 size={14} className="animate-spin" />}{roleId === m.role.id ? 'Rebuild pathway' : 'Build pathway for this role'}</button>
            {path.isError && <ErrorBox msg="Could not build the pathway." />}
          </div>)}
        </div>); })}
      <p className="text-xs text-muted-foreground pt-3">{match.data?.methodology} Signal status: {match.data?.signalStatus}. Estimates, not factual forecasts.</p>
    </div>)}
  </div>);
}
