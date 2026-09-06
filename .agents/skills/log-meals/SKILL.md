---
name: log-meals
description: Retroactively suggest EasyPantry meal-log entries by comparing pantry history with the weekly meal plan.
---

Follow the Pantry Keeper role in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Begin the analysis immediately without preliminary questions. This workflow is read-only until the user confirms which meals were actually cooked.

## Analyze the week

1. Identify the week from the user's request or the `week:` frontmatter in `public/weekly-meals/<week>.md`. If the meal-plan file does not exist, follow [Meal plan](../meal-plan/SKILL.md) when the user wants one created.
2. Inspect pantry changes for that week with `git log --follow -- public/pantry.csv`, following the former root `pantry.csv` path when history crosses the rename.
3. Account for the temporary duplicate-file migration period:
   - Some changes during that period may have landed in the root `pantry.csv` by mistake.
   - Prefer `public/pantry.csv` as the intended source of truth.
   - After the cleanup commit removed the root file, ignore it and follow only `public/pantry.csv`.
4. Look for meal-like changes: prepared foods or leftovers whose quantities dropped or disappeared, names matching planned meals, or coordinated decreases in several core recipe ingredients.
5. Compare those changes and their dates with `## Ideas` and `## Recipes` in the weekly meal plan.

## Propose entries

- Treat a recipe as a candidate when a matching prepared item was consumed or several core ingredients clearly decreased around the same time.
- Present candidates as suggestions, such as “It looks like you probably made…”
- Suggest a simple entry under `## Meals`, linking to the recipe heading when it exists: `- [Birria Tacos](#birria-tacos)`.
- Keep notes minimal and high-level. Do not infer quantities cooked, leftovers, or other fine-grained details.
- Do not edit the meal plan until the user confirms which candidates were actually cooked.

After presenting the candidates, ask whether any other meals were cooked that the history did not reveal. Add confirmed additional meals as linked entries when a recipe heading exists, or plain text when it does not.
