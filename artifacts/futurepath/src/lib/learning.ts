export const learningBadges = [
  { id: 'first-step', target: 1, title: 'First step', description: 'Complete your first learning step.' },
  { id: 'skill-builder', target: 3, title: 'Skill builder', description: 'Complete three learning steps.' },
  { id: 'pathway-finished', target: Number.POSITIVE_INFINITY, title: 'Pathway finisher', description: 'Complete every step in this pathway.' },
] as const;

export type LearningBadgeId = (typeof learningBadges)[number]['id'];

export function earnedBadgeIds(completed: number, total: number): LearningBadgeId[] {
  if (total < 1) return [];
  return learningBadges.filter((badge) =>
    badge.id === 'pathway-finished' ? completed >= total : completed >= badge.target,
  ).map((badge) => badge.id);
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
