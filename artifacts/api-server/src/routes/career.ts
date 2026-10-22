import { Router, type IRouter } from "express";
import {
  GetCareerCatalogResponse, GetCareerSignalsResponse, RefreshCareerSignalsResponse,
  MatchCareerRolesBody, MatchCareerRolesResponse, CreateCareerPathwayBody, CreateCareerPathwayResponse,
} from "@workspace/api-zod";
import { catalog, skills } from "../lib/career-catalog";
import { getSignals } from "../lib/career-signals";
import { matchRoles, buildPathway } from "../lib/career-engine";

const router: IRouter = Router();
router.get("/career/catalog", (_req, res) => {
  res.json(GetCareerCatalogResponse.parse(catalog));
});
router.get("/career/signals", async (_req, res): Promise<void> => {
  res.json(GetCareerSignalsResponse.parse(await getSignals()));
});
router.post("/career/signals", async (_req, res): Promise<void> => {
  res.json(RefreshCareerSignalsResponse.parse(await getSignals(true)));
});
router.post("/career/matches", async (req, res): Promise<void> => {
  const parsed = MatchCareerRolesBody.safeParse(req.body);
  if (!parsed.success || parsed.data.skills.some(id => !skills.some(s => s.id === id))) {
    res.status(400).json({ error: "Provide valid skill IDs, weekly hours, experience and scenario." }); return;
  }
  res.json(MatchCareerRolesResponse.parse(await matchRoles(parsed.data)));
});
router.post("/career/pathway", async (req, res) => {
  const parsed = CreateCareerPathwayBody.safeParse(req.body);
  if (!parsed.success || parsed.data.profile.skills.some(id => !skills.some(s => s.id === id))) {
    res.status(400).json({ error: "Invalid profile or role." }); return;
  }
  const result = await buildPathway(parsed.data.profile, parsed.data.roleId);
  if (!result) { res.status(404).json({ error: "Role not found." }); return; }
  res.json(CreateCareerPathwayResponse.parse(result));
});
export default router;
