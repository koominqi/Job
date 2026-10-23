export type BadgeStep = { id: string; skillId: string };
export type SkillBadge = BadgeStep & { order: number; earned: boolean };

/** One badge per pathway skill plus a finisher trophy; all derived from self-reported completion. */
export function badgeShelf(steps: BadgeStep[], done: string[]) {
  const skills: SkillBadge[] = steps.map((step, index) => ({ ...step, order: index + 1, earned: done.includes(step.id) }));
  const completed = skills.filter((badge) => badge.earned).length;
  const finished = skills.length > 0 && completed === skills.length;
  return { skills, finished, completed, earned: completed + (finished ? 1 : 0), total: skills.length ? skills.length + 1 : 0 };
}

export function shouldReplanPathway(
  previousFetchedAt: string,
  currentFetchedAt: string,
  status: string,
  roleId: string | null,
): boolean {
  return Boolean(previousFetchedAt && currentFetchedAt && previousFetchedAt !== currentFetchedAt &&
    status !== 'unavailable' && roleId);
}
