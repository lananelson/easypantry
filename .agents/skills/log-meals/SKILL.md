---
name: log-meals
description: Suggest retroactive EasyPantry meal-log entries by comparing pantry history with the weekly meal plan.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

This is read-only analysis until the user confirms what was actually cooked. Use the current [Meal plan](../meal-plan/SKILL.md) and pantry history; do not infer quantities, leftovers, or detailed notes.

1. Identify the requested week from the meal-plan frontmatter or conversation.
2. Inspect `git log --follow -- public/pantry.csv`, including the former root `pantry.csv` path when history crosses the migration.
3. During the short-lived duplicate-file period, prefer `public/pantry.csv`; the root copy was unreliable. After its cleanup commit, ignore the root copy.
4. Look for consumed prepared foods or coordinated decreases in core recipe ingredients.
5. Match those signals against `## Ideas` and `## Recipes` in the weekly plan.
6. Present likely meals as suggestions, linking each to its recipe heading where possible.
7. Ask whether the user cooked anything else that the history did not reveal.

Only after confirmation, add the selected entries under `## Meals`. Use plain text when no recipe heading exists.
