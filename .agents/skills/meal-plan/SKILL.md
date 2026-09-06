Skill is valid!
---
name: meal-plan
description: Start or update an EasyPantry weekly meal plan. Use for meal ideas, developed recipes, ingredient availability, or recording cooked meals for a week.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Meal planning progresses from ideas to recipes to a shopping list. Preserve those stages and the distinctions below. If the user already supplied meal ideas or recipes, work from what they gave you instead of asking what they want to do.

## Choose the week

- Determine the target ISO week from the user's wording and today's date.
- Confirm the week only when it is genuinely ambiguous, such as late in the current week.
- Use `public/weekly-meals/YYYY-WXX.md`. If it does not exist, create it and add the week ID to `public/weekly-meals/index.json`.

## Start with ideas

- Put undeveloped meal concepts under `## Ideas`.
- Keep ideas as a simple list without ingredients or other details.
- Move an idea to `## Recipes` only when it is ready to be planned.

## Develop recipes

For a recipe with full documentation:

- Follow [Add recipe](../add-recipe/SKILL.md) when a new recipe file must be added.
- Link its heading as `### [Recipe Name](../recipes/recipe-name/recipe.md)`.
- List every ingredient under `**Ingredients needed:**`.

For a simple recipe:

- Do not create a recipe file.
- Use an unlinked `### Recipe Name` heading and list its basic ingredients.
- Do not include its cooking method in the meal plan.

For every developed recipe:

- Read `public/pantry.csv` and mark ingredients `✓` when available or `(need to buy)` when missing.
- If the user says the pantry is stale or incomplete, absence from the file does not mean `(need to buy)`. Confirm uncertain ingredient availability before applying either status.
- Record substitutions inline, such as `use Fontina ✓` instead of `Melting cheese`.

## Log meals cooked

- After the user says a meal was cooked, add it under `## Meals`.
- Link it to the corresponding recipe heading in the same file, such as `[Birria Tacos](#birria-tacos)`.
- Optionally note what pantry items were used or finished.

## Generate a shopping list

Only when the user asks for a shopping list, follow [Shopping list](../shopping-list/SKILL.md). That workflow extracts `(need to buy)` ingredients, adds applicable out-of-stock keep-in-stock items, and writes the weekly shopping-list JSON.

## Meal plan format

```markdown
---
week: YYYY-WXX
date_range: YYYY-MM-DD to YYYY-MM-DD
---

# Week XX - Month YYYY

## Ideas

- Meal idea 1
- Meal idea 2

## Meals

- [Full Recipe Name](#full-recipe-name) — optional note about when it was cooked or what was used

## Recipes

### [Recipe Name](../recipes/recipe-name/recipe.md)

**Ingredients needed:**

- Ingredient ✓
- Ingredient (need to buy)

### Simple Recipe Name

**Ingredients needed:**

- Ingredient ✓
- Ingredient (need to buy)
```
