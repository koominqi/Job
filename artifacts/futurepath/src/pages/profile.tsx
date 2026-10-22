import { useRef, useState } from 'react';
import { FileText, RotateCcw, Save, Upload, X } from 'lucide-react';
import { useFP, SYNTHETIC } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import type { ProfileInput } from '@workspace/api-client-react';
const SECTORS = ['Technology', 'Data & AI', 'Sustainability', 'Business', 'Design'];
export default function Profile() {
  const { profile, setProfile, catalog } = useFP();
  const [d, setD] = useState<ProfileInput>(profile);
  const [saved, setSaved] = useState(false);
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
  const save = (p: ProfileInput) => { setProfile(p); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  const chip = (on: boolean) => `px-3 py-1.5 rounded-full text-sm border transition-all active:scale-95 ${on ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'}`;
  const cats = Array.from(new Set(catalog.data?.skills.map((s) => s.category) ?? []));
  return (<div>
    <Head kicker="Profile" title="Tell us about Alex" sub="Synthetic demo profile. Do not enter real personal details; nothing leaves your browser except skill IDs sent for matching." />
    <section className="mb-8 max-w-3xl rounded-xl border bg-card p-5 sm:p-6" aria-labelledby="cv-upload-title">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/10 p-2 text-accent"><FileText size={20} aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <h2 id="cv-upload-title" className="font-display text-xl font-semibold">CV upload preview</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a PDF, DOC, or DOCX file (up to 10 MB) to preview its name. This demo does not upload, read, save, or use your CV for recommendations. Please use a synthetic sample, not a real CV.</p>
          <input ref={cvInput} id="cv-file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" aria-describedby="cv-upload-note cv-upload-status" onChange={(e) => chooseCv(e.currentTarget.files?.[0])} />
          <label htmlFor="cv-file" className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
            <Upload size={16} aria-hidden="true" /> Choose a CV
          </label>
          <p id="cv-upload-note" className="sr-only">The selected file remains in this browser tab and will not be uploaded or saved.</p>
          <div id="cv-upload-status" aria-live="polite" className="mt-3">
            {cvError && <p className="text-sm text-destructive" role="alert">{cvError}</p>}
            {cvFile && <div className="flex flex-wrap items-center gap-2 text-sm">
              <FileText size={16} className="text-accent" aria-hidden="true" />
              <span className="max-w-full break-all font-medium">{cvFile.name}</span>
              <span className="text-muted-foreground">({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              <button type="button" onClick={() => { setCvFile(null); setCvError(''); }} className="inline-flex items-center gap-1 rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Remove ${cvFile.name}`}>
                <X size={15} aria-hidden="true" /> Remove
              </button>
            </div>}
          </div>
        </div>
      </div>
    </section>
    {catalog.isLoading ? <Skel n={3} /> : catalog.isError || !catalog.data ? <ErrorBox msg="Skill catalog unavailable." retry={() => catalog.refetch()} /> : (<div className="space-y-8 max-w-3xl">
      {cats.map((c) => (<section key={c}><h3 className="font-mono text-xs uppercase tracking-widest mb-2 text-muted-foreground">{c}</h3><div className="flex flex-wrap gap-2">{catalog.data.skills.filter((s) => s.category === c).map((s) => (<button key={s.id} onClick={() => tog('skills', s.id)} className={chip(d.skills.includes(s.id))} data-testid={`chip-skill-${s.id}`}>{s.name}</button>))}</div></section>))}
      <section><h3 className="font-mono text-xs uppercase tracking-widest mb-2 text-muted-foreground">Interests</h3><div className="flex flex-wrap gap-2">{SECTORS.map((s) => (<button key={s} onClick={() => tog('interests', s)} className={chip(d.interests.includes(s))} data-testid={`chip-interest-${s}`}>{s}</button>))}</div></section>
      <section className="grid sm:grid-cols-2 gap-6">
        <label className="text-sm">Years of experience: <b>{d.experienceYears}</b><input type="range" min={0} max={50} value={d.experienceYears} onChange={(e) => setD({ ...d, experienceYears: +e.target.value })} className="w-full accent-[hsl(8,78%,48%)]" data-testid="input-years" /></label>
        <label className="text-sm">Hours per week: <b>{d.weeklyHours}</b><input type="range" min={1} max={40} value={d.weeklyHours} onChange={(e) => setD({ ...d, weeklyHours: +e.target.value })} className="w-full accent-[hsl(8,78%,48%)]" data-testid="input-hours" /></label>
      </section>
      <section><h3 className="font-mono text-xs uppercase tracking-widest mb-2 text-muted-foreground">Scenario</h3><div className="flex gap-2">{(['moderate', 'fast'] as const).map((s) => (<button key={s} onClick={() => setD({ ...d, scenario: s })} className={chip(d.scenario === s)} data-testid={`chip-scenario-${s}`}>{s === 'fast' ? 'Fast AI change' : 'Moderate change'}</button>))}</div></section>
      <div className="flex gap-3"><button onClick={() => save(d)} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground inline-flex gap-2 items-center" data-testid="button-save"><Save size={15} />{saved ? 'Saved' : 'Save and re-match'}</button>
        <button onClick={() => { setD(SYNTHETIC); save(SYNTHETIC); }} className="px-5 py-2 rounded-lg border inline-flex gap-2 items-center hover:bg-muted" data-testid="button-reset"><RotateCcw size={15} />Reset to synthetic</button></div>
    </div>)}
  </div>);
}
