import { Link } from 'wouter';
import { Check, ExternalLink } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Empty, Meter, Skel, ErrorBox } from '@/components/bits';
export default function Pathway() {
  const { pathway: p, done, toggle, path, roleId, selectRole, skillName } = useFP();
  if (path.isPending) return <div><Head kicker="Pathway" title="Building your plan" /><Skel n={4} /></div>;
  if (path.isError && roleId) return <div><Head kicker="Pathway" title="Plan unavailable" /><ErrorBox msg="Pathway could not be generated." retry={() => selectRole(roleId)} /></div>;
  if (!p) return <div><Head kicker="Pathway" title="No pathway yet" /><Empty title="Choose a role first" body="Your ordered learning plan appears here once you pick a role."><Link href="/matches" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm" data-testid="link-go-matches">Go to matches</Link></Empty></div>;
  const pct = Math.round((done.length / Math.max(1, p.steps.length)) * 100);
  return (<div>
    <Head kicker="Pathway" title={p.role.title} sub={p.summary} />
    <div className="rounded-xl border bg-card p-5 mb-8"><div className="flex justify-between text-sm mb-2"><span data-testid="text-progress">{done.length} of {p.steps.length} steps, {pct}%</span><span className="font-mono">{p.totalHours}h over {p.totalWeeks} weeks</span></div><Meter v={pct} color="bg-accent" /></div>
    <ol className="relative border-l-2 border-primary/30 ml-3 space-y-5">{p.steps.map((s, i) => { const d = done.includes(s.id); return (
      <li key={s.id} className="pl-6 relative rise" style={{ animationDelay: `${i * 60}ms` }} data-testid={`step-${s.id}`}>
        <button onClick={() => toggle(s.id)} aria-label="toggle complete" data-testid={`button-toggle-${s.id}`} className={`absolute -left-[15px] top-4 size-7 rounded-full border-2 grid place-items-center transition-all ${d ? 'bg-accent border-accent text-accent-foreground scale-110' : 'bg-background border-primary hover:scale-110'}`}>{d && <Check size={14} />}</button>
        <div className={`rounded-xl border bg-card p-5 transition-opacity ${d ? 'opacity-60' : ''}`}>
          <p className="font-mono text-xs text-primary">WEEKS {s.weekStart}-{s.weekEnd}, {s.hours}H, {skillName(s.skillId)}</p>
          <h3 className={`font-display text-xl ${d ? 'line-through' : ''}`}>{s.title}</h3>
          <p className="text-sm text-muted-foreground">{s.outcome}</p>
          <p className="text-xs mt-2">{s.provider}, {s.cost}, SDG {s.sdgs.join(', ') || 'none'} <a href={s.url} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1 ml-2" data-testid={`link-course-${s.id}`}>Course <ExternalLink size={11} /></a></p>
        </div></li>); })}</ol>
    <p className="text-xs text-muted-foreground mt-8">{p.disclaimer}</p>
  </div>);
}
