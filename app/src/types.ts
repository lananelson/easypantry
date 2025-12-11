export interface PantryItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  container_state: string;
  location: string;
  perishable: "yes" | "no";
  urgency: "high" | "medium" | "low";
  vendor: string;
  stock_requirement: string;
  notes: string;
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
  [key: string]: {
    collapsed?: boolean;
    checkedItems?: string[];
  };
}

