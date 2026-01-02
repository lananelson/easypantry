import Papa from "papaparse";
import type {
  MealPlan,
  MealPlanRecipe,
  PantryItem,
  ShoppingList,
} from "../types.js";

const base = import.meta.env.BASE_URL; // "/" in dev, "/easypantry/" in prod (per vite base)

export async function loadPantryData(): Promise<PantryItem[]> {
  const response = await fetch(`${base}pantry.csv`);
  if (!response.ok) {
    throw new Error(`Failed to load pantry.csv (${response.status})`);
  }
  const csvText = await response.text();

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
  const res = await fetch(`${base}shopping-lists/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to load shopping list index (${res.status})`);
  }
  return res.json();
}

export async function loadShoppingList(listId: string): Promise<ShoppingList> {
  const response = await fetch(`${base}shopping-lists/${listId}.json`);
  if (!response.ok) {
    throw new Error(
      `Failed to load shopping list ${listId} (${response.status})`
    );
  }
  return response.json();
}

export async function loadMealPlans(): Promise<MealPlan[]> {
  const res = await fetch(`${base}weekly-meals/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to load meal plan index (${res.status})`);
  }
  const weekIds: string[] = await res.json();

  const plans = await Promise.all(
    weekIds.map(async (weekId) => {
      const response = await fetch(`${base}weekly-meals/${weekId}.md`);
      if (!response.ok) {
        throw new Error(
          `Failed to load meal plan ${weekId} (${response.status})`
        );
      }
      const text = await response.text();
      return parseMealPlanMarkdown(weekId, text);
    })
  );

  return plans;
}

function parseMealPlanMarkdown(weekId: string, text: string): MealPlan {
  const lines = text.split("\n");
  let week = weekId;
  let dateRange = "";
  let title = "";

  // Extract frontmatter-ish fields and main title
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("week:")) {
      week = trimmed.slice("week:".length).trim();
    } else if (trimmed.startsWith("date_range:")) {
      dateRange = trimmed.slice("date_range:".length).trim();
    } else if (
      !title &&
      trimmed.startsWith("# ") &&
      !trimmed.startsWith("## ")
    ) {
      title = trimmed.slice(2).trim();
    }
  }

  const ideas = extractListSection(lines, "## Ideas");
  const meals = extractListSection(lines, "## Meals");
  const recipes = extractRecipeHeadings(lines);

  return {
    id: weekId,
    week,
    dateRange,
    title: title || week,
    ideas,
    meals,
    recipes,
  };
}

function extractListSection(lines: string[], header: string): string[] {
  const headerIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === header.toLowerCase()
  );
  if (headerIndex === -1) return [];

  // Find next section header starting with "## "
  let endIndex = lines.length;
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (
      trimmed.startsWith("## ") &&
      trimmed.toLowerCase() !== header.toLowerCase()
    ) {
      endIndex = i;
      break;
    }
  }

  const items: string[] = [];
  for (let i = headerIndex + 1; i < endIndex; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("- ")) {
      items.push(trimmed.slice(2).trim());
    }
  }

  return items;
}

function normalizeRecipePath(rawPath: string): string {
  const trimmed = rawPath.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("../")) return trimmed.slice(3);
  if (trimmed.startsWith("./")) return trimmed.slice(2);
  if (trimmed.startsWith("/")) return trimmed.slice(1);

  return trimmed;
}

function extractRecipeHeadings(lines: string[]): MealPlanRecipe[] {
  const recipes: MealPlanRecipe[] = [];
  let inRecipesSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toLowerCase() === "## recipes") {
      inRecipesSection = true;
      continue;
    }

    if (
      inRecipesSection &&
      trimmed.startsWith("## ") &&
      !trimmed.startsWith("### ")
    ) {
      // Another top-level section after Recipes
      break;
    }

    if (inRecipesSection && trimmed.startsWith("### ")) {
      const content = trimmed.slice(4).trim();
      let name = content;
      let path: string | undefined;

      // If it's a markdown link like [Text](../recipes/slug/recipe.md)
      if (content.startsWith("[")) {
        const closingBracketIndex = content.indexOf("]");
        if (closingBracketIndex > 1) {
          name = content.slice(1, closingBracketIndex);

          const openParenIndex = content.indexOf("(", closingBracketIndex);
          const closeParenIndex = content.indexOf(")", openParenIndex);
          if (openParenIndex !== -1 && closeParenIndex !== -1) {
            const linkTarget = content.slice(
              openParenIndex + 1,
              closeParenIndex
            );
            const normalized = normalizeRecipePath(linkTarget);
            if (normalized) path = normalized;
          }
        }
      }

      recipes.push({ name, path });
    }
  }

  return recipes;
}
