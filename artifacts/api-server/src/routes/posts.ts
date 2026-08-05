import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/blog", async (_req, res) => {
  try {
    const rows = await db.select().from(postsTable).orderBy(desc(postsTable.publishedAt));
    res.json(
      rows.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        readTime: post.readTime,
        category: post.category,
        content: post.content,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to load posts" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.slug, req.params.slug))
      .limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const post = rows[0];
    res.json({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readTime: post.readTime,
      category: post.category,
      content: post.content,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load post" });
  }
});

export default router;
