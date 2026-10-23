import { ExternalLink } from 'lucide-react';
import { Head } from '@/components/bits';
import { FAQ } from '@/components/guide';
import { useLanguage } from '@/lib/i18n';

const SRC = 'https://connect.unevoc.unesco.org/home/Global%2BSkills%2BTracker/lang%3Den/menu%3DOnline%2Bjob%2Bmarkets';
const view = (m: string) => `https://connect.unevoc.unesco.org/home/Global+Skills+Tracker/lang=en/menu=${m}#top2`;
const views = [['Country analysis', 'Country+analysis'], ['Occupation analysis', 'Occupation+analysis'], ['Sector analysis', 'Sector+analysis'], ['AI skills', 'AI+Skills'], ['Digital skills', 'Digital+skills']] as const;
const uses = [['Explore occupational skills', 'See which skills appear in advertisements for an occupation.'], ['Compare covered countries', 'Compare only countries the tracker covers; coverage differs.'], ['Investigate AI and digital skills', 'Use the AI and digital skill filters to see where they appear.'], ['Inform a personalised reskilling pathway', 'Bring what you notice back to your own plan.']];
const btn = 'inline-flex items-center gap-2 rounded-lg text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
export default function GlobalSkillsTracker() {
  const { t, date } = useLanguage();
  return (<div>
    <Head kicker="External source" title="Global Skills Tracker" sub="Explore job-market trends and discover the skills employers need." />
    <div className="space-y-6">
      <section className="rounded-3xl bg-sidebar text-sidebar-foreground p-6 md:p-8 rise shadow-sm" data-testid="card-tracker-open">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70">{t('UNESCO-UNEVOC, with Lightcast data')}</p>
        <h2 className="mt-3 font-display text-2xl md:text-3xl">{t('Explore the official tracker')}</h2>
        <p className="mt-3 max-w-2xl text-sm opacity-90">{t('Advertised skills across countries, occupations and sectors. It opens in a new tab because the official site cannot be embedded here.')}</p>
        <a href={SRC} target="_blank" rel="noopener noreferrer" className={`${btn} mt-5 px-5 py-3 bg-primary text-primary-foreground font-medium`} data-testid="link-open-tracker">{t('Open Official Tracker')} <ExternalLink size={15} /></a>
        <p className="mt-4 text-xs opacity-80 break-all">{t('Official source:')} <a href={SRC} target="_blank" rel="noopener noreferrer" className="underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring">{SRC}</a></p>
      </section>

      <section className="rounded-3xl border bg-card p-6 md:p-7 shadow-sm" data-testid="card-direct-views">
        <h2 className="font-display text-2xl">{t('Jump to an official view')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('Each link opens the UNESCO-UNEVOC site in a new tab.')}</p>
        <div className="mt-4 flex flex-wrap gap-2">{views.map(([l, m]) => (<a key={m} href={view(m)} target="_blank" rel="noopener noreferrer" className={`${btn} px-4 py-2 border hover:bg-muted`} data-testid={`link-view-${m.toLowerCase().replace(/\+/g, '-')}`}>{t(l)} <ExternalLink size={13} /></a>))}</div>
      </section>

      <section className="rounded-3xl border bg-card p-6 md:p-7 shadow-sm" data-testid="card-how-to-use">
        <h2 className="font-display text-2xl mb-4">{t('How to use these insights')}</h2>
        <ul className="grid md:grid-cols-2 gap-4">{uses.map(([title, b]) => (<li key={title} className="rounded-2xl border bg-background/60 p-4"><b>{t(title)}</b><p className="text-sm text-muted-foreground mt-1">{t(b)}</p></li>))}</ul>
      </section>
      <p className="text-xs text-muted-foreground">{t('Attribution: UNESCO-UNEVOC Global Skills Tracker; data from Lightcast. FuturePath is not affiliated with either organisation.')}</p>
    </div>
    <FAQ testId="faq-tracker" items={[
      { id: 'data', q: t('About the data'), a: (
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('Publisher: UNESCO-UNEVOC Global Skills Tracker.')}</li>
          <li>{t('Online job advertisements collected by Lightcast from thousands of sources; skills classified with the Lightcast taxonomy.')}</li>
          <li>{t('Data period: the last 12 available months, not necessarily the current calendar year. Exact periods and the refresh date are shown in the official tracker and were not verified here.')}</li>
          <li>{t('Updated four times a year (quarterly).')}</li>
          <li>{t('Source link last checked')} <time dateTime="2026-10-22">{date('2026-10-22T00:00:00Z', true)}</time>{t('. This is a link check, not a data date, and this page is not real-time monitoring. The source returned a successful response and blocks third-party embedding.')}</li>
        </ul>
      ) },
      { id: 'limits', q: t('Limitations'), a: (
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('Malaysia is included, but the data covers online advertised jobs, not the whole labour market or national workforce.')}</li>
          <li>{t('Countries covered differ. Compare only covered countries.')}</li>
          <li>{t('Advertised skills show what employers ask for, not that you have or lack them.')}</li>
          <li>{t('FuturePath does not scrape, import or call this data. External insights are not automatically added to FuturePath scores; the dated Remotive feed remains the score input.')}</li>
        </ul>
      ) },
    ]} />
  </div>);
}
