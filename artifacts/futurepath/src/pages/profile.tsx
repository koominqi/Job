import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useFP, SYNTHETIC } from '@/lib/store';
import { Head, Skel, ErrorBox } from '@/components/bits';
import type { ProfileInput } from '@workspace/api-client-react';
const SECTORS = ['Technology', 'Data & AI', 'Sustainability', 'Business', 'Design'];
export default function Profile() {
  const { profile, setProfile, catalog } = useFP();
  const [d, setD] = useState<ProfileInput>(profile);
  const [saved, setSaved] = useState(false);
  const tog = (k: 'skills' | 'interests', v: string) => setD((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));
  const save = (p: ProfileInput) => { setProfile(p); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  const chip = (on: boolean) => `px-3 py-1.5 rounded-full text-sm border transition-all active:scale-95 ${on ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'}`;
  const cats = Array.from(new Set(catalog.data?.skills.map((s) => s.category) ?? []));
  return (<div>
    <Head kicker="Profile" title="Tell us about Alex" sub="Synthetic demo profile. Do not enter real personal details; nothing leaves your browser except skill IDs sent for matching." />
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
