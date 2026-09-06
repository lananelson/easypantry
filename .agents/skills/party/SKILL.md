---
name: party
description: Collaboratively plan an EasyPantry gathering by developing the user's menu into recipes and a weekly meal plan.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Gathering planning starts with what the user wants to serve, not with pantry optimization. Listen and organize; do not invent or suggest a menu unless asked. Use only existing recipe, meal-plan, shopping-list, and pantry entities.

## Discover the menu

1. Use everything the user already supplied. Inspect `public/recipes/` and `public/pantry.csv` silently.
2. Existing recipe files are developed dishes. Everything else remains an idea until the conversation establishes a complete ingredient list.
3. Work through dishes one at a time with one or two useful questions per turn. Do not ask for headcount, scaling, dietary needs, budget, or theme while recipes are still being discovered.
4. Do not fetch recipes from the web during discovery. Ask the user for missing source material or preferences.
5. When a dish is sufficiently understood, follow [Add recipe](../add-recipe/SKILL.md) as part of this workflow.

## Scale and record

After the menu is developed, ask for headcount and scaling. Then follow [Meal plan](../meal-plan/SKILL.md): record developed dishes under `## Recipes`, unresolved dishes under `## Ideas`, note scaling in the recipe heading, and resolve ingredient availability conversationally.

Present the complete plan for confirmation before writing. Do not generate a shopping list automatically; mention [Shopping list](../shopping-list/SKILL.md) only after the plan is settled.
