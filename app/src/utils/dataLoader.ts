import Papa from "papaparse";
import type { PantryItem, ShoppingList } from "../types.js";

export async function loadPantryData(): Promise<PantryItem[]> {
  const response = await fetch("/easypantry/pantry.csv");
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<PantryItem>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

export async function loadShoppingLists(): Promise<string[]> {
  // For now, we'll hardcode the list of shopping list IDs
  // In the future, we could generate an index file
  return ["2025-W50"];
}

export async function loadShoppingList(listId: string): Promise<ShoppingList> {
  const response = await fetch(`/easypantry/shopping-lists/${listId}.json`);
  return response.json();
}
