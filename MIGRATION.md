# Migration to React + TypeScript + Vite

## Overview

EasyPantry has been migrated from a vanilla JavaScript static site to a modern React + TypeScript + Vite application.

## What's Been Done

### ✅ Project Setup
- Created Vite + React + TypeScript project in `app/` directory
- Configured Vite to build to `docs/` for GitHub Pages deployment
- Set up proper base path (`/easypantry/`) for GitHub Pages
- Installed dependencies: `papaparse` for CSV parsing

### ✅ Type Definitions
- Created TypeScript types for:
  - `PantryItem` - pantry inventory items
  - `ShoppingList` - shopping list structure
  - `ShoppingListItem` - individual shopping list items
  - `AppState` - localStorage state management

### ✅ Data Loading
- Created `dataLoader.ts` utility for:
  - Loading and parsing `pantry.csv`
  - Loading shopping list JSON files
  - Fetching data from the `public/` directory

### ✅ State Management
- Created `appState.ts` utility for:
  - Loading/saving app state to localStorage
  - Managing collapsed/expanded states
  - Managing checked items in shopping lists

### ✅ React Components
- **App.tsx**: Main app with navigation and section routing
- **Pantry.tsx**: Displays pantry inventory table with:
  - Urgency-based styling
  - Location badges
  - Sortable columns
- **ShoppingLists.tsx**: Displays shopping lists with:
  - Accordion-style collapsible lists
  - Checkbox functionality for items
  - Status badges (Active/Completed)
  - Persistent state via localStorage

### ✅ Styling
- Integrated Tabler UI framework via CDN
- Preserved custom urgency styling
- Maintained active navigation styling
- Responsive design with Bootstrap grid

### ✅ Build & Deployment
- Updated GitHub Actions workflow to:
  - Install Node.js 22
  - Run `npm ci` and `npm run build`
  - Deploy built `docs/` folder to GitHub Pages
- Updated `.gitignore` to exclude `node_modules` and `docs/`

### ✅ Documentation
- Created `README.md` at root with project overview
- Created `app/README.md` with development instructions
- This migration document

## What's Not Done Yet

### ⏳ Node.js Version
**Issue**: Your local Node.js version (20.10.0) is below the required 20.19+ or 22.12+

**Impact**: You won't be able to run `npm run dev` locally until you upgrade Node.js

**Solution**: Upgrade Node.js to 22.x (recommended) or 20.19+

### ⏳ Testing
- Need to test the build process locally (requires Node.js upgrade)
- Need to verify deployment to GitHub Pages works
- Need to test all functionality in production

### ⏳ Meal Plans Section
- Currently shows "Coming soon..." placeholder
- Need to implement meal plan display component
- Need to parse markdown meal plan files

### ⏳ Additional Features (Future)
- Search/filter functionality for pantry
- Sorting for pantry table
- Edit pantry items in-app (would need backend or manual CSV editing)
- Recipe display component
- Meal plan editing

## Next Steps

1. **Upgrade Node.js** to 22.x or 20.19+
2. **Test locally**:
   ```bash
   cd app
   npm install
   npm run dev
   ```
3. **Commit and push** to trigger GitHub Actions build
4. **Verify deployment** at https://lananelson.github.io/easypantry/
5. **Implement meal plans** component if needed

## Migration Benefits

✅ **Type Safety**: TypeScript catches errors at compile time
✅ **Modern Tooling**: Hot reload, better debugging, modern dev experience
✅ **Component Reusability**: Easy to add new features and sections
✅ **Better State Management**: React hooks instead of manual DOM manipulation
✅ **Still Static**: No backend needed, still deploys to GitHub Pages
✅ **Maintainability**: Cleaner code structure, easier to understand and modify

## Rollback Plan

If you need to rollback to the old version:
1. The old static files are still in `docs/` (until first build)
2. You can restore them from git history
3. Revert the GitHub Actions workflow changes

## Data Files

All data files remain unchanged and are copied to `public/`:
- `public/pantry.csv`
- `public/shopping-lists/*.json`
- `public/recipes/*/recipe.md`
- `public/weekly-meals/*.md`

The React app loads these files at runtime, so you can continue editing them as before.

