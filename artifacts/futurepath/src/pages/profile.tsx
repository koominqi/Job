import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { AlertTriangle, ArrowRight, Check, FileText, RotateCcw, Save, ShieldCheck, Upload, X } from 'lucide-react';
import { useFP, SYNTHETIC } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import { JourneyRail, Explain, Fact, NextStep } from '@/components/guide';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { ProfileInput } from '@workspace/api-client-react';
import { useLanguage } from '@/lib/i18n';
const SECTORS = ['Technology', 'Data & AI', 'Sustainability', 'Business', 'Design'];
const same = (a: ProfileInput, b: ProfileInput) => JSON.stringify({ ...a, skills: [...a.skills].sort(), interests: [...a.interests].sort() }) === JSON.stringify({ ...b, skills: [...b.skills].sort(), interests: [...b.interests].sort() });

function Section({ n, title, desc, children, aside }: { n: number; title: string; desc: string; children: ReactNode; aside?: ReactNode }) {
  const { t } = useLanguage();
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6" aria-labelledby={`profile-sec-${n}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 max-w-xl">
          <h2 id={`profile-sec-${n}`} className="flex items-center gap-2 font-display text-xl"><span className="grid size-6 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">{n}</span>{t(title)}</h2>
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
  const { profile, setProfile, catalog, roleId, pathway, done, earnedBadges } = useFP();
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
  const hasPlan = Boolean(roleId || pathway || done.length || earnedBadges.length);
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
  const doneCount = pathway ? pathway.steps.filter((s) => done.includes(s.id)).length : 0;
  return (<div>
    <Head kicker="Profile" title="Tell us about Alex" sub="Alex is a synthetic demo person. Change the choices below to explore; do not enter real personal details." />
    <JourneyRail current="profile" />

    <section className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-5" aria-labelledby="privacy-heading" data-testid="card-privacy">
      <h2 id="privacy-heading" className="flex items-center gap-2 font-display text-lg"><ShieldCheck size={18} className="text-primary" aria-hidden="true" />{t('What is sent, and what stays here')}</h2>
      <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
        <li><b className="font-medium">{t('Sent to the FuturePath API for matching:')}</b> {t('selected skill IDs, sector interests, years of experience, weekly study hours and scenario.')}</li>
        <li><b className="font-medium">{t('Kept only in this browser:')}</b> {t('your saved profile, chosen pathway, completed steps and badges.')}</li>
        <li className="sm:col-span-2"><b className="font-medium">{t('Never read, uploaded or saved:')}</b> {t('the content of any CV file you pick. The picker below only shows the file name locally.')}</li>
      </ul>
    </section>

    <section className="mb-8 max-w-3xl rounded-2xl border bg-card shadow-sm p-5 sm:p-6" aria-labelledby="cv-upload-title">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/10 p-2 text-accent"><FileText size={20} aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <h2 id="cv-upload-title" className="font-display text-xl font-semibold">{t('CV upload preview')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('Choose a PDF, DOC, or DOCX file (up to 10 MB) to preview its name. This demo does not upload, read, save, or use your CV for recommendations. Please use a synthetic sample, not a real CV.')}</p>
          <input ref={cvInput} id="cv-file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" aria-describedby="cv-upload-note cv-upload-status" onChange={(e) => chooseCv(e.currentTarget.files?.[0])} data-testid="input-cv" />
          <label htmlFor="cv-file" className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-within:ring-2 focus-within:ring-ring">
            <Upload size={16} aria-hidden="true" /> {t('Choose a CV')}
          </label>
          <p id="cv-upload-note" className="sr-only">{t('The selected file remains in this browser tab and will not be uploaded or saved.')}</p>
          <div id="cv-upload-status" aria-live="polite" className="mt-3">
            {cvError && <p className="text-sm text-destructive" role="alert">{t(cvError)}</p>}
            {cvFile && <div className="flex flex-wrap items-center gap-2 text-sm">
              <FileText size={16} className="text-accent" aria-hidden="true" />
              <span className="max-w-full break-all font-medium">{cvFile.name}</span>
              <span className="text-muted-foreground">({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              <button type="button" onClick={() => { setCvFile(null); setCvError(''); }} className="inline-flex items-center gap-1 rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={t('Remove {name}', { name: cvFile.name })} data-testid="button-remove-cv">
                <X size={15} aria-hidden="true" /> {t('Remove')}
              </button>
              <p className="w-full text-xs text-muted-foreground">{t('Name preview only. Your skills below are still chosen by hand.')}</p>
            </div>}
          </div>
        </div>
      </div>
    </section>

    {catalog.isLoading ? <Skel n={3} /> : catalog.isError || !catalog.data ? <ErrorBox msg="Skill catalog unavailable." retry={() => catalog.refetch()} /> : (<div className="space-y-5 max-w-3xl">
      <Section n={1} title="Skills you already have" desc="Tap each skill you can already use at work or in study. Readiness compares these with the skills each role needs; a skill is either selected or not, with no levels." aside={<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary" data-testid="text-skill-count" aria-live="polite">{t('{count} selected', { count: d.skills.length })}</span>}>
        <div className="space-y-4">{cats.map((c) => (<div key={c}><h3 className="font-mono text-xs uppercase tracking-widest mb-2 text-muted-foreground">{t(c)}</h3><div className="flex flex-wrap gap-2">{catalog.data.skills.filter((s) => s.category === c).map((s) => { const on = d.skills.includes(s.id); return (<button key={s.id} type="button" aria-pressed={on} onClick={() => tog('skills', s.id)} className={chip(on)} data-testid={`chip-skill-${s.id}`}>{on && <Check size={13} aria-hidden="true" />}{t(s.name)}</button>); })}</div></div>))}</div>
      </Section>
      <Section n={2} title="Sectors that interest you" desc="Interest fit checks whether a role's sector is one you picked. It is worth 15% of the score." aside={<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary" data-testid="text-interest-count">{t('{count} selected', { count: d.interests.length })}</span>}>
        <div className="flex flex-wrap gap-2">{SECTORS.map((s) => { const on = d.interests.includes(s); return (<button key={s} type="button" aria-pressed={on} onClick={() => tog('interests', s)} className={chip(on)} data-testid={`chip-interest-${s}`}>{on && <Check size={13} aria-hidden="true" />}{t(s)}</button>); })}</div>
      </Section>
      <Section n={3} title="Experience and study time" desc="Experience is context only and does not change any score. Weekly study hours set how many weeks each learning step takes in your plan; more hours means a shorter calendar, not less learning.">
        <div className="grid sm:grid-cols-2 gap-6">
          <label className="text-sm">{t('Years of experience:')} <b data-testid="text-years">{d.experienceYears}</b><input type="range" min={0} max={50} value={d.experienceYears} onChange={(e) => setD({ ...d, experienceYears: +e.target.value })} className="w-full accent-[hsl(var(--primary))]" data-testid="input-years" aria-describedby="years-help" /><span id="years-help" className="block text-xs text-muted-foreground">{t('0 to 50 years. Any work, internship or volunteering counts.')}</span></label>
          <label className="text-sm">{t('Hours per week:')} <b data-testid="text-hours">{d.weeklyHours}</b><input type="range" min={1} max={40} value={d.weeklyHours} onChange={(e) => setD({ ...d, weeklyHours: +e.target.value })} className="w-full accent-[hsl(var(--primary))]" data-testid="input-hours" aria-describedby="hours-help" /><span id="hours-help" className="block text-xs text-muted-foreground">{t('1 to 40 hours. Be realistic: a steady pace beats an ambitious one you cannot keep.')}</span></label>
        </div>
      </Section>
      <Section n={4} title="How fast might AI change work?" desc="A scenario is an assumption you choose, not a prediction. It changes how much posting demand counts and how strongly roles with a declining outlook are adjusted.">
        <div className="grid gap-2 sm:grid-cols-2">{(['moderate', 'fast'] as const).map((s) => { const on = d.scenario === s; return (
          <button key={s} type="button" aria-pressed={on} onClick={() => setD({ ...d, scenario: s })} className={`rounded-xl border p-4 text-left transition-colors ${on ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card hover:bg-muted/60'}`} data-testid={`chip-scenario-${s}`}>
            <span className="flex items-center justify-between gap-2 font-medium">{t(s === 'fast' ? 'Fast AI change' : 'Moderate change')}{on && <Check size={15} className="text-primary" aria-hidden="true" />}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{t(s === 'fast' ? 'Weights: 55% skills + 15% interest + 30% posting demand; 18-point illustrative decline penalty.' : 'Weights: 65% skills + 15% interest + 20% posting demand; 8-point illustrative decline penalty.')}</span>
          </button>); })}</div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{t('Choose either scenario on Profile, or compare both with your current skills on Role matches. These are different assumptions, not predictions about what AI will do.')}</p>
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

      <Explain title="What happens after I save?" testId="explain-profile-save">
        <Fact label="1.">{t('Your choices are stored in this browser and sent to the matching API.')}</Fact>
        <Fact label="2.">{t('Every role is re-scored out of 100 on Role matches.')}</Fact>
        <Fact label="3.">{t('Any chosen role, pathway, completed steps and badges are cleared, because they were built for the old profile.')}</Fact>
        <Fact label="4.">{t('Pick a role again to build a fresh learning plan.')}</Fact>
      </Explain>
    </div>)}

    <NextStep href="/radar" title="Explore the job-market signals" body="Save any profile changes first. Continue to see the dated sources used in matching." testId="link-next-radar" />

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
          <li>{t('{count} badges', { count: earnedBadges.length })}</li>
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
