import { skills } from "./career-catalog";
import { logger } from "./logger";

export type Signal = { id: string; title: string; source: string; url: string; publishedAt: string; skills: string[] };
export type Report = {
  status: "live" | "cached" | "unavailable"; fetchedAt: string; sourceUrl: string; sourceName: string;
  totalJobs: number; signals: Signal[]; demand: { skillId: string; mentions: number; share: number }[];
  warning: string; methodology: string;
};
let cache: Report | undefined;
let inFlight: Promise<Report> | undefined;
let lastAttempt = 0;
const TTL = 6 * 60 * 60 * 1000;
const methodology = "Share of fetched Remotive postings mentioning a skill keyword, counting each skill once per posting. This is a cross-sectional sample, not growth or a job forecast. Global remote vacancies are not representative of the Malaysian labour market. Remotive listings may be delayed. Some AI keywords overlap.";
const base = { sourceUrl: "https://remotive.com/api/remote-jobs", sourceName: "Remotive", methodology };

async function fetchSignals(): Promise<Report> {
  lastAttempt = Date.now();
  try {
    const response = await fetch(base.sourceUrl, { signal: AbortSignal.timeout(18000), headers: { "User-Agent": "FuturePath-Career-Demo/1.0" } });
    if (!response.ok) throw new Error(`Remotive returned ${response.status}`);
    const body = await response.json() as { jobs?: { id: number; title: string; description: string; tags?: string[]; url: string; publication_date: string }[] };
    if (!Array.isArray(body.jobs) || !body.jobs.length) throw new Error("No job postings returned");
    const signals = body.jobs.slice(0, 1000).map(job => {
      const text = ` ${job.title} ${job.description.replace(/<[^>]*>/g, " ")} ${(job.tags ?? []).join(" ")} `.toLowerCase();
      return { id: String(job.id), title: job.title, source: "Remotive", url: job.url, publishedAt: job.publication_date, skills: skills.filter(s => s.keywords.some(k => text.includes(k))).map(s => s.id) };
    });
    cache = {
      ...base, status: "live", fetchedAt: new Date().toISOString(), totalJobs: signals.length, signals,
      demand: skills.map(s => {
        const mentions = signals.filter(j => j.skills.includes(s.id)).length;
        return { skillId: s.id, mentions, share: Math.round(mentions / signals.length * 1000) / 10 };
      }).sort((a, b) => b.mentions - a.mentions),
      warning: "Global remote-job sample, not Malaysian market statistics. Skill demand and scenario scores are estimates, not guarantees.",
    };
    return cache;
  } catch (err) {
    logger.warn({ err }, "Public trend feed unavailable");
    if (cache) return { ...cache, status: "cached", warning: "Refresh failed. Showing the last successful snapshot with its original fetch date. " + cache.warning };
    return { ...base, status: "unavailable", fetchedAt: "", totalJobs: 0, signals: [], demand: [], warning: "Remotive is temporarily unavailable. No job-market statistics are being fabricated. Matching uses skill readiness and interests only until the source recovers." };
  }
}

export async function getSignals(refresh = false): Promise<Report> {
  if (inFlight) return inFlight;
  // A manual refresh invalidates the normal TTL but observes a one-minute upstream cooldown.
  if (cache && ((!refresh && Date.now() - Date.parse(cache.fetchedAt) < TTL) || Date.now() - lastAttempt < 60000)) return { ...cache, status: "cached" };
  if (!cache && Date.now() - lastAttempt < 60000) return { ...base, status: "unavailable", fetchedAt: "", totalJobs: 0, signals: [], demand: [], warning: "Feed unavailable; retry after a minute. Matching currently excludes market demand." };
  inFlight = fetchSignals();
  try { return await inFlight; } finally { inFlight = undefined; }
}
