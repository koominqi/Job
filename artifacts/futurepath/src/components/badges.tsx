import { type CSSProperties } from 'react';
import { Award, BrainCircuit, BriefcaseBusiness, Calculator, ChartLine, ChartPie, Check, Cloud, CodeXml, Cpu, Database, Flag, GraduationCap, Headset, HeartHandshake, Leaf, Lightbulb, ListChecks, LockKeyhole, Megaphone, MessagesSquare, Network, Palette, PenLine, PenTool, ShieldCheck, Sheet, Sprout, SquareTerminal, Sun, Trophy, WandSparkles, Workflow, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useFP } from '@/lib/store';
import { badgeShelf, type BadgeStep } from '@/lib/learning';
import { Meter } from '@/components/bits';

type MedalStyle = { icon: LucideIcon; from: string; to: string };
const CATEGORY_STYLES: Record<string, MedalStyle> = {
  'Technical': { icon: CodeXml, from: '#2dd4bf', to: '#0f5f66' },
  'AI & digital': { icon: Cpu, from: '#a5b4fc', to: '#4338ca' },
  'Human skills': { icon: HeartHandshake, from: '#fda48a', to: '#c2410c' },
  'Business': { icon: BriefcaseBusiness, from: '#fcd34d', to: '#b45309' },
  'Green skills': { icon: Leaf, from: '#86efac', to: '#15803d' },
  'Design & content': { icon: Palette, from: '#f9a8d4', to: '#9d174d' },
};
const FALLBACK: MedalStyle = { icon: Award, from: '#cbd5e1', to: '#475569' };
const TROPHY: MedalStyle = { icon: Trophy, from: '#fde68a', to: '#b45309' };

// Each skill has its own icon and colour, so one shelf never shows two identical medals.
// Colours are assigned so that no role lists two skills with the same hue.
const HUES = {
  teal: ['#2dd4bf', '#0f5f66'], blue: ['#93c5fd', '#1d4ed8'], sky: ['#7dd3fc', '#0369a1'], cyan: ['#67e8f9', '#0e7490'],
  indigo: ['#a5b4fc', '#4338ca'], violet: ['#c4b5fd', '#6d28d9'], fuchsia: ['#f0abfc', '#a21caf'], pink: ['#f9a8d4', '#9d174d'],
  rose: ['#fda4af', '#be123c'], coral: ['#fdba74', '#c2410c'], amber: ['#fcd34d', '#b45309'], lime: ['#bef264', '#4d7c0f'],
  emerald: ['#6ee7b7', '#047857'], slate: ['#cbd5e1', '#334155'],
} as const;
const skill = (icon: LucideIcon, hue: keyof typeof HUES): MedalStyle => ({ icon, from: HUES[hue][0], to: HUES[hue][1] });
const SKILL_STYLES: Record<string, MedalStyle> = {
  'python': skill(SquareTerminal, 'blue'),
  'sql': skill(Database, 'teal'),
  'data-analysis': skill(ChartLine, 'cyan'),
  'data-visualisation': skill(ChartPie, 'violet'),
  'web-development': skill(CodeXml, 'sky'),
  'cybersecurity': skill(ShieldCheck, 'slate'),
  'cloud': skill(Cloud, 'indigo'),
  'ai-literacy': skill(BrainCircuit, 'fuchsia'),
  'generative-ai': skill(WandSparkles, 'violet'),
  'machine-learning': skill(Network, 'rose'),
  'automation': skill(Workflow, 'sky'),
  'communication': skill(MessagesSquare, 'coral'),
  'critical-thinking': skill(Lightbulb, 'amber'),
  'leadership': skill(Flag, 'rose'),
  'customer-service': skill(Headset, 'pink'),
  'teaching': skill(GraduationCap, 'blue'),
  'project-management': skill(ListChecks, 'slate'),
  'spreadsheets': skill(Sheet, 'emerald'),
  'accounting': skill(Calculator, 'indigo'),
  'digital-marketing': skill(Megaphone, 'rose'),
  'sustainability': skill(Sprout, 'lime'),
  'clean-energy': skill(Sun, 'amber'),
  'ux-design': skill(PenTool, 'pink'),
  'graphic-design': skill(Palette, 'fuchsia'),
  'content-writing': skill(PenLine, 'blue'),
};

/** Category colour and icon shared by skill chips and medals. */
export const categoryStyle = (category: string) => CATEGORY_STYLES[category] ?? FALLBACK;

/** Medal style for one skill; unknown skills fall back to their category. */
export const skillStyle = (skillId: string, category = '') => SKILL_STYLES[skillId] ?? categoryStyle(category);

