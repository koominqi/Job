type Translate = (key: string, params?: Record<string, string | number>) => string;

// Translate presentation text without changing the server's scores, skill IDs or assumptions.
export function matchExplanation(text: string, t: Translate) {
  return text
    .replace(/(\d+) of (\d+) role skills matched\./g, (_, matched: string, total: string) => t('{matched} of {total} role skills matched.', { matched, total }))
    .replace(/(\d+)% skill readiness \+ 15% sector interest \+ (\d+)% observed keyword demand\./g, (_, readiness: string, demand: string) => t('{readiness}% skill readiness + 15% sector interest + {demand}% observed keyword demand.', { readiness, demand }))
    .replace('Feed unavailable: 85% readiness + 15% sector interest; market demand excluded.', t('Feed unavailable: 85% readiness + 15% sector interest; market demand excluded.'))
    .replace(/A (\d+)-point scenario assumption is applied for routine-task exposure\./g, (_, points: string) => t('A {points}-point scenario assumption is applied for routine-task exposure.', { points }))
    .replace('Experience is context only, not a demographic proxy; years of experience do not determine suitability.', t('Experience is context only, not a demographic proxy; years of experience do not determine suitability.'));
}
export function pathwaySummary(text: string, t: Translate) {
  const match = text.match(/^(\d+) learning steps toward (.+), based on your current skills and (\d+) hours per week\.$/);
  return match ? t('{count} learning steps toward {role}, based on your current skills and {hours} hours per week.', { count: match[1], role: t(match[2]), hours: match[3] }) : t(text);
}
export function signalWarning(text: string, t: Translate) {
  const prefix = 'Refresh failed. Showing the last successful snapshot with its original fetch date.';
  return text.startsWith(prefix) ? `${t(prefix)} ${t(text.slice(prefix.length).trim())}` : t(text);
}
