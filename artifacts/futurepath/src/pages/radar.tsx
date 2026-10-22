import { Link } from 'wouter';
import { RefreshCw, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter, Empty, fmt } from '@/components/bits';
export default function Radar() {
  const { signals, refresh, catalog, skillName } = useFP();
  const s = signals.data;
  return (<div>
    <Head kicker="Signal radar" title="What public job posts mention" sub="Scores are keyword mention share across a sample of postings. They are not growth rates." />
    <p className="text-sm text-muted-foreground mb-4">For wider official context, see the <Link href="/global-skills-tracker" className="underline" data-testid="link-radar-tracker">Global Skills Tracker</Link>. It is external and does not feed these scores.</p>
    <button onClick={() => refresh.mutate()} disabled={refresh.isPending} data-testid="button-refresh" className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-60"><RefreshCw size={15} className={refresh.isPending ? 'animate-spin' : ''} />{refresh.isPending ? 'Refreshing' : 'Refresh signals'}</button>
    {refresh.isError && <div className="mb-4"><ErrorBox msg="Refresh failed. Showing previous data." /></div>}
    {signals.isLoading ? <Skel n={4} h="h-14" /> : signals.isError || !s ? <ErrorBox msg="Signals could not be loaded." retry={() => signals.refetch()} /> : (<div className="space-y-8">
      <div className="rounded-xl border bg-card p-5 text-sm" data-testid="card-signal-status">
        <span className={`font-mono text-xs uppercase px-2 py-1 rounded ${s.status === 'live' ? 'bg-accent text-accent-foreground' : s.status === 'cached' ? 'bg-secondary' : 'bg-destructive text-destructive-foreground'}`}>{s.status}</span>
        <span className="ml-3">Source: <a className="underline" href={s.sourceUrl} target="_blank" rel="noreferrer">{s.sourceName}</a>, {s.totalJobs} postings, fetched {fmt(s.fetchedAt)}</span>
        {s.warning && <p className="mt-2 text-muted-foreground">{s.warning}</p>}
        <p className="mt-2 text-xs text-muted-foreground">{s.methodology}</p>
      </div>
      <section><h2 className="font-display text-2xl mb-4">Skill mention share</h2>
        {s.demand.length === 0 ? <Empty title="No demand data" body="The feed returned nothing usable. Try refreshing later." /> : <div className="space-y-3">{[...s.demand].sort((a, b) => b.share - a.share).map((d) => (<div key={d.skillId} data-testid={`row-demand-${d.skillId}`}><div className="flex justify-between text-sm"><span>{skillName(d.skillId)}</span><span className="font-mono">{d.share.toFixed(1)}% , {d.mentions} mentions</span></div><Meter v={d.share} color="bg-accent" /></div>))}</div>}</section>
      <section><h2 className="font-display text-2xl mb-1">Curated role outlook</h2><p className="text-sm text-muted-foreground mb-4">Rising and declining labels are editorially curated, separate from the posting feed.</p>
        <div className="grid md:grid-cols-2 gap-3">{catalog.data?.roles.map((r) => (<a key={r.id} href={r.sourceUrl} target="_blank" rel="noreferrer" className="lift rounded-xl border bg-card p-4 flex gap-3" data-testid={`card-outlook-${r.id}`}>{r.outlook === 'rising' ? <TrendingUp className="text-accent shrink-0" /> : <TrendingDown className="text-primary shrink-0" />}<div><b>{r.title}</b> <span className="text-xs font-mono uppercase text-muted-foreground">{r.outlook}, curated</span><p className="text-sm text-muted-foreground">{r.description}</p></div></a>))}</div></section>
      <section><h2 className="font-display text-2xl mb-4">Recent postings</h2>
        {s.signals.length === 0 ? <Empty title="No postings" body="No postings available right now." /> : <ul className="divide-y rounded-xl border bg-card">{s.signals.map((p) => (<li key={p.id} className="p-4 flex justify-between gap-3" data-testid={`row-signal-${p.id}`}><div><a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:underline inline-flex gap-1 items-center">{p.title}<ExternalLink size={12} /></a><p className="text-xs text-muted-foreground">{p.source}, {fmt(p.publishedAt)}, {p.skills.map(skillName).join(', ')}</p></div></li>))}</ul>}</section>
    </div>)}
  </div>);
}
