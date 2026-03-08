import { Hono } from "hono";
import type { Env } from './core-utils';
import { ResearchEntity } from "./entities";
import { ok, bad } from './core-utils';
import { performResearch } from './research-engine';
import type { ResearchProfile } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/research', async (c) => {
    const profile = (await c.req.json()) as ResearchProfile;
    if (!profile.legalName || !profile.state) {
      return bad(c, 'Legal name and state are required');
    }
    try {
      const result = await performResearch(profile);
      await ResearchEntity.create(c.env, result);
      return ok(c, result);
    } catch (err) {
      console.error('Research Engine Error:', err);
      return bad(c, 'Critical failure in research engine');
    }
  });
  app.get('/api/history', async (c) => {
    const page = await ResearchEntity.list(c.env, null, 20);
    // Sort by timestamp descending
    const sorted = page.items.sort((a, b) => b.timestamp - a.timestamp);
    return ok(c, sorted);
  });
  app.get('/api/research/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new ResearchEntity(c.env, id);
    if (!await entity.exists()) return bad(c, 'Report not found');
    return ok(c, await entity.getState());
  });
}