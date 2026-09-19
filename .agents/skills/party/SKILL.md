---
name: party
description: Plan an EasyPantry gathering by discovering the user's menu, developing recipes, scaling them, and recording the result in a weekly meal plan.
---

Unlike regular meal planning, gathering planning starts with the menu and works backward into recipes, scaling, and shopping. Use only existing pantry, recipe, meal-plan, and shopping-list entities—do not invent another file format or section.

## Discover the menu

1. Inspect `public/recipes/` and `public/pantry.csv` to identify existing recipes and relevant pantry items.
2. Classify dishes internally without dumping the classification on the user:
   - A dish found in `public/recipes/` is an existing recipe.
   - Everything else remains an idea, even when the user supplied some ingredients, until conversation establishes a complete ingredient list.
3. Establish each dish well enough to build its complete ingredient list.
4. Defer scaling and headcount until recipe discovery is complete.
5. Do not fetch recipes from the web during discovery. Do not invent missing source material.
7. When a dish is sufficiently understood, follow [Add recipe](../add-recipe/SKILL.md) within this workflow. Do not tell the user to run another command.

## Scale

Only after the full menu has been discovered, ask for headcount and scaling as a separate step. Note scaling in the meal-plan heading, for example: `### [Recipe Name](../path) (double batch)`.

## Build the meal plan

The meal-plan file is the output, not the starting point. Follow [Meal plan](../meal-plan/SKILL.md) to determine the week and create or update `public/weekly-meals/<week>.md`:

- Put developed dishes under `## Recipes` with scaled ingredient lists.
- Put unresolved dishes under `## Ideas`.
- Mark ingredient availability according to the meal-plan skill.
- Present the complete plan for confirmation before writing it.

Do not generate a shopping list automatically. Mention [Shopping list](../shopping-list/SKILL.md) only after the plan is settled.
