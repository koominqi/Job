import { Link } from 'wouter';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import { JourneyRail, Explain, Fact, NextStep } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
export default function Impact() {
  const { t } = useLanguage();
  const { catalog, pathway, skillName } = useFP();
  const c = catalog.data;
  const mine = new Set(pathway?.role.sdgs ?? []);
  const stepSkills = pathway ? Array.from(new Set(pathway.steps.map((s) => s.skillId))) : [];
  return (<div>
    <Head kicker="Impact" title="Work that connects to the 17 goals" sub="Links are editorial mappings from roles and skills to UN Sustainable Development Goals, not measured outcomes." />
    <JourneyRail current="impact" />
    <div className="mb-6"><Explain title="How to read these links" testId="explain-impact">
      <Fact label="Possible contribution:">{t('a role or skill is linked to a goal when that work could support it. It is not a verified or measured impact.')}</Fact>
      <Fact label="Highlighted cards:">{t('goals linked to your chosen role. Each card opens the official UN page.')}</Fact>
    </Explain></div>
    {catalog.isLoading ? <Skel n={4} /> : catalog.isError || !c ? <ErrorBox msg="Goals unavailable." retry={() => catalog.refetch()} /> : (<>
      {pathway ? (<section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm" data-testid="card-my-impact">
        <h2 className="font-display text-xl">{t('Your chosen role: {role}', { role: t(pathway.role.title) })}</h2>
        <p className="mt-1 text-sm" data-testid="text-role-sdgs">{t('Your chosen role, {role}: {impact}', { role: t(pathway.role.title), impact: t(pathway.role.impact) })}</p>
        <div className="mt-3 flex flex-wrap gap-2">{c.sdgs.filter((g) => mine.has(g.id)).map((g) => <span key={g.id} className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: g.color }}>{g.id}. {t(g.title)}</span>)}</div>
        {stepSkills.length > 0 && <div className="mt-4"><p className="text-sm font-medium">{t('Skills in your pathway and their possible goals')}</p>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">{stepSkills.map((id) => { const sk = c.skills.find((s) => s.id === id); return <li key={id} data-testid={`row-skill-sdg-${id}`}><b className="font-medium">{skillName(id)}</b>: <span className="text-muted-foreground">{sk?.sdgs.length ? sk.sdgs.map((n) => `SDG ${n}`).join(', ') : t('none')}</span></li>; })}</ul></div>}
      </section>) : <p className="mb-6 rounded-xl border border-dashed p-4 text-sm text-muted-foreground" data-testid="text-no-role">{t('Choose a role on Role matches to highlight its goals here.')} <Link href="/matches" className="underline" data-testid="link-impact-matches">{t('Go to matches')}</Link></p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{c.sdgs.map((g) => {
        const roles = c.roles.filter((r) => r.sdgs.includes(g.id)); const skills = c.skills.filter((s) => s.sdgs.includes(g.id));
        return (<a key={g.id} href={g.url} target="_blank" rel="noreferrer" data-testid={`card-sdg-${g.id}`} aria-label={`${g.id}. ${t(g.title)}${mine.has(g.id) ? ` (${t('linked to your chosen role')})` : ''}`} className={`lift rounded-xl p-4 text-white min-h-40 flex flex-col justify-between ${mine.has(g.id) ? 'ring-4 ring-foreground' : ''}`} style={{ background: g.color }}>
          <div><span className="font-display text-5xl font-semibold">{g.id}</span>{mine.has(g.id) && <span className="ml-2 rounded-full bg-black/25 px-2 py-0.5 text-[11px] align-top">{t('Your role')}</span>}<h3 className="font-medium leading-tight mt-1">{t(g.title)}</h3></div>
          <p className="text-xs opacity-90 mt-3">{roles.length ? roles.map((r) => t(r.title)).join(', ') : t('No curated role link yet')}{skills.length ? `. ${t('Skills:')} ${skills.map((s) => t(s.name)).join(', ')}` : ''}</p></a>); })}</div></>)}
    <NextStep href={pathway ? '/pathway' : '/matches'} title={pathway ? 'Keep going with your next learning step' : 'Pick a role to see its goals'} body="Small, steady steps add up. Your progress stays in this browser." testId="link-next-from-impact" back={{ href: '/global-skills-tracker', label: 'Wider context: Global Skills Tracker' }} />
  </div>);
}
