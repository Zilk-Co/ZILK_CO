import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/projects", async (_req, res) => {
  try {
    const rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.index));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, req.params.id))
      .limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to load project" });
  }
});

export default router;
