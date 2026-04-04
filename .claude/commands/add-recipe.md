Add a new recipe to the collection.

$ARGUMENTS

(Provide a URL, paste recipe text, or say "from image/photo".)

1. **Get the recipe content:**
   - **URL** — fetch the page and extract ingredients + instructions
   - **Image/photo** — ask the user to share it, then transcribe
   - **Text** — use the content provided

2. **Choose a slug:** lowercase, dash-separated, no special chars (e.g., `alice-waters-caesar-salad`)

3. **Read** `public/approved_tags.csv` to see valid tags.

4. **Create** `public/recipes/[slug]/recipe.md` using this template:

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

- Source: [URL or Book Title]
- Author: [Author Name]
```

**Rules:**
- `tags` must be `[]` or a subset of approved tags; suggest new tags to the user if needed
- `ayurvedic` is free-form (e.g., vata-balancing, warming, easy-to-digest); can be `[]`
- Use only `##` headings — no `###` subsections
- Required heading order: Ingredients → Instructions → Notes (optional) → References
- For ingredient groupings, use inline parenthetical notes instead of subheadings
- Always include the source in `## References`

5. The recipe index (`public/recipe-index.md`) regenerates automatically on the next commit via pre-commit hook — no manual action needed.

Follow COMMANDS.md § "Add Recipe" for full rules.
