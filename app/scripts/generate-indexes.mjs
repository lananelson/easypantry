import { promises as fs } from "node:fs";
import path from "node:path";

const APP_DIR = process.cwd(); // repo/app
const PUBLIC_DIR = path.resolve(APP_DIR, "../public");

async function listIds(relDir, ext) {
  const absDir = path.join(PUBLIC_DIR, relDir);
  const entries = await fs.readdir(absDir, { withFileTypes: true });

  return entries
    .filter(
      (e) => e.isFile() && e.name.endsWith(ext) && e.name !== "index.json"
    )
    .map((e) => e.name.slice(0, -ext.length))
    .sort();
}

async function writeIndex(relDir, ids) {
  const absPath = path.join(PUBLIC_DIR, relDir, "index.json");
  await fs.writeFile(absPath, JSON.stringify(ids, null, 2) + "\n");
  console.log(`✔ wrote ${relDir}/index.json (${ids.length})`);
}

async function main() {
  const shoppingLists = await listIds("shopping-lists", ".json");
  const weeklyMeals = await listIds("weekly-meals", ".md");

  await writeIndex("shopping-lists", shoppingLists);
  await writeIndex("weekly-meals", weeklyMeals);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
