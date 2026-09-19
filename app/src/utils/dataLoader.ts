/**
 * dataLoader.ts
 *
 * This file intentionally uses a very small, homegrown parser.
 *
 * The goal is not to fully understand Markdown, but to extract a few
 * predictable pieces of structure (sections, bullets, headings) that we
 * treat as a lightweight DSL.
 *
 * Conventions are expected and cheap to follow (especially for bots).
 * If something doesn’t show up, the fix is usually to adjust the source file,
 * not to add more parsing logic here.
 *
 * This code prefers:
 * - clarity over completeness
 * - convention over validation
 * - easy tweaks over long-term guarantees
 *
 * TODO(check if needed):
 * - Loosen or tighten rules as conventions evolve
 * - Add helpers only when patterns actually stabilize
 */

import Papa from "papaparse";
import type {
  DishStatus,
  MealPlan,
  MealPlanRecipe,
  PantryItem,
  RecipeLink,
  RecipeSummary,
  ShoppingList,
} from "../types.js";

const base = import.meta.env.BASE_URL; // "/" in dev, "/easypantry/" in prod (vite base)

/** Minimal fetch helpers to keep loader code readable. */
async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function loadPantryData(): Promise<PantryItem[]> {
  const csvText = await fetchText(`${base}pantry.csv`);

  return new Promise((resolve, reject) => {
    Papa.parse<PantryItem>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error: Error) => reject(error),
    });
  });
}

export async function loadShoppingLists(): Promise<string[]> {
  return fetchJson<string[]>(`${base}shopping-lists/index.json`);
}

export async function loadShoppingList(listId: string): Promise<ShoppingList> {
  return fetchJson<ShoppingList>(`${base}shopping-lists/${listId}.json`);
}

let recipeIndexPromise: Promise<RecipeSummary[]> | null = null;

/** Recipe index is small and static; fetch it once per page load. */
export function loadRecipeIndex(): Promise<RecipeSummary[]> {
  if (!recipeIndexPromise) {
    recipeIndexPromise = fetchJson<RecipeSummary[]>(
      `${base}recipes/index.json`
    ).catch((err) => {
      recipeIndexPromise = null;
      throw err;
    });
  }
  return recipeIndexPromise;
}

/** URL for a photo stored in a recipe's media folder. */
export function recipePhotoUrl(slug: string, photo: string): string {
  return `${base}recipes/${slug}/media/${photo}`;
}

export async function loadMealPlans(): Promise<MealPlan[]> {
  const weekIds = await fetchJson<string[]>(`${base}weekly-meals/index.json`);

  const plans = await Promise.all(
    weekIds.map(async (weekId) => {
      const markdown = await fetchText(`${base}weekly-meals/${weekId}.md`);
      return parseWeeklyMealPlanMarkdown(weekId, markdown);
    })
  );

  return plans;
}

/**
 * Interpret a weekly meal plan markdown file according to the
 * strict-but-forgiving conventions described above.
 *
 * This is *not* a general markdown parser.
 */
function parseWeeklyMealPlanMarkdown(
  weekId: string,
  markdown: string
): MealPlan {
  const lines = markdown.split("\n");

  const metadata = extractWeeklyMealPlanMetadata(weekId, lines);
  const ideas = extractBulletItemsFromSection(lines, "Ideas");
  const meals = extractBulletItemsFromSection(lines, "Meals");
  const recipes = extractRecipeEntriesFromRecipesSection(lines);

  return {
    id: weekId,
    week: metadata.week,
    dateRange: metadata.dateRange,
    title: metadata.title || metadata.week,
    ideas,
    meals,
    recipes,
  };
}

/**
 * Pull lightweight metadata without implementing full YAML frontmatter.
 * This mirrors how weekly meal plans are authored today.
 *
 * TODO(check if needed):
 * - Strip YAML frontmatter if bots start emitting it for weekly plans too
 */
function extractWeeklyMealPlanMetadata(
  weekId: string,
  lines: string[]
): { week: string; dateRange: string; title: string } {
  let week = weekId;
  let dateRange = "";
  let title = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("week:")) {
      week = trimmed.slice("week:".length).trim();
      continue;
    }

    if (trimmed.startsWith("date_range:")) {
      dateRange = trimmed.slice("date_range:".length).trim();
      continue;
    }

    if (!title && trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      title = trimmed.slice(2).trim();
    }
  }

  return { week, dateRange, title };
}

/**
 * Return all lines under a `## <Section>` header until the next `## ...`.
 * Missing sections simply return [].
 */
