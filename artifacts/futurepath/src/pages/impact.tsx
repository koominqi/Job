import { Link } from 'wouter';
import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import { FAQ, Fact, NextLink } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';
export default function Impact() {
  const { t } = useLanguage();
  const { catalog, pathway, skillName } = useFP();
  const c = catalog.data;
  const mine = new Set(pathway?.role.sdgs ?? []);
  const stepSkills = pathway ? Array.from(new Set(pathway.steps.map((s) => s.skillId))) : [];
  return (<div>
    <Head kicker="Impact" title="Work that connects to the 17 goals" sub="Possible contributions, mapped by FuturePath. Not measured outcomes." />
    {catalog.isLoading ? <Skel n={4} /> : catalog.isError || !c ? <ErrorBox msg="Goals unavailable." retry={() => catalog.refetch()} /> : (<>
      {pathway ? (<section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm" data-testid="card-my-impact">
        <h2 className="font-display text-xl">{t('Your chosen role: {role}', { role: t(pathway.role.title) })}</h2>
        <p className="mt-1 text-sm text-muted-foreground" data-testid="text-role-sdgs">{t(pathway.role.impact)}</p>
        <div className="mt-3 flex flex-wrap gap-2">{c.sdgs.filter((g) => mine.has(g.id)).map((g) => <span key={g.id} className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: g.color }}>{g.id}. {t(g.title)}</span>)}</div>
        {stepSkills.length > 0 && <div className="mt-4"><p className="text-sm font-medium">{t('Skills in your pathway and their possible goals')}</p>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">{stepSkills.map((id) => { const sk = c.skills.find((s) => s.id === id); return <li key={id} data-testid={`row-skill-sdg-${id}`}><b className="font-medium">{skillName(id)}</b>: <span className="text-muted-foreground">{sk?.sdgs.length ? sk.sdgs.map((n) => `SDG ${n}`).join(', ') : t('none')}</span></li>; })}</ul></div>}
      </section>) : <p className="mb-6 rounded-xl border border-dashed p-4 text-sm text-muted-foreground" data-testid="text-no-role">{t('Choose a role on Role matches to highlight its goals here.')} <Link href="/matches" className="underline" data-testid="link-impact-matches">{t('Go to matches')}</Link></p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{c.sdgs.map((g) => {
        const roles = c.roles.filter((r) => r.sdgs.includes(g.id)).map((r) => t(r.title));
        const skillCount = c.skills.filter((s) => s.sdgs.includes(g.id)).length;
        const shown = roles.slice(0, 3).join(', ');
        const roleLine = roles.length === 0 ? t('No curated role link yet') : roles.length > 3 ? t('{names} and {count} more', { names: shown, count: roles.length - 3 }) : shown;
        return (<a key={g.id} href={g.url} target="_blank" rel="noreferrer" data-testid={`card-sdg-${g.id}`} aria-label={`${g.id}. ${t(g.title)}${mine.has(g.id) ? ` (${t('linked to your chosen role')})` : ''}`} className={`lift rounded-xl p-4 text-white min-h-40 flex flex-col justify-between ${mine.has(g.id) ? 'ring-4 ring-foreground' : ''}`} style={{ background: g.color }}>
          <div><span className="font-display text-5xl font-semibold">{g.id}</span>{mine.has(g.id) && <span className="ml-2 rounded-full bg-black/25 px-2 py-0.5 text-[11px] align-top">{t('Your role')}</span>}<h3 className="font-medium leading-tight mt-1">{t(g.title)}</h3></div>
          <div className="mt-3 text-xs opacity-90"><p>{roleLine}</p>{skillCount > 0 && <p className="mt-1 font-mono opacity-80">{t('{count} linked skills', { count: skillCount })}</p>}</div></a>); })}</div></>)}
    <NextLink href="/global-skills-tracker" label="Global Skills Tracker" testId="link-next-from-impact" />
    <FAQ testId="faq-impact" items={[
      { id: 'read', q: t('How to read these links'), a: <>
        <Fact label="Possible contribution:">{t('a role or skill is linked to a goal when that work could support it. It is not a verified or measured impact.')}</Fact>
        <Fact label="Highlighted cards:">{t('goals linked to your chosen role. Each card opens the official UN page.')}</Fact>
      </> },
      { id: 'wider', q: t('Where can I see wider official data?'), a: <p>{t('For wider official context, see the')} <Link href="/global-skills-tracker" className="underline" data-testid="link-impact-tracker">{t('Global Skills Tracker')}</Link>{t('. It is external and does not feed these scores.')}</p> },
    ]} />
  </div>);
}
