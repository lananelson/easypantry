export type Urgency = "high" | "medium" | "low";
export type Perishable = "yes" | "no";

export const URGENCY_ORDER: Record<Urgency, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

export const PERISHABLE_ORDER: Record<Perishable, number> = {
  yes: 1,
  no: 2,
};

export interface PantryItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  container_state: string;
  location: string;
  perishable: Perishable;
  urgency: Urgency;
  vendor: string;
  stock_requirement: string;
  notes: string;
}

export function getComparableValue(
  item: PantryItem,
  key: keyof PantryItem
): string | number {
  const value = item[key];

  if (key === "urgency") {
    return URGENCY_ORDER[value as Urgency] ?? 999;
  }

  if (key === "perishable") {
    return PERISHABLE_ORDER[value as Perishable] ?? 999;
  }

  return value;
}

export interface ShoppingListItem {
  name: string;
  for: string[];
}

export interface ShoppingList {
  title: string;
  week: string;
  created: string;
  status: "active" | "completed";
  completed_date: string | null;
  items: ShoppingListItem[];
}

export interface RecipeLink {
  name: string;
  /** Path to recipe markdown relative to public root, e.g. "recipes/birria-tacos/recipe.md" */
  path?: string;
}

/** planned → made, or skipped when it didn't happen. */
export type DishStatus = "planned" | "made" | "skipped";

export interface DishVariation {
  name: string;
  ingredients: string[];
}

export interface MealPlanRecipe extends RecipeLink {
  /** Absent in plans written before statuses existed; no badge is shown then. */
  status?: DishStatus;
  /** Free text after the status, e.g. "zucchini went bad". */
  statusNote?: string;
  /** Recipes this dish borrows from (hybrids reference several). */
  inspiredBy: RecipeLink[];
  ingredients: string[];
  variations: DishVariation[];
}

export interface RecipePhoto {
  file: string;
  /** Pixel size; 0 when the generator couldn't read it. */
  width: number;
  height: number;
}

/** One entry of public/recipes/index.json (built by scripts/generate-indexes.mjs). */
export interface RecipeSummary {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  photos: RecipePhoto[];
  ingredients: string[];
  hasInstructions: boolean;
}

export interface MealPlan {
  id: string;
  week: string;
  dateRange: string;
  title: string;
  ideas: string[];
  meals: string[];
  recipes: MealPlanRecipe[];
}

export interface AppState {
  nav?: {
    active: "pantry" | "shopping" | "meals" | "recipes";
  };
  pantry?: {
    sortBy: keyof PantryItem;
    sortOrder: "asc" | "desc";
  };
  shoppingLists?: {
    [listWeek: string]: {
      collapsed: boolean;
      checkedItems: string[];
    };
  };
}
