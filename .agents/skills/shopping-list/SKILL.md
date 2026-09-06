---
name: shopping-list
description: Generate or regenerate an EasyPantry shopping list from a weekly meal plan and pantry state, optionally for a named vendor.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

This workflow consumes a developed [Meal plan](../meal-plan/SKILL.md). If no plan exists, use restock-only mode or discuss meal planning with the user rather than inventing meals.

## Build the list

1. Determine the target ISO week; confirm only when ambiguous.
2. Read `public/weekly-meals/<week>.md` and `public/pantry.csv`.
3. Include confirmed `(need to buy)` ingredients from the plan. If pantry data is stale or conflicts with the conversation, resolve uncertain items with the user rather than treating them as missing.
4. Include out-of-stock items with `stock_requirement="keep in stock"`:
   - If used by a planned recipe, use the recipe names in `for`.
   - Otherwise use `for: ["restock"]`.
5. If the user names a vendor, include relevant keep-in-stock items likely sold there.
6. Write `public/shopping-lists/<week>.json` and maintain its index. New lists use `status: "active"` and `completed_date: null`.

```json
{
  "title": "Week XX (Mon DD-DD, YYYY)",
  "week": "YYYY-WXX",
  "created": "YYYY-MM-DD",
  "status": "active",
  "completed_date": null,
  "items": [{ "name": "Item name", "for": ["recipe name"] }]
}
```

Present the generated list for confirmation before writing it.
