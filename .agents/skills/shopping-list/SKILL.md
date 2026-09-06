---
name: shopping-list
description: Generate or regenerate an EasyPantry shopping list for a target week, including vendor-specific restocking when requested.
---

Follow the Pantry Keeper role in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Generate the list immediately from the meal plan and pantry data. Confirm only when the target week is ambiguous, such as late in the current week. Show the generated list for confirmation before writing it.

## Build the list

1. Determine whether the user means the current or next ISO week from their wording and today's date.
2. Read `public/weekly-meals/<target-week>.md`:
   - If it does not exist, follow [Meal plan](../meal-plan/SKILL.md) when the user wants to plan meals.
   - If it exists but contains no recipes, continue in restock-only mode.
   - Otherwise collect its recipes and needed ingredients, then cross-reference `public/pantry.csv` to identify what is missing.
3. If the user named a vendor, inspect every pantry row with `quantity=0` and `stock_requirement="keep in stock"`; include the items likely available from that vendor.
4. Include keep-in-stock items whose quantity is or will become `0` after the planned meals:
   - When the item is not used by a recipe that week, use `for: ["restock"]`.
   - When it is used by one or more recipes, treat it as a normal ingredient and put those recipe names in `for`.
5. Create or update `public/shopping-lists/<target-week>.json`. New lists use `status: "active"` and `completed_date: null`.

## JSON format

```json
{
  "title": "Week XX (Mon DD-DD, YYYY)",
  "week": "YYYY-WXX",
  "created": "YYYY-MM-DD",
  "status": "active",
  "completed_date": null,
  "items": [{ "name": "Item name", "for": ["recipe 1", "recipe 2"] }]
}
```

- `for` contains the meal-plan recipe names that require the item, or `"restock"` for a pure restock.
- `status` is `active` for a current list or `completed` after the shopping trip; completed lists are collapsed by default on the website.
