---
name: add-recipe
description: Add a new recipe from a URL, image, or pasted text
argument-hint: "[url or description]"
---

Add a new recipe to the collection.

$ARGUMENTS

(Provide a URL, paste recipe text, or say "from image/photo".)

**Behavior:** If the user provided a URL or text, start working immediately — don't ask clarifying questions unless the content is ambiguous. Read `public/approved_tags.csv` for valid tags. The recipe index regenerates automatically on commit.

Follow COMMANDS.md § "Add Recipe" for process, template, and format rules.
