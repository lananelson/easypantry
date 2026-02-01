#!/bin/bash
# Generates public/recipe-index.md from all recipe files
# Extracts only the ingredients section from each recipe

set -e

RECIPES_DIR="public/recipes"
OUTPUT_FILE="public/recipe-index.md"

echo "# Recipe Index" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Auto-generated from recipe files. Do not edit manually." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for recipe_dir in "$RECIPES_DIR"/*/; do
    recipe_file="$recipe_dir/recipe.md"
    
    if [[ -f "$recipe_file" ]]; then
        # Get recipe slug from directory name
        slug=$(basename "$recipe_dir")
        
        # Extract title from frontmatter
        title=$(grep -m1 "^title:" "$recipe_file" | sed 's/^title: *//')
        
        echo "## $slug" >> "$OUTPUT_FILE"
        if [[ -n "$title" ]]; then
            echo "**$title**" >> "$OUTPUT_FILE"
        fi
        echo "" >> "$OUTPUT_FILE"
        
        # Extract ingredients section (between ## Ingredients and next ##)
        awk '/^## Ingredients$/,/^## [^I]/' "$recipe_file" | grep "^- " >> "$OUTPUT_FILE" || true
        
        echo "" >> "$OUTPUT_FILE"
    fi
done

echo "Generated $OUTPUT_FILE"

