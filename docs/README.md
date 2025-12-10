# EasyPantry Web Interface

This is the static web interface for EasyPantry that gets deployed to GitHub Pages.

## How It Works

1. You edit your pantry, recipes, and meal plans in the IDE with AI assistance
2. When you commit to `main`, GitHub Actions automatically:
   - Copies the HTML/JS/CSS from `docs/`
   - Copies your data files (pantry.csv, recipes, shopping-lists, weekly-meals)
   - Deploys everything to GitHub Pages
3. Your site updates automatically at `https://[username].github.io/easypantry`

## Setup

1. Go to your GitHub repo Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch
4. Your site will be live in a few minutes!

## Files

- `index.html` - Main page structure
- `app.js` - JavaScript that loads and displays your data
- Data files are copied from the root during build

## Future Enhancements

- Recipe browser with search/filter
- Meal plan calendar view
- Interactive pantry with filters
- Charts and statistics
- Mobile-friendly improvements