function getLinesUnderH2Section(
  lines: string[],
  sectionName: string
): string[] {
  const header = `## ${sectionName}`.toLowerCase();

  const startIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === header
  );
  if (startIndex === -1) return [];

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("## ") && trimmed.toLowerCase() !== header) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex + 1, endIndex);
}

/**
 * Extract `- item` bullet lines from a named section.
 *
 * TODO(check if needed):
 * - Accept "* " bullets if bots start emitting them
 */
function extractBulletItemsFromSection(
  lines: string[],
  sectionName: string
): string[] {
  const sectionLines = getLinesUnderH2Section(lines, sectionName);
  const items: string[] = [];

  for (const line of sectionLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      items.push(trimmed.slice(2).trim());
    }
  }

  return items;
}

/**
 * Extract planned dishes from the `## Recipes` section.
 *
 * Each dish starts with a `###` heading (optionally linking a recipe file).
 * Under it, these conventions are recognized:
 *
 *   **Status:** planned | made | skipped — optional note
 *   **Inspired by:** [Name](../recipes/slug/recipe.md), [Other](...)
 *   - ingredient lines (after **Ingredients needed:**)
 *   #### Variation name   (followed by its own `- ` ingredient lines)
 *
 * Missing status (older plans) means no status is shown.
 */
function extractRecipeEntriesFromRecipesSection(
  lines: string[]
): MealPlanRecipe[] {
  const sectionLines = getLinesUnderH2Section(lines, "Recipes");
  const recipes: MealPlanRecipe[] = [];
  let current: MealPlanRecipe | null = null;
  let currentVariation: { name: string; ingredients: string[] } | null = null;

  for (const line of sectionLines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      current = {
        ...parseRecipeReferenceHeading(trimmed.slice(4).trim()),
        inspiredBy: [],
        ingredients: [],
        variations: [],
      };
      currentVariation = null;
      recipes.push(current);
      continue;
    }
    if (!current) continue;

    if (trimmed.startsWith("#### ")) {
      currentVariation = { name: trimmed.slice(5).trim(), ingredients: [] };
      current.variations.push(currentVariation);
      continue;
    }

    const statusMatch = trimmed.match(/^\*\*Status:\*\*\s*(\w+)\s*(?:[—–-]\s*(.*))?$/i);
    if (statusMatch) {
      const value = statusMatch[1].toLowerCase();
      if (value === "made" || value === "skipped" || value === "planned") {
        current.status = value as DishStatus;
      }
      if (statusMatch[2]) current.statusNote = statusMatch[2].trim();
      continue;
    }

    if (/^\*\*Inspired by:\*\*/i.test(trimmed)) {
      current.inspiredBy = parseMarkdownLinks(trimmed);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const item = trimmed.slice(2).trim();
      if (currentVariation) currentVariation.ingredients.push(item);
      else current.ingredients.push(item);
    }
  }

  return recipes;
}

/** All `[name](path)` links in a line. */
function parseMarkdownLinks(text: string): RecipeLink[] {
  const links: RecipeLink[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    links.push({ name: m[1], path: normalizeContentPath(m[2]) || undefined });
  }
  return links;
}

/**
 * Parse a single recipe reference heading:
 * - "Recipe Name"
 * - "[Recipe Name](recipe/slug/recipe.md)"
 *
 * This does not parse the recipe itself — only the reference.
 */
function parseRecipeReferenceHeading(content: string): RecipeLink {
  let name = content;
  let path: string | undefined;

  if (content.startsWith("[")) {
    const closingBracketIndex = content.indexOf("]");
    if (closingBracketIndex > 1) {
      name = content.slice(1, closingBracketIndex);

      const openParenIndex = content.indexOf("(", closingBracketIndex);
      const closeParenIndex = content.indexOf(")", openParenIndex);
      if (openParenIndex !== -1 && closeParenIndex !== -1) {
        const linkTarget = content.slice(openParenIndex + 1, closeParenIndex);
        const normalized = normalizeContentPath(linkTarget);
        if (normalized) path = normalized;
      }
    }
  }

  return { name, path };
}

/**
 * Normalize markdown link paths so they can be fetched via `${base}${path}`.
 */
function normalizeContentPath(rawPath: string): string {
  const trimmed = rawPath.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("../")) return trimmed.slice(3);
  if (trimmed.startsWith("./")) return trimmed.slice(2);
  if (trimmed.startsWith("/")) return trimmed.slice(1);

  return trimmed;
}
