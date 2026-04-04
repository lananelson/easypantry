---
name: log-meals
description: Retroactively log meals cooked this week by analyzing pantry history
---

Retroactively log meals cooked this week by analyzing pantry history.

This is a read-only analysis that produces suggestions — no files are edited without your confirmation.

1. **Identify the current week** from today's date. Read `public/weekly-meals/[week].md`.

2. **Scan pantry git history** for this week:
   ```
   git log --follow --since="[start of week]" -- public/pantry.csv
   ```
   Look for commits where prepared foods, leftovers, or recipe ingredients decreased or were removed.

3. **Match changes to the meal plan:**
   - Cross-reference depleted items with `## Ideas` and `## Recipes` in the weekly file
   - A recipe is a candidate if its core ingredients clearly dropped around the same time

4. **Present suggestions** — do not edit files yet:
   > "It looks like you probably made: [Dish 1], [Dish 2]. Should I log these?"

5. **After confirmation**, add entries to `## Meals` in the weekly file:
   ```
   - [Recipe Name](#recipe-heading)
   ```
   Keep notes minimal. Do not record quantities, leftovers, or fine-grained details.

6. **Ask if anything is missing** — were there meals not captured by pantry history?

Follow COMMANDS.md § "Log Meals Retroactively" for full rules.
