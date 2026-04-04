---
name: meal-plan
description: Start or update the weekly meal plan
argument-hint: "[week]"
---

Start or update the weekly meal plan.

1. Determine the target week from today's date (format: YYYY-WXX). If it's late in the week (Thu/Fri), confirm with the user whether they mean current or next week.

2. Check if `public/weekly-meals/[week].md` exists.
   - If not, create it using the template below and add the week to `public/weekly-meals/index.json`.

3. Read `public/pantry.csv` and `public/recipe-index.md` to suggest relevant meal ideas based on what's available (prioritize high-urgency perishables).

4. Present the current state of the meal plan and ask what the user wants to add or change:
   - Add ideas to `## Ideas`
   - Develop recipes under `## Recipes` (list ingredients with ✓ or `(need to buy)`)
   - Log cooked meals under `## Meals`

**Meal plan file template:**

```markdown
---
week: YYYY-WXX
date_range: YYYY-MM-DD to YYYY-MM-DD
---

# Week XX - Month YYYY

## Ideas

-

## Meals

## Recipes
```

**Recipe entry format (with full recipe file):**
```
### [Recipe Name](../recipes/recipe-slug/recipe.md)

**Ingredients needed:**

- Ingredient ✓
- Ingredient (need to buy)
```

**Recipe entry format (simple, no recipe file):**
```
### Recipe Name

**Ingredients needed:**

- Ingredient ✓
- Ingredient ✓
```

Follow the full workflow in COMMANDS.md § "Meal Planning Workflow" for detailed rules.
