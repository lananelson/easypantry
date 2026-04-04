---
name: shopping-list
description: Generate or regenerate the shopping list for the target week
argument-hint: "[vendor]"
---

Generate or regenerate the shopping list for the target week.

$ARGUMENTS

(Optional: pass a vendor name, e.g. `/shopping-list Costco`, to include vendor-specific restock items.)

**Behavior:** Generate the list immediately from the meal plan and pantry data. Only confirm with the user if the target week is ambiguous (late in the week). Show the generated list for confirmation before writing.

Read COMMANDS.md § "Generate Shopping List" for full rules and JSON format before proceeding.
