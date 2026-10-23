import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCareerCatalog, useGetCareerSignals, useRefreshCareerSignals, useMatchCareerRoles, useCreateCareerPathway, getGetCareerSignalsQueryKey } from '@workspace/api-client-react';
import type { ProfileInput, Pathway } from '@workspace/api-client-react';
import { useLanguage } from '@/lib/i18n';
import { shouldReplanPathway } from '@/lib/learning';

export const SYNTHETIC: ProfileInput = { skills: ['spreadsheets', 'communication', 'critical-thinking', 'data-analysis'], interests: ['Data & AI', 'Business'], experienceYears: 2, weeklyHours: 6, scenario: 'moderate' };
function load<T>(k: string, d: T): T { try { const r = localStorage.getItem('fp.' + k); return r ? JSON.parse(r) : d; } catch { return d; } }
function usePersist<T>(k: string, d: T) {
  const [v, set] = useState<T>(() => load(k, d));
  useEffect(() => { localStorage.setItem('fp.' + k, JSON.stringify(v)); }, [k, v]);
  return [v, set] as const;
}
function useStore() {
  const { t } = useLanguage();
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
  const [signalSnapshot, setSignalSnapshot] = usePersist<string>('planSignalSnapshot', '');
  // Re-planning on a new job-post snapshot happens silently; only a failure is surfaced (on Pathway).
  const [planUpdateFailed, setPlanUpdateFailed] = useState(false);
  const setProfile = useCallback((next: ProfileInput) => {
    persistProfile(next);
    setRoleId(null);
    setPathway(null);
    setDone([]);
    setPlanUpdateFailed(false);
  }, [persistProfile, setRoleId, setPathway, setDone]);
  const rebuildPathway = useCallback(() => {
    if (!roleId) return;
    path.mutate({ data: { profile, roleId } }, {
      onSuccess: (nextPathway) => { setPathway(nextPathway); setPlanUpdateFailed(false); },
      onError: () => setPlanUpdateFailed(true),
    });
  }, [profile, roleId, path, setPathway]);
  useEffect(() => {
    const fetchedAt = signals.data?.fetchedAt;
    const status = signals.data?.status;
    if (!fetchedAt || !status || status === 'unavailable') return;
    if (!signalSnapshot) { setSignalSnapshot(fetchedAt); return; }
    if (signalSnapshot === fetchedAt) return;
    setSignalSnapshot(fetchedAt);
    if (shouldReplanPathway(signalSnapshot, fetchedAt, status, roleId)) rebuildPathway();
  }, [signals.data?.fetchedAt, signals.data?.status, signalSnapshot, roleId, rebuildPathway, setSignalSnapshot]);
  const mm = useRef(match.mutate); mm.current = match.mutate;
  const key = JSON.stringify(profile) + (signals.data?.fetchedAt ?? '') + (signals.data?.status ?? '');
  useEffect(() => { mm.current({ data: profile }); /* eslint-disable-next-line */ }, [key]);
  const selectRole = useCallback((id: string, onDone?: () => void) => {
    path.mutate({ data: { profile, roleId: id } }, { onSuccess: (p) => {
      setRoleId(id);
      setDone([]);
      setPlanUpdateFailed(false);
      setPathway(p);
      onDone?.();
    } });
  }, [profile, path, setRoleId, setDone, setPathway]);
  const toggle = useCallback((id: string) => setDone((previous) => previous.includes(id) ? previous.filter((x) => x !== id) : [...previous, id]), [setDone]);
  const skills = useMemo(() => new Map((catalog.data?.skills ?? []).map((s) => [s.id, s])), [catalog.data]);
  const skillName = useCallback((id: string) => t(skills.get(id)?.name ?? id), [skills, t]);
  const skillCategory = useCallback((id: string) => skills.get(id)?.category ?? '', [skills]);
  return { catalog, signals, refresh, match, path, profile, setProfile, roleId, pathway, done, toggle, selectRole, rebuildPathway, skillName, skillCategory, planUpdateFailed };
}
const Ctx = createContext<ReturnType<typeof useStore> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) { const s = useStore(); return <Ctx.Provider value={s}>{children}</Ctx.Provider>; }
export const useFP = () => useContext(Ctx)!;
