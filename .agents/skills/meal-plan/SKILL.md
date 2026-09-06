---
name: meal-plan
description: Start or update an EasyPantry weekly meal plan. Use for meal ideas, developed recipes, ingredient availability, or recording cooked meals for a week.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Meal planning progresses from ideas to developed recipes to a shopping list. Use [Add recipe](../add-recipe/SKILL.md) when a developed dish needs a recipe file. Shopping-list generation is a separate workflow.

## Conversation

- Determine the target ISO week from the user's words and today's date. Confirm only when genuinely ambiguous.
- Add supplied meal ideas directly to the proposed plan; do not ask the user to repeat what they already said.
- Check `public/pantry.csv` when ingredient status is useful, but account for anything the user says about its accuracy.
- Pantry entries are evidence, not unquestionable reality. If the pantry is stale, use ordinary household judgment to ask short confirmation questions such as, “You probably still have salt and oil, right? What about silken tofu?”
- Never translate unknown availability into `(need to buy)`. Resolve it with the user before assigning a status.

## Record

Create or update `public/weekly-meals/YYYY-WXX.md` and maintain `public/weekly-meals/index.json`.

- `## Ideas`: simple meal concepts that are not yet developed.
- `## Meals`: meals actually cooked; link to the corresponding recipe heading when present.
- `## Recipes`: developed recipes with ingredients marked `✓` only when available and `(need to buy)` only when confirmed missing.
- Link documented recipes as `### [Recipe Name](../recipes/slug/recipe.md)`.
- Simple recipes may be unlinked but still list ingredients. Do not include cooking methods in the meal plan.
- Note substitutions inline.

```markdown
---
week: YYYY-WXX
date_range: YYYY-MM-DD to YYYY-MM-DD
---

# Week XX - Month YYYY

## Ideas

## Meals

## Recipes

### [Recipe Name](../recipes/recipe-name/recipe.md)

**Ingredients needed:**

- Ingredient ✓
- Ingredient (need to buy)
```

Present the complete proposed plan for confirmation before writing it. Once the plan is confirmed, use [Shopping list](../shopping-list/SKILL.md) only when the user asks for a list.
