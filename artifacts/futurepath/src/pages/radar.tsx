import { useState } from 'react';
import { Link } from 'wouter';
import { RefreshCw, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox, Meter, Empty } from '@/components/bits';
import { JourneyRail, Explain, Fact, NextStep } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
import { signalWarning } from '@/lib/i18n/career-text';
const STATUS: Record<string, string> = { live: 'Live: fetched from the source for this snapshot.', cached: 'Cached: a saved snapshot is shown. It may be older if a refresh failed; check the fetch date.', unavailable: 'Unavailable: the source could not be reached, so demand is left out of scores.' };
export default function Radar() {
  const { t, date } = useLanguage();
  const { signals, refresh, catalog, skillName } = useFP();
  const s = signals.data;
  const [before, setBefore] = useState<string | null>(null);
  const doRefresh = () => { setBefore(s?.fetchedAt ?? ''); refresh.mutate(); };
  const result = refresh.isSuccess && refresh.data && before !== null
    ? refresh.data.status === 'unavailable' ? 'unavailable' : refresh.data.fetchedAt !== before ? 'new' : 'same'
    : null;
  return (<div>
    <Head kicker="Signal radar" title="What public job posts mention" sub="Scores are keyword mention share across a sample of postings. They are not growth rates." />
    <JourneyRail current="radar" />
    <div className="mb-6 grid gap-3 md:grid-cols-2">
      <Explain title="What is this evidence?" testId="explain-radar-source" defaultOpen>
        <Fact label="Source:">{t('a dated sample of global remote job posts from Remotive. It is not Malaysian market statistics and does not measure growth.')}</Fact>
        <Fact label="Mention share:">{t('the percentage of sampled posts whose text mentions a skill\'s keywords.')}</Fact>
        <Fact label="Used for:">{t('the posting-demand part of each role score on Role matches.')}</Fact>
      </Explain>
      <Explain title="What does Refresh do?" testId="explain-radar-refresh">
        <p>{t('Refresh asks for a new snapshot when the cache rules allow it: snapshots are reused for up to 6 hours and manual refresh has a 1-minute cooldown. A click may return the same snapshot.')}</p>
        <p>{t('There is no continuous background monitoring. When a new snapshot does arrive, role matches are recalculated and your chosen learning steps are reordered; completed steps are kept.')}</p>
      </Explain>
    </div>
    <p className="text-sm text-muted-foreground mb-4">{t('For wider official context, see the')} <Link href="/global-skills-tracker" className="underline" data-testid="link-radar-tracker">{t('Global Skills Tracker')}</Link>{t('. It is external and does not feed these scores.')}</p>
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <button onClick={doRefresh} disabled={refresh.isPending} data-testid="button-refresh" className="btn-primary disabled:opacity-60"><RefreshCw size={15} className={refresh.isPending ? 'animate-spin motion-reduce:animate-none' : ''} aria-hidden="true" />{t(refresh.isPending ? 'Refreshing' : 'Refresh signals')}</button>
      <span role="status" aria-live="polite" className="text-sm text-muted-foreground" data-testid="text-refresh-result">{refresh.isPending ? t('Checking for a newer snapshot') : result === 'new' ? t('New snapshot received. Matches will be recalculated.') : result === 'same' ? t('No newer snapshot was returned. Check the fetch date and source status below.') : result === 'unavailable' ? t('Source unavailable. No new job-posting data was received.') : ''}</span>
    </div>
    {refresh.isError && <div className="mb-4"><ErrorBox msg="Refresh failed. Showing previous data." /></div>}
    {signals.isLoading ? <Skel n={4} h="h-14" /> : signals.isError || !s ? <ErrorBox msg="Signals could not be loaded." retry={() => signals.refetch()} /> : (<div className="space-y-8">
      <div className="rounded-2xl border bg-card shadow-sm p-5 text-sm" data-testid="card-signal-status">
        <span className={`font-mono text-xs uppercase px-2 py-1 rounded ${s.status === 'live' ? 'bg-accent text-accent-foreground' : s.status === 'cached' ? 'bg-secondary' : 'bg-destructive text-destructive-foreground'}`}>{t(s.status)}</span>
        <span className="ml-3">{t('Source:')} <a className="underline" href={s.sourceUrl} target="_blank" rel="noreferrer">{s.sourceName}</a>, {t('{count} postings, fetched {date}', { count: s.totalJobs, date: date(s.fetchedAt) })}</span>
        <p className="mt-2 text-xs text-muted-foreground" data-testid="text-status-meaning">{t(STATUS[s.status] ?? '')}</p>
        {s.warning && <p className="mt-2 text-muted-foreground">{signalWarning(s.warning, t)}</p>}
        <p className="mt-2 text-xs text-muted-foreground">{t(s.methodology)}</p>
      </div>
      <section><h2 className="font-display text-2xl mb-1">{t('Skill mention share')}</h2><p className="text-sm text-muted-foreground mb-4">{t('Observed evidence. Longer bars mean more sampled posts mention that skill.')}</p>
        {s.demand.length === 0 ? <Empty title="No demand data" body="The feed returned nothing usable. Try refreshing later." /> : <div className="space-y-3">{[...s.demand].sort((a, b) => b.share - a.share).map((d) => (<div key={d.skillId} data-testid={`row-demand-${d.skillId}`}><div className="flex flex-wrap justify-between gap-2 text-sm"><span>{skillName(d.skillId)}</span><span className="font-mono">{t('{share}% , {count} mentions', { share: d.share.toFixed(1), count: d.mentions })}</span></div><Meter v={d.share} color="bg-accent" /></div>))}</div>}</section>
      <section><h2 className="font-display text-2xl mb-1">{t('Curated role outlook')}</h2><p className="text-sm text-muted-foreground mb-4">{t('Rising and declining labels are editorially curated, separate from the posting feed.')}</p>
        <div className="grid md:grid-cols-2 gap-3">{catalog.data?.roles.map((r) => (<a key={r.id} href={r.sourceUrl} target="_blank" rel="noreferrer" className="lift rounded-2xl border bg-card shadow-sm p-4 flex gap-3" data-testid={`card-outlook-${r.id}`}>{r.outlook === 'rising' ? <TrendingUp className="text-accent shrink-0" aria-hidden="true" /> : <TrendingDown className="text-primary shrink-0" aria-hidden="true" />}<div><b>{t(r.title)}</b> <span className="text-xs font-mono uppercase text-muted-foreground">{t(r.outlook)}, {t('curated')}</span><p className="text-sm text-muted-foreground">{t(r.description)}</p></div></a>))}</div></section>
      <section><h2 className="font-display text-2xl mb-1">{t('Recent postings')}</h2><p className="text-sm text-muted-foreground mb-4">{t('Original post titles, sources and dates, so you can check the evidence yourself.')}</p>
        {s.signals.length === 0 ? <Empty title="No postings" body="No postings available right now." /> : <ul className="divide-y rounded-2xl border bg-card shadow-sm">{s.signals.map((p) => (<li key={p.id} className="p-4 flex justify-between gap-3" data-testid={`row-signal-${p.id}`}><div><a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:underline inline-flex gap-1 items-center" translate="no">{p.title}<ExternalLink size={12} aria-hidden="true" /></a><p className="text-xs text-muted-foreground">{p.source}, {date(p.publishedAt)}, {p.skills.map(skillName).join(', ')}</p></div></li>))}</ul>}</section>
    </div>)}
    <NextStep href="/matches" title="See how this evidence shapes your role matches" body="Each role score uses these mention shares as its demand part." testId="link-next-matches" back={{ href: '/profile', label: 'Back to profile' }} />
  </div>);
}
