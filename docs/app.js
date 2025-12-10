// Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Remove active from all buttons
  document.querySelectorAll("nav button").forEach((button) => {
    button.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Activate button
  event.target.classList.add("active");
}

// Parse CSV
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || "";
    });
    return obj;
  });
}

// Load and display pantry
async function loadPantry() {
  const pantrySection = document.getElementById("pantry");

  try {
    const response = await fetch("./pantry.csv");
    const text = await response.text();
    const items = parseCSV(text);

    let html = "<table>";
    html += "<thead><tr>";
    html +=
      "<th>Name</th><th>Category</th><th>Quantity</th><th>Location</th><th>Urgency</th>";
    html += "</tr></thead><tbody>";

    items.forEach((item) => {
      const urgencyClass = `urgency-${item.urgency}`;
      html += "<tr>";
      html += `<td>${item.name}</td>`;
      html += `<td>${item.category}</td>`;
      html += `<td>${item.quantity} ${item.unit}</td>`;
      html += `<td>${item.location}</td>`;
      html += `<td class="${urgencyClass}">${item.urgency}</td>`;
      html += "</tr>";
    });

    html += "</tbody></table>";
    pantrySection.innerHTML = "<h2>Pantry Inventory</h2>" + html;
  } catch (error) {
    pantrySection.innerHTML =
      '<h2>Pantry Inventory</h2><div class="error">Error loading pantry data</div>';
    console.error("Error loading pantry:", error);
  }
}

// Load recipes
async function loadRecipes() {
  const recipesSection = document.getElementById("recipes");

  // For now, just show a placeholder
  // We'll need to generate a recipes index file or fetch from GitHub API
  recipesSection.innerHTML =
    "<h2>Recipes</h2><p>Recipe browser coming soon...</p>";
}

// Load meal plan
async function loadMealPlan() {
  const mealsSection = document.getElementById("meals");
  mealsSection.innerHTML =
    "<h2>This Week's Meal Plan</h2><p>Meal plan viewer coming soon...</p>";
}

// Load shopping list
async function loadShoppingList() {
  const shoppingSection = document.getElementById("shopping");

  try {
    // Try to load the most recent shopping list
    const response = await fetch("./shopping-lists/2025-W50.txt");
    const text = await response.text();

    const html =
      '<pre style="white-space: pre-wrap; font-family: inherit;">' +
      text +
      "</pre>";
    shoppingSection.innerHTML = "<h2>Shopping List</h2>" + html;
  } catch (error) {
    shoppingSection.innerHTML =
      '<h2>Shopping List</h2><div class="error">No shopping list found</div>';
    console.error("Error loading shopping list:", error);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadPantry();
  loadRecipes();
  loadMealPlan();
  loadShoppingList();
});
