import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter } from '@/components/bits';
export default function Home() {
  const { match, profile, pathway, done, toggle, signals, skillName } = useFP();
  const top = match.data?.matches ?? [];
  const next = pathway?.steps.find((s) => !done.includes(s.id));
  const pct = pathway ? Math.round((done.length / Math.max(1, pathway.steps.length)) * 100) : 0;
  const lead = top[0];
  return (<div>
    <Head kicker="Overview" title="Hello Alex. Here is where you stand." sub="Alex is a clearly labelled synthetic profile. Edit it in Profile to see your own picture." />
    {match.isError ? <ErrorBox msg="Could not calculate role matches." retry={() => match.mutate({ data: profile })} /> : !lead ? <Skel n={2} h="h-40" /> : (
      <div className="grid md:grid-cols-5 gap-5">
        <section className="md:col-span-3 rounded-2xl bg-sidebar text-sidebar-foreground p-8 rise" data-testid="card-readiness">
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">Closest role today</p>
          <h2 className="font-display text-4xl mt-2">{lead.role.title}</h2>
          <div className="flex items-end gap-6 mt-6"><div className="font-display text-7xl text-primary" data-testid="text-readiness">{Math.round(lead.readinessScore)}<span className="text-2xl">%</span></div><p className="text-sm opacity-80 pb-3">skill readiness, {Math.round(lead.score)} overall match score</p></div>
          <p className="text-sm opacity-80 mt-4">{lead.explanation}</p>
        </section>
        <section className="md:col-span-2 rounded-2xl border bg-card p-6 rise" style={{ animationDelay: '.1s' }} data-testid="card-next">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Next action</p>
          {next ? (<><h3 className="font-display text-2xl mt-2">{next.title}</h3><p className="text-sm text-muted-foreground mt-1">{next.hours}h, weeks {next.weekStart}-{next.weekEnd}, {next.provider}</p>
            <div className="flex gap-2 mt-4 flex-wrap"><a href={next.url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm" data-testid="link-next-course">Open course</a><button onClick={() => toggle(next.id)} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="button-next-done">Mark done</button></div>
            <div className="mt-5"><Meter v={pct} /><p className="text-xs mt-1 text-muted-foreground">{pct}% of pathway</p></div></>)
          : pathway ? <p className="mt-2">Pathway complete. Well done.</p>
          : (<><h3 className="font-display text-2xl mt-2">Pick a role to start</h3><p className="text-sm text-muted-foreground mt-1">Choose from your matches and we will build an ordered plan.</p><Link href="/matches" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm" data-testid="link-see-matches">See matches <ArrowRight size={14} /></Link></>)}
        </section>
        <section className="md:col-span-5 rounded-2xl border bg-card p-6">
          <h3 className="font-display text-xl mb-4">Top matches</h3>
          <div className="grid md:grid-cols-3 gap-4">{top.slice(0, 3).map((m) => (<Link key={m.role.id} href="/matches" className="lift block rounded-xl border p-4" data-testid={`card-match-${m.role.id}`}><div className="flex justify-between"><b>{m.role.title}</b><span className="font-mono text-sm">{Math.round(m.score)}</span></div><Meter v={m.score} /><p className="text-xs text-muted-foreground mt-2">Missing: {m.missingSkills.slice(0, 3).map(skillName).join(', ') || 'none'}</p></Link>))}</div>
        </section>
        <p className="md:col-span-5 text-sm text-muted-foreground">Want wider context? <Link href="/global-skills-tracker" className="underline" data-testid="link-home-tracker">Explore the Global Skills Tracker</Link> (external UNESCO-UNEVOC source, not part of your scores).</p>
        <p className="md:col-span-5 text-xs text-muted-foreground" data-testid="text-signal-status">Signals: {signals.data ? `${signals.data.status}, fetched ${signals.data.fetchedAt}` : 'loading'}. {match.data?.methodology}</p>
      </div>)}
  </div>);
}