export function Medal({ skillId = '', category = '', earned, trophy = false, small = false }: { skillId?: string; category?: string; earned: boolean; trophy?: boolean; small?: boolean }) {
  const style = trophy ? TROPHY : skillStyle(skillId, category);
  const Icon = style.icon;
  const colours = { '--medal-from': style.from, '--medal-to': style.to } as CSSProperties;
  return (
    <span aria-hidden="true" style={earned ? colours : undefined}
      className={`medal ${trophy ? 'medal-trophy' : ''} ${small ? 'size-9' : 'size-16'} ${earned ? 'medal-earned' : 'medal-locked'}`}>
      <Icon size={small ? 15 : 26} strokeWidth={2.1} className={earned ? 'medal-icon' : 'opacity-55'} />
      {!small && <span className={`absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full ring-2 ring-card ${earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {earned ? <Check size={13} strokeWidth={3} /> : <LockKeyhole size={11} />}
      </span>}
    </span>
  );
}

function useProgress(steps: BadgeStep[], done: string[]) {
  const { t } = useLanguage();
  const shelf = badgeShelf(steps, done);
  const total = shelf.skills.length;
  const percent = total ? Math.round((shelf.completed / total) * 100) : 100;
  const headline = total === 0
    ? t('Your profile already covers the mapped learning skills for this role.')
    : shelf.finished
      ? t('Pathway complete. Well done.')
      : shelf.completed === 0
        ? t('Every journey starts with one step.')
        : t('You are making progress—keep building one skill at a time.');
  return { shelf, total, percent, headline, summary: t('{done} of {total} steps, {percent}%', { done: shelf.completed, total, percent }) };
}

/** Pathway page: one progress display plus one medal per skill and a finisher trophy. */
export function BadgeShelf({ steps, done, hours, weeks }: { steps: BadgeStep[]; done: string[]; hours: number; weeks: number }) {
  const { t } = useLanguage();
  const { skillName, skillCategory } = useFP();
  const { shelf, total, percent, headline, summary } = useProgress(steps, done);
  return (
    <section className="mb-10 overflow-hidden rounded-3xl border bg-card shadow-sm" data-testid="card-learning-progress" aria-labelledby="learning-progress-heading">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 bg-gradient-to-r from-accent/10 via-card to-primary/5 p-5 sm:px-7">
        <div className="grid size-20 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--accent)) ${percent}%, hsl(var(--muted)) ${percent}% 100%)` }}
          role="progressbar" aria-label={t('Learning progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} data-testid="text-progress-percent">
          <span className="grid size-[3.65rem] place-items-center rounded-full bg-card font-display text-xl font-semibold text-accent">{percent}%</span>
        </div>
        <div className="min-w-[12rem] flex-1">
          <h2 id="learning-progress-heading" className="font-display text-xl leading-snug sm:text-2xl">{headline}</h2>
          <p className="mt-1 text-sm text-muted-foreground"><span data-testid="text-progress">{summary}</span> · {t('{hours}h over {weeks} weeks', { hours, weeks })}</p>
        </div>
        {total > 0 && <span className="rounded-full border border-accent/30 bg-card px-3 py-1.5 text-xs font-semibold text-accent" data-testid="text-badge-count">{t('{count} of {total} earned', { count: shelf.earned, total: shelf.total })}</span>}
      </div>
      {total > 0 && <ul className="flex flex-wrap gap-x-4 gap-y-6 border-t px-5 py-6 sm:px-7" aria-label={t('Skill badges')}>
        {shelf.skills.map((badge) => (
          <li key={badge.id} className="flex w-24 flex-col items-center text-center" data-testid={`badge-${badge.skillId}`}>
            <Medal skillId={badge.skillId} category={skillCategory(badge.skillId)} earned={badge.earned} />
            <span className="mt-2.5 text-sm font-medium leading-tight">{skillName(badge.skillId)}</span>
            <span className={`mt-0.5 text-[11px] ${badge.earned ? 'font-medium text-primary' : 'text-muted-foreground'}`}>{badge.earned ? t('Earned') : t('Step {n}', { n: badge.order })}</span>
          </li>
        ))}
        <li className="flex w-24 flex-col items-center text-center" data-testid="badge-pathway-finisher">
          <Medal trophy earned={shelf.finished} />
          <span className="mt-2.5 text-sm font-medium leading-tight">{t('Pathway finisher')}</span>
          <span className={`mt-0.5 text-[11px] ${shelf.finished ? 'font-medium text-primary' : 'text-muted-foreground'}`}>{shelf.finished ? t('Earned') : t('Finish every step')}</span>
        </li>
      </ul>}
    </section>
  );
}

/** Overview: the same progress and medals in a compact strip. */
export function BadgeStrip({ steps, done }: { steps: BadgeStep[]; done: string[] }) {
  const { t } = useLanguage();
  const { skillName, skillCategory } = useFP();
  const { shelf, total, percent, summary } = useProgress(steps, done);
  if (!total) return null;
  return (
    <div className="mt-5 rounded-2xl border bg-background/60 p-4" data-testid="card-learning-progress">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold uppercase tracking-wider text-accent">{t('Learning progress')}</span>
        <span className="text-muted-foreground" data-testid="text-progress">{summary}</span>
      </div>
      <div className="mt-2" role="progressbar" aria-label={t('Learning progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><Meter v={percent} color="bg-accent" /></div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label={t('Skill badges')}>
        {shelf.skills.map((badge) => (
          <li key={badge.id} title={skillName(badge.skillId)}>
            <Medal small skillId={badge.skillId} category={skillCategory(badge.skillId)} earned={badge.earned} />
            <span className="sr-only">{skillName(badge.skillId)}: {t(badge.earned ? 'Earned' : 'Not earned')}</span>
          </li>
        ))}
        <li title={t('Pathway finisher')}>
          <Medal small trophy earned={shelf.finished} />
          <span className="sr-only">{t('Pathway finisher')}: {t(shelf.finished ? 'Earned' : 'Not earned')}</span>
        </li>
      </ul>
    </div>
  );
}
