---
name: pantry-update
description: Update EasyPantry inventory from items used, purchased, finished, moved, or otherwise changed.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Read `public/pantry.csv`, interpret the user's description literally, and clarify only genuine ambiguity. Do not infer additional consumption or purchases.

## Pantry rules

- Change only `public/pantry.csv`; preserve its header and column order.
- Add, remove, or adjust rows and fields such as quantity, location, urgency, and notes.
- Never write `n.a.`; use an empty CSV field.
- When quantity reaches `0`, retain the row only if `stock_requirement` is non-empty, such as `keep in stock`. Otherwise remove the row.

If the change clearly came from a meal, inspect the current [Meal plan](../meal-plan/SKILL.md). When the recipe is present, suggest a linked `## Meals` entry and optional high-level note about important items used or finished. Do not change the meal plan until the user confirms that separate update.

Show the proposed pantry diff for confirmation before writing it.
