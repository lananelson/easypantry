---
name: add-recipe
description: Add an EasyPantry recipe from a URL, image, or pasted text. Use when the user wants a recipe stored in the collection.
---

Follow the Pantry Keeper role in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

If the user supplied a URL or recipe text, begin with that material immediately. Ask a clarifying question only when the content or its source is ambiguous.

## Get the recipe content

- **URL:** Fetch the page and extract its ingredients and instructions.
- **Image:** If the image is not attached, ask for it. Transcribe only visible content.
- **Text:** Use the recipe text supplied by the user.

Never fabricate instructions. If the available source contains only part of the recipe, transcribe only what it contains. Leave `## Instructions` blank or ask the user for the missing material; do not infer instructions from the title or ingredients.

## Create the recipe

1. Read `public/approved_tags.csv`.
2. Choose a unique, readable, lowercase, dash-separated slug. Remove apostrophes and special characters, and keep the slug reasonably short.
3. Create `public/recipes/<slug>/recipe.md`. Create `public/recipes/<slug>/media/` only when the recipe has media to store.
4. Use the required frontmatter and heading structure below.
5. Record the source in `## References`:
   - For a URL, include the source URL.
   - For an image or pasted text, ask where it came from when that information was not supplied, then record the cookbook, author, website, creator, or personal notes.
   - For a user-created recipe with AI-generated instructions, use `Source: Created by <GitHub username> with <Model Name>`.

## Tags and Ayurvedic characteristics

- `tags` must be `[]` or a subset of `public/approved_tags.csv`. If a useful tag is not approved, use `[]` and suggest the new tag to the user.
- `ayurvedic` is a free-form array and does not use the approved-tag list. Add relevant characteristics as appropriate, including dosha effects, digestive qualities, thermal qualities, food-combining issues, or sattvic/rajasic/tamasic qualities. It may be `[]` when there are no specific Ayurvedic considerations.

## Required format

Use only level-2 headings. Required headings, in order, are `## Ingredients`, `## Instructions`, and `## References`. Optional `## Notes` belongs between Instructions and References. Use inline parenthetical notes for ingredient groupings instead of subsections.

```markdown
---
title: Recipe Title
category:
prep_time:
cook_time:
servings:
tags: []
ayurvedic: []
---

## Ingredients

- ingredient 1
- ingredient 2

## Instructions

1. Step 1
2. Step 2

## Notes

- notes here

## References

- Source: URL or Book Title
- Author: Author Name
```

## Recipe index

The local pre-commit hook regenerates `public/recipe-index.md`. In an environment that does not run repository hooks, run `scripts/generate-recipe-index.sh` before committing so the same generated update is included.
