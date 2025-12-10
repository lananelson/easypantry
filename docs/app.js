// Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Remove active from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Activate nav link
  event.target.closest(".nav-link").classList.add("active");
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

    let html = '<div class="table-responsive">';
    html += '<table class="table table-vcenter card-table">';
    html += "<thead><tr>";
    html +=
      "<th>Name</th><th>Category</th><th>Quantity</th><th>Location</th><th>Urgency</th>";
    html += "</tr></thead><tbody>";

    items.forEach((item) => {
      const urgencyClass = `urgency-${item.urgency}`;
      html += "<tr>";
      html += `<td class="text-muted">${item.name}</td>`;
      html += `<td class="text-muted"><span class="badge badge-outline">${item.category}</span></td>`;
      html += `<td class="text-muted">${item.quantity} ${item.unit}</td>`;
      html += `<td class="text-muted">${item.location}</td>`;
      html += `<td><span class="badge ${urgencyClass}">${item.urgency}</span></td>`;
      html += "</tr>";
    });

    html += "</tbody></table></div>";

    const card = pantrySection.querySelector(".card-body");
    card.innerHTML = html;
  } catch (error) {
    pantrySection.innerHTML =
      '<h2>Pantry Inventory</h2><div class="error">Error loading pantry data</div>';
    console.error("Error loading pantry:", error);
  }
}

// Load recipes
async function loadRecipes() {
  const recipesSection = document.getElementById("recipes");
  const card = recipesSection.querySelector(".card-body");

  card.innerHTML =
    '<div class="empty"><p class="empty-title">Recipe browser coming soon</p><p class="empty-subtitle text-muted">Check back later for recipe management</p></div>';
}

// Load meal plan
async function loadMealPlan() {
  const mealsSection = document.getElementById("meals");
  const card = mealsSection.querySelector(".card-body");

  card.innerHTML =
    '<div class="empty"><p class="empty-title">Meal plan viewer coming soon</p><p class="empty-subtitle text-muted">Check back later for weekly meal planning</p></div>';
}

// Load shopping list
async function loadShoppingList() {
  const shoppingSection = document.getElementById("shopping");
  const card = shoppingSection.querySelector(".card-body");

  try {
    // Try to load the most recent shopping list
    const response = await fetch("./shopping-lists/2025-W50.txt");
    const text = await response.text();

    const html =
      '<pre class="m-0" style="white-space: pre-wrap; font-family: inherit; font-size: 0.95rem;">' +
      text +
      "</pre>";
    card.innerHTML = html;
  } catch (error) {
    card.innerHTML =
      '<div class="alert alert-danger">No shopping list found</div>';
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
