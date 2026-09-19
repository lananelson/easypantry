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

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Read pixel size from a JPEG or PNG header; null if unrecognized. */
async function imageSize(file) {
  const buf = await fs.readFile(file);
  // PNG: width/height at bytes 16-23 of the IHDR chunk
  if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk segments until a start-of-frame marker
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      const isSOF =
        marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSOF) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

function frontmatterValue(md, key) {
  const m = md.match(new RegExp(`^${key}:[ \\t]*([^\\n]*)$`, "m"));
  return m ? m[1].trim() : "";
}

function sectionLines(md, name) {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${name}`);
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    out.push(lines[i]);
  }
  return out;
}

/** One entry per recipe folder: enough for browsing, searching and photos. */
async function buildRecipeIndex() {
  const recipesDir = path.join(PUBLIC_DIR, "recipes");
  const dirs = await fs.readdir(recipesDir, { withFileTypes: true });
  const recipes = [];

  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const slug = d.name;
    let md;
    try {
      md = await fs.readFile(path.join(recipesDir, slug, "recipe.md"), "utf8");
    } catch {
      continue;
    }

    const photos = [];
    try {
      const mediaDir = path.join(recipesDir, slug, "media");
      const files = (await fs.readdir(mediaDir))
        .filter((f) => IMAGE_EXT.test(f))
        .sort();
      for (const file of files) {
        const size = await imageSize(path.join(mediaDir, file));
        photos.push({ file, width: size?.width ?? 0, height: size?.height ?? 0 });
      }
    } catch {
      // no media folder
    }

    const category = frontmatterValue(md, "category");
    const tagsRaw = frontmatterValue(md, "tags").replace(/^\[|\]$/g, "");
    const ingredients = sectionLines(md, "Ingredients")
      .filter((l) => l.trim().startsWith("- "))
      .map((l) => l.trim().slice(2));
    const hasInstructions = sectionLines(md, "Instructions").some((l) =>
      /^\d+\./.test(l.trim())
    );

    recipes.push({
      slug,
      title: frontmatterValue(md, "title") || slug,
      category,
      tags: tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      photos,
      ingredients,
      hasInstructions,
    });
  }

  recipes.sort((a, b) => a.title.localeCompare(b.title));
  const absPath = path.join(recipesDir, "index.json");
  await fs.writeFile(absPath, JSON.stringify(recipes, null, 2) + "\n");
  console.log(`✔ wrote recipes/index.json (${recipes.length})`);
}

async function main() {
  await buildRecipeIndex();
  const shoppingLists = await listIds("shopping-lists", ".json");
  const weeklyMeals = await listIds("weekly-meals", ".md");

  await writeIndex("shopping-lists", shoppingLists);
  await writeIndex("weekly-meals", weeklyMeals);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
