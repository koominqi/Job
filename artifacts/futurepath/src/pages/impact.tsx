import { useFP } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import { useLanguage } from '@/lib/i18n';
export default function Impact() {
  const { t } = useLanguage();
  const { catalog, pathway } = useFP();
  const c = catalog.data;
  const mine = new Set(pathway?.role.sdgs ?? []);
  return (<div>
    <Head kicker="Impact" title="Work that connects to the 17 goals" sub="Links are editorial mappings from roles and skills to UN Sustainable Development Goals, not measured outcomes." />
    {catalog.isLoading ? <Skel n={4} /> : catalog.isError || !c ? <ErrorBox msg="Goals unavailable." retry={() => catalog.refetch()} /> : (<>
      {pathway && <p className="mb-6 text-sm" data-testid="text-role-sdgs">{t('Your chosen role, {role}: {impact}', { role: t(pathway.role.title), impact: t(pathway.role.impact) })}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{c.sdgs.map((g) => {
        const roles = c.roles.filter((r) => r.sdgs.includes(g.id)); const skills = c.skills.filter((s) => s.sdgs.includes(g.id));
        return (<a key={g.id} href={g.url} target="_blank" rel="noreferrer" data-testid={`card-sdg-${g.id}`} className={`lift rounded-xl p-4 text-white min-h-40 flex flex-col justify-between ${mine.has(g.id) ? 'ring-4 ring-foreground' : ''}`} style={{ background: g.color }}>
          <div><span className="font-display text-5xl font-semibold">{g.id}</span><h3 className="font-medium leading-tight mt-1">{t(g.title)}</h3></div>
          <p className="text-xs opacity-90 mt-3">{roles.length ? roles.map((r) => t(r.title)).join(', ') : t('No curated role link yet')}{skills.length ? `. ${t('Skills:')} ${skills.map((s) => t(s.name)).join(', ')}` : ''}</p></a>); })}</div></>)}
  </div>);
}
