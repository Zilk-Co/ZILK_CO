import { db, pool } from "../src/index";
import { projectsTable } from "../src/schema/projects";
import { postsTable } from "../src/schema/posts";
import { SEED_PROJECTS, SEED_POSTS } from "../src/seed/data";

async function createTablesIfMissing() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id text PRIMARY KEY,
      "index" integer NOT NULL,
      title text NOT NULL,
      category text NOT NULL,
      description text NOT NULL,
      year text NOT NULL,
      duration text NOT NULL,
      type text NOT NULL,
      overview jsonb NOT NULL,
      challenge text NOT NULL,
      challenge_quote text NOT NULL,
      solution text NOT NULL,
      solution_points jsonb NOT NULL,
      features jsonb NOT NULL,
      tech jsonb NOT NULL,
      status text NOT NULL,
      url text NOT NULL,
      image text NOT NULL,
      image_position text NOT NULL,
      featured boolean NOT NULL,
      accent_hue integer NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      slug text PRIMARY KEY,
      title text NOT NULL,
      excerpt text NOT NULL,
      date text NOT NULL,
      read_time text NOT NULL,
      category text NOT NULL,
      content jsonb NOT NULL,
      published_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function main() {
  await createTablesIfMissing();

  for (const project of SEED_PROJECTS) {
    await db
      .insert(projectsTable)
      .values(project)
      .onConflictDoUpdate({ target: projectsTable.id, set: project });
  }

  for (const post of SEED_POSTS) {
    await db
      .insert(postsTable)
      .values(post)
      .onConflictDoUpdate({ target: postsTable.slug, set: post });
  }

  const [{ projects }] = (await pool.query(
    `SELECT COUNT(*)::int AS projects FROM projects`,
  )).rows;
  const [{ posts }] = (await pool.query(
    `SELECT COUNT(*)::int AS posts FROM posts`,
  )).rows;

  console.log(`Seed complete: ${projects} projects, ${posts} posts in database.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
