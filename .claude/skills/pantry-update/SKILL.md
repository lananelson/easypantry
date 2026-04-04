---
name: pantry-update
description: Update pantry inventory based on what was used, bought, or changed
argument-hint: "[what changed]"
---

Update pantry inventory in `public/pantry.csv`.

$ARGUMENTS

(Describe what changed — e.g. "we finished the salmon", "I bought olive oil and eggs", "we made birria tacos".)

**Behavior:** Read the pantry, apply the changes the user described, and show the diff for confirmation. Don't ask clarifying questions unless genuinely ambiguous. If the change is tied to a recipe, suggest a meal log entry but ask before writing it.

Read COMMANDS.md § "Update Pantry Data" for full rules before proceeding.
