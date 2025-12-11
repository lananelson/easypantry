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

export interface AppState {
  nav?: {
    active: "pantry" | "shopping" | "meals";
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
