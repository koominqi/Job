import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCareerCatalog, useGetCareerSignals, useRefreshCareerSignals, useMatchCareerRoles, useCreateCareerPathway, getGetCareerSignalsQueryKey } from '@workspace/api-client-react';
import type { ProfileInput, Pathway } from '@workspace/api-client-react';

export const SYNTHETIC: ProfileInput = { skills: ['spreadsheets', 'communication', 'critical-thinking', 'data-analysis'], interests: ['Data & AI', 'Business'], experienceYears: 2, weeklyHours: 6, scenario: 'moderate' };
function load<T>(k: string, d: T): T { try { const r = localStorage.getItem('fp.' + k); return r ? JSON.parse(r) : d; } catch { return d; } }
function usePersist<T>(k: string, d: T) {
  const [v, set] = useState<T>(() => load(k, d));
  useEffect(() => { localStorage.setItem('fp.' + k, JSON.stringify(v)); }, [k, v]);
  return [v, set] as const;
}
function useStore() {
  const qc = useQueryClient();
  const catalog = useGetCareerCatalog();
  const signals = useGetCareerSignals();
  const refresh = useRefreshCareerSignals({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetCareerSignalsQueryKey() }); } } });
  const match = useMatchCareerRoles();
  const path = useCreateCareerPathway();
  const [profile, persistProfile] = usePersist<ProfileInput>('profile', SYNTHETIC);
  const [roleId, setRoleId] = usePersist<string | null>('role', null);
  const [pathway, setPathway] = usePersist<Pathway | null>('pathway', null);
  const [done, setDone] = usePersist<string[]>('done', []);
  const setProfile = useCallback((next: ProfileInput) => {
    persistProfile(next);
    setRoleId(null);
    setPathway(null);
    setDone([]);
  }, [persistProfile, setRoleId, setPathway, setDone]);
  const mm = useRef(match.mutate); mm.current = match.mutate;
  const key = JSON.stringify(profile) + (signals.data?.fetchedAt ?? '') + (signals.data?.status ?? '');
  useEffect(() => { mm.current({ data: profile }); /* eslint-disable-next-line */ }, [key]);
  const selectRole = useCallback((id: string, onDone?: () => void) => {
    setRoleId(id); setDone([]);
    path.mutate({ data: { profile, roleId: id } }, { onSuccess: (p) => { setPathway(p); onDone?.(); } });
  }, [profile, path, setRoleId, setDone, setPathway]);
  const toggle = (id: string) => setDone((d) => d.includes(id) ? d.filter((x) => x !== id) : [...d, id]);
  const skillName = useMemo(() => { const m = new Map((catalog.data?.skills ?? []).map((s) => [s.id, s.name])); return (id: string) => m.get(id) ?? id; }, [catalog.data]);
  return { catalog, signals, refresh, match, path, profile, setProfile, roleId, pathway, done, toggle, selectRole, skillName };
}
const Ctx = createContext<ReturnType<typeof useStore> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) { const s = useStore(); return <Ctx.Provider value={s}>{children}</Ctx.Provider>; }
export const useFP = () => useContext(Ctx)!;
