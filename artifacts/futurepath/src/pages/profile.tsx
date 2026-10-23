import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { AlertTriangle, ArrowRight, Check, Clock, Compass, FileText, Gauge, RotateCcw, Save, Sparkles, Upload, X, type LucideIcon } from 'lucide-react';
import { useFP, SYNTHETIC } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import { categoryStyle } from '@/components/badges';
import { FAQ, Fact, NextLink } from '@/components/guide';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { ProfileInput } from '@workspace/api-client-react';
import { useLanguage } from '@/lib/i18n';
import { badgeShelf } from '@/lib/learning';
const same = (a: ProfileInput, b: ProfileInput) => JSON.stringify({ ...a, skills: [...a.skills].sort(), interests: [...a.interests].sort() }) === JSON.stringify({ ...b, skills: [...b.skills].sort(), interests: [...b.interests].sort() });

function Section({ id, icon: Icon, title, desc, children, aside }: { id: string; icon: LucideIcon; title: string; desc: string; children: ReactNode; aside?: ReactNode }) {
  const { t } = useLanguage();
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6" aria-labelledby={`profile-${id}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 max-w-xl">
          <h2 id={`profile-${id}`} className="flex items-center gap-2.5 font-display text-xl"><span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={16} aria-hidden="true" /></span>{t(title)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(desc)}</p>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function Profile() {
  const { t } = useLanguage();
  const { profile, setProfile, catalog, roleId, pathway, done } = useFP();
  const [d, setD] = useState<ProfileInput>(profile);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<null | 'save' | 'reset'>(null);
  const [cvFile, setCvFile] = useState<{ name: string; size: number } | null>(null);
  const [cvError, setCvError] = useState('');
  const cvInput = useRef<HTMLInputElement>(null);
  const chooseCv = (file?: File) => {
    setCvError('');
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['pdf', 'doc', 'docx'].includes(extension)) {
      setCvFile(null);
      setCvError('Choose a PDF, DOC, or DOCX file.');
    } else if (file.size > 10 * 1024 * 1024) {
      setCvFile(null);
      setCvError('The file must be 10 MB or smaller.');
    } else {
      setCvFile({ name: file.name, size: file.size });
    }
    if (cvInput.current) cvInput.current.value = '';
  };
  const tog = (k: 'skills' | 'interests', v: string) => setD((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));
  const save = (p: ProfileInput) => { setProfile(p); setSaved(true); setTimeout(() => setSaved(false), 2400); };
  const hasPlan = Boolean(roleId || pathway || done.length);
  const dirty = !same(d, profile);
  const request = (kind: 'save' | 'reset') => {
    if (hasPlan) { setConfirm(kind); return; }
    if (kind === 'reset') setD(SYNTHETIC);
    save(kind === 'reset' ? SYNTHETIC : d);
  };
  const apply = () => {
    if (confirm === 'reset') { setD(SYNTHETIC); save(SYNTHETIC); } else save(d);
    setConfirm(null);
  };
  const chip = (on: boolean) => `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-[background-color,border-color,transform] active:scale-95 motion-reduce:active:scale-100 ${on ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted hover:border-primary/40'}`;
  const cats = Array.from(new Set(catalog.data?.skills.map((s) => s.category) ?? []));
  // Sector chips come from the catalog roles, so every choice can affect a score.
  const sectors = Array.from(new Set(catalog.data?.roles.map((r) => r.sector) ?? []));
  const doneCount = pathway ? pathway.steps.filter((s) => done.includes(s.id)).length : 0;
  const badgeCount = pathway ? badgeShelf(pathway.steps, done).earned : 0;
  const count = (testId: string, n: number) => <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary" data-testid={testId} aria-live="polite">{t('{count} selected', { count: n })}</span>;
  return (<div>
    <Head kicker="Profile" title="Your skills profile" sub="A synthetic demo profile. Change anything below, but please do not enter real personal details." />

    {catalog.isLoading ? <Skel n={3} /> : catalog.isError || !catalog.data ? <ErrorBox msg="Skill catalog unavailable." retry={() => catalog.refetch()} /> : (<div className="space-y-5 max-w-3xl">
      <section className="rounded-2xl border border-dashed bg-card/70 p-4" aria-labelledby="cv-upload-title">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><FileText size={19} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="cv-upload-title" className="font-medium">{t('CV upload preview')}</h2>
            <p className="text-xs text-muted-foreground">{t('Optional. Shows the file name only; nothing is uploaded or read.')}</p>
          </div>
          <input ref={cvInput} id="cv-file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="peer sr-only" aria-describedby="cv-upload-note cv-upload-status" onChange={(e) => chooseCv(e.currentTarget.files?.[0])} data-testid="input-cv" />
          <label htmlFor="cv-file" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
            <Upload size={16} aria-hidden="true" /> {t('Choose a CV')}
          </label>
        </div>
        <p id="cv-upload-note" className="sr-only">{t('The selected file remains in this browser tab and will not be uploaded or saved.')}</p>
        <div id="cv-upload-status" aria-live="polite">
          {cvError && <p className="mt-3 text-sm text-destructive" role="alert">{t(cvError)}</p>}
          {cvFile && <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <FileText size={16} className="text-accent" aria-hidden="true" />
            <span className="max-w-full break-all font-medium">{cvFile.name}</span>
            <span className="text-muted-foreground">({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            <button type="button" onClick={() => { setCvFile(null); setCvError(''); }} className="inline-flex items-center gap-1 rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={t('Remove {name}', { name: cvFile.name })} data-testid="button-remove-cv">
              <X size={15} aria-hidden="true" /> {t('Remove')}
            </button>
            <p className="w-full text-xs text-muted-foreground">{t('Name preview only. Your skills below are still chosen by hand.')}</p>
          </div>}
        </div>
      </section>

      <Section id="skills" icon={Sparkles} title="Skills you already have" desc="Tap the skills you can already use." aside={count('text-skill-count', d.skills.length)}>
        <div className="space-y-4">{cats.map((c) => (<div key={c}>
          <h3 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground"><span className="size-2 rounded-full" style={{ background: categoryStyle(c).to }} aria-hidden="true" />{t(c)}</h3>
          <div className="flex flex-wrap gap-2">{catalog.data.skills.filter((s) => s.category === c).map((s) => { const on = d.skills.includes(s.id); return (<button key={s.id} type="button" aria-pressed={on} onClick={() => tog('skills', s.id)} className={chip(on)} data-testid={`chip-skill-${s.id}`}>{on && <Check size={13} aria-hidden="true" />}{t(s.name)}</button>); })}</div>
        </div>))}</div>
      </Section>
      <Section id="sectors" icon={Compass} title="Sectors that interest you" desc="Picking a role's sector adds 15 points to its score (out of 100)." aside={count('text-interest-count', d.interests.length)}>
        <div className="flex flex-wrap gap-2">{sectors.map((s) => { const on = d.interests.includes(s); return (<button key={s} type="button" aria-pressed={on} onClick={() => tog('interests', s)} className={chip(on)} data-testid={`chip-interest-${s}`}>{on && <Check size={13} aria-hidden="true" />}{t(s)}</button>); })}</div>
      </Section>
      <Section id="time" icon={Clock} title="Experience and study time" desc="Experience is context only. Weekly hours set the pace of your plan.">
        <div className="grid sm:grid-cols-2 gap-6">
          <label className="text-sm">{t('Years of experience:')} <b data-testid="text-years">{d.experienceYears}</b><input type="range" min={0} max={50} value={d.experienceYears} onChange={(e) => setD({ ...d, experienceYears: +e.target.value })} className="w-full accent-[hsl(var(--primary))]" data-testid="input-years" aria-describedby="years-help" /><span id="years-help" className="block text-xs text-muted-foreground">{t('0 to 50 years. Any work, internship or volunteering counts.')}</span></label>
          <label className="text-sm">{t('Hours per week:')} <b data-testid="text-hours">{d.weeklyHours}</b><input type="range" min={1} max={40} value={d.weeklyHours} onChange={(e) => setD({ ...d, weeklyHours: +e.target.value })} className="w-full accent-[hsl(var(--primary))]" data-testid="input-hours" aria-describedby="hours-help" /><span id="hours-help" className="block text-xs text-muted-foreground">{t('1 to 40 hours. Be realistic: a steady pace beats an ambitious one you cannot keep.')}</span></label>
        </div>
      </Section>
      <Section id="scenario" icon={Gauge} title="How fast might AI change work?" desc="An assumption, not a prediction. Compare both on Role matches.">
        <div className="grid gap-2 sm:grid-cols-2">{(['moderate', 'fast'] as const).map((s) => { const on = d.scenario === s; return (
          <button key={s} type="button" aria-pressed={on} onClick={() => setD({ ...d, scenario: s })} className={`rounded-xl border p-4 text-left transition-colors ${on ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card hover:bg-muted/60'}`} data-testid={`chip-scenario-${s}`}>
            <span className="flex items-center justify-between gap-2 font-medium">{t(s === 'fast' ? 'Fast AI change' : 'Moderate change')}{on && <Check size={15} className="text-primary" aria-hidden="true" />}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{t(s === 'fast' ? 'Weights: 55% skills + 15% interest + 30% posting demand; 18-point illustrative decline penalty.' : 'Weights: 65% skills + 15% interest + 20% posting demand; 8-point illustrative decline penalty.')}</span>
          </button>); })}</div>
      </Section>

      <section className="sticky bottom-3 z-10 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur" aria-label={t('Save your profile')}>
        <p className="text-sm" data-testid="text-profile-state" aria-live="polite">{saved ? t('Saved. Role matches are being recalculated.') : dirty ? t('You have unsaved changes.') : t('No unsaved changes.')}</p>
        {hasPlan && <p className="mt-1 flex items-start gap-1.5 text-xs text-accent" data-testid="text-plan-warning"><AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{t('Saving or resetting clears your chosen role, pathway, completed steps and badges. You will be asked to confirm.')}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={() => request('save')} className="btn-primary" data-testid="button-save"><Save size={15} />{t(saved ? 'Saved' : 'Save and re-match')}</button>
          <button onClick={() => request('reset')} className="btn-quiet" data-testid="button-reset"><RotateCcw size={15} />{t('Reset to synthetic')}</button>
          {dirty && <button onClick={() => setD(profile)} className="text-sm underline" data-testid="button-discard">{t('Discard changes')}</button>}
          {!dirty && <Link href="/matches" className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary underline" data-testid="link-profile-matches">{t('See matches')} <ArrowRight size={14} aria-hidden="true" /></Link>}
        </div>
      </section>
    </div>)}

    <NextLink href="/radar" label="Signal radar" testId="link-next-radar" />
    <FAQ testId="faq-profile" items={[
      { id: 'privacy', q: t('What is sent, and what stays here'), a: <>
        <Fact label="Sent to the FuturePath API for matching:">{t('selected skill IDs, sector interests, years of experience, weekly study hours and scenario.')}</Fact>
        <Fact label="Kept only in this browser:">{t('your saved profile, chosen pathway, completed steps and badges.')}</Fact>
        <Fact label="Never read, uploaded or saved:">{t('the content of any CV file you pick. Only its name and size are shown, on this device.')}</Fact>
      </> },
      { id: 'readiness', q: t('How does readiness work?'), a: <p>{t('Readiness is the share of a role\'s listed skills you selected. Skills have no levels: each is either selected or not.')}</p> },
      { id: 'scenario', q: t('What do the scenarios change?'), a: <p>{t('A scenario is an assumption you choose, not a prediction. It changes how much posting demand counts and how strongly roles with a declining outlook are adjusted.')}</p> },
      { id: 'save', q: t('What happens after I save?'), a: <p>{t('Every role is re-scored out of 100 on Role matches.')} {t('Any chosen role, pathway, completed steps and badges are cleared, because they were built for the old profile.')} {t('Pick a role again to build a fresh learning plan.')}</p> },
    ]} />

    <AlertDialog open={confirm !== null} onOpenChange={(o) => { if (!o) setConfirm(null); }}>
      <AlertDialogContent data-testid="dialog-confirm-profile">
        <AlertDialogHeader>
          <AlertDialogTitle>{t(confirm === 'reset' ? 'Reset to the synthetic profile?' : 'Save and start a new plan?')}</AlertDialogTitle>
          <AlertDialogDescription>{t('This clears your current plan so it can be rebuilt for the new profile:')}</AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {pathway && <li>{t('Chosen role and pathway: {role}', { role: t(pathway.role.title) })}</li>}
          {!pathway && roleId && <li>{t('Your chosen role')}</li>}
          <li>{t('{count} completed steps', { count: doneCount || done.length })}</li>
          <li>{t('{count} badges', { count: badgeCount })}</li>
        </ul>
        <p className="text-xs text-muted-foreground">{t('This cannot be undone. Cancel to keep everything as it is.')}</p>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-profile">{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={apply} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-profile">{t(confirm === 'reset' ? 'Reset and clear plan' : 'Save and clear plan')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>);
}
