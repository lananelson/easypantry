---
name: pantry-update
description: Update EasyPantry inventory when the user reports food used, purchased, finished, moved, or otherwise changed.
---

Follow the Pantry Keeper role in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Read `public/pantry.csv`, apply only the changes the user described, and show the diff for confirmation. Ask a clarifying question only when the requested change is genuinely ambiguous.

## Pantry rules

- Edit only `public/pantry.csv`; do not change the CSV header or column order.
- Add, remove, or adjust rows and fields such as quantity, location, urgency, and notes as directed.
- Do not invent additional consumption, purchases, or other pantry changes.
- Never write `n.a.`. Leave an unavailable field empty.
- When an item's quantity becomes `0`:
  - Remove the row when `stock_requirement` is empty or zero.
  - Keep the row at quantity `0` when `stock_requirement` is non-empty, such as `keep in stock`.

## Meal-log handoff

When the pantry change is clearly tied to a meal or recipe:

1. Check the current week's [meal plan](../meal-plan/SKILL.md). If the file does not exist, this handoff does not apply.
2. If the recipe exists under `## Recipes`, suggest adding or updating a linked entry under `## Meals`.
3. The suggested entry may note important pantry items used or finished.
4. Ask before changing the meal-plan file; a pantry update does not itself authorize that separate change.
