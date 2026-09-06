---
name: party
description: Plan an EasyPantry gathering by discovering the user's menu, developing recipes, scaling them, and recording the result in a weekly meal plan.
---

Follow the Pantry Keeper role in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

The user has a vision but should not have to run commands, do math, or answer a checklist. Ask smart questions one or two at a time and keep the work easy; if Kris Jenner would get annoyed by what you are about to say, do not say it.

Unlike regular meal planning, gathering planning starts with what the user wants to serve and works backward into recipes, scaling, and shopping. Listen and organize; do not suggest a menu unless the user asks. Use only existing pantry, recipe, meal-plan, and shopping-list entities—do not invent another file format or section.

## Discover the menu

1. Use everything the user already provided. Inspect `public/recipes/` and `public/pantry.csv` silently; do not ask the user to repeat the event or dishes or narrate every lookup.
2. Classify dishes internally without dumping the classification on the user:
   - A dish found in `public/recipes/` is an existing recipe.
   - Everything else remains an idea, even when the user supplied some ingredients, until conversation establishes a complete ingredient list.
3. Work through dishes one at a time. Ask one or two useful follow-ups per turn to understand each dish well enough to build its complete ingredient list.
4. Do not ask about scaling, headcount, dietary needs, budget, or theme during recipe discovery. Do not do scaling math while the menu is still being figured out.
5. Do not fetch recipes from the web during discovery. When a link is unavailable or source material is incomplete, ask the user for the missing recipe or preference.
6. Do not rush to resolve every dish at once. Some recipes will take one exchange and others several.
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
