# EasyPantry Commands

This file contains reusable commands/workflows for managing the pantry system.

## Generate Shopping List

**Command:** "generate shopping list" or "regenerate shopping list"

**Process:**

1. Check `weekly-meals/[current-week].md` for all recipes and their needed ingredients
2. Cross-reference with `pantry.csv` to identify what's missing
3. Check `pantry.csv` for items with `quantity=0` AND `stock_requirement="keep in stock"`
4. Create/update `shopping-lists/[current-week].txt` with:
   - Recipe ingredients (organized by section: produce, dairy, pantry)
   - Out-of-stock items that need restocking (at the bottom)
   - Plain text format, no section headers, no checkboxes (user adds manually in Apple Notes)

## Add Recipe from URL

**Command:** "add recipe from [URL]"

**Process:**

1. Fetch recipe from URL using `web-fetch`
2. Parse ingredients and instructions
3. Create folder: `recipes/[recipe-name]/`
4. Create `recipes/[recipe-name]/media/` folder
5. Create `recipes/[recipe-name]/recipe.md` with parsed content
6. Include source URL in References section

**Recipe Template:**

```markdown
---
title: Recipe Title
category:
prep_time:
cook_time:
servings:
tags: []
---

## Ingredients

- ingredient 1
- ingredient 2

## Instructions

1. Step 1
2. Step 2

## Substitution Notes

- substitution notes here

## References

- Source: [URL]
- Author: [Author Name]
```
