import { MatchCareerRolesBody } from "@workspace/api-zod";
import { roles, resources, skills } from "./career-catalog";
import { getSignals } from "./career-signals";

export type Profile = ReturnType<typeof MatchCareerRolesBody.parse>;
export async function matchRoles(profile: Profile) {
  const signals = await getSignals();
  const fast = profile.scenario === "fast";
  const available = signals.status !== "unavailable";
  const readinessWeight = fast ? 0.55 : 0.65;
  const demandWeight = fast ? 0.3 : 0.2;
  const matches = roles.map(role => {
    const matchedSkills = role.skills.filter(s => profile.skills.includes(s));
    const missingSkills = role.skills.filter(s => !profile.skills.includes(s));
    const readinessScore = Math.round(matchedSkills.length / role.skills.length * 100);
    const interestScore = profile.interests.includes(role.sector) ? 100 : 0;
    const counts = role.skills.map(s => signals.demand.find(d => d.skillId === s)?.share ?? 0);
    const demandScore = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
    const rawScore = available ? readinessScore * readinessWeight + interestScore * 0.15 + demandScore * demandWeight : readinessScore * 0.85 + interestScore * 0.15;
    // Scenario penalties are assumptions rather than claims about observed displacement.
    const penalty = role.outlook === "declining" ? (fast ? 18 : 8) : 0;
    const score = Math.max(0, Math.min(100, Math.round(rawScore - penalty)));
    return {
      role, score, matchedSkills, missingSkills, readinessScore, interestScore, demandScore,
      explanation: `${matchedSkills.length} of ${role.skills.length} role skills matched. ${available ? `${Math.round(readinessWeight * 100)}% skill readiness + 15% sector interest + ${Math.round(demandWeight * 100)}% observed keyword demand.` : "Feed unavailable: 85% readiness + 15% sector interest; market demand excluded."} ${penalty ? `A ${penalty}-point scenario assumption is applied for routine-task exposure.` : ""} Experience is context only, not a demographic proxy; years of experience do not determine suitability.`,
      signalIds: signals.signals.filter(s => s.skills.some(id => role.skills.includes(id))).slice(0, 3).map(s => s.id),
    };
  }).sort((a, b) => b.score - a.score);
  return {
    matches, scenario: profile.scenario, signalStatus: signals.status,
    methodology: "Explainable rule-based scores, not hiring decisions or probabilities. Moderate assumes slower disruption (65% readiness / 15% interest / 20% demand); fast weights current market signals more (55% / 15% / 30%). Declining-role penalties of 8/18 points are illustrative scenario assumptions. Keyword share is not measured market growth. No language model is used.",
  };
}

export async function buildPathway(profile: Profile, roleId: string) {
  const role = roles.find(r => r.id === roleId);
  if (!role) return undefined;
  const roleOrder = new Map(role.skills.map((id, index) => [id, index]));
  const report = await getSignals();
  const shares = new Map(report.demand.map(item => [item.skillId, item.share]));
  const missing = role.skills.filter(id => !profile.skills.includes(id)).sort((a, b) =>
    (shares.get(b) ?? 0) - (shares.get(a) ?? 0) || roleOrder.get(a)! - roleOrder.get(b)!,
  );
  let elapsedHours = 0;
  const steps = missing.map(id => {
    const resource = resources[id]!;
    const start = Math.floor(elapsedHours / profile.weeklyHours) + 1;
    elapsedHours += resource.hours;
    return {
      id: `${role.id}-${id}`, title: resource.title, skillId: id, hours: resource.hours,
      weekStart: start, weekEnd: Math.ceil(elapsedHours / profile.weeklyHours),
      provider: resource.provider, url: resource.url, cost: "Free learning materials; certificates or optional extras may cost extra",
      sdgs: skills.find(s => s.id === id)!.sdgs, outcome: resource.outcome,
    };
  });
  return {
    role, steps, totalHours: elapsedHours, totalWeeks: Math.ceil(elapsedHours / profile.weeklyHours),
    summary: missing.length ? `${missing.length} learning steps toward ${role.title}, based on your current skills and ${profile.weeklyHours} hours per week.` : "You report all the mapped foundational skills. Validate them with a portfolio project and seek human career guidance.",
    disclaimer: "Study hours are FuturePath planning estimates, not provider-certified course durations. Availability and pricing can change: check each linked provider. These resources build foundations, not guaranteed employment or qualifications. SDG links describe potential contribution, not verified impact.",
  };
}
