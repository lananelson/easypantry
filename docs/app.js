// App state management
const APP_STATE_KEY = "easypantry_state";

function loadAppState() {
  const saved = localStorage.getItem(APP_STATE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading app state:", e);
    }
  }
  return {
    activeSection: "pantry",
    pantrySort: { column: null, direction: "asc" },
    checkedShoppingItems: [],
  };
}

function saveAppState(updates) {
  const current = loadAppState();
  const newState = { ...current, ...updates };
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(newState));
}

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

  // Save active section to state
  saveAppState({ activeSection: sectionId });
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

// Pantry state
let pantryItems = [];
let currentSort = { column: null, direction: "asc" };

// Sort items by column
function sortPantryItems(column) {
  // Toggle direction if clicking the same column
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort.column = column;
    currentSort.direction = "asc";
  }

  const urgencyOrder = { high: 3, medium: 2, low: 1 };

  pantryItems.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];

    // Special handling for urgency
    if (column === "urgency") {
      aVal = urgencyOrder[aVal] || 0;
      bVal = urgencyOrder[bVal] || 0;
    }
    // Special handling for quantity (numeric)
    else if (column === "quantity") {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }
    // String comparison for other columns
    else {
      aVal = (aVal || "").toLowerCase();
      bVal = (bVal || "").toLowerCase();
    }

    if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Save sort state
  saveAppState({
    pantrySort: {
      column: currentSort.column,
      direction: currentSort.direction,
    },
  });

  renderPantryTable();
}

// Render pantry table
function renderPantryTable() {
  const pantrySection = document.getElementById("pantry");
  const card = pantrySection.querySelector(".card-body");

  let html = '<div class="table-responsive">';
  html += '<table class="table table-vcenter card-table">';
  html += "<thead><tr>";

  // Create sortable headers
  const columns = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity" },
    { key: "location", label: "Location" },
    { key: "urgency", label: "Urgency" },
  ];

  columns.forEach((col) => {
    const sortIcon =
      currentSort.column === col.key
        ? currentSort.direction === "asc"
          ? " ▲"
          : " ▼"
        : "";
    html += `<th style="cursor: pointer; user-select: none;" onclick="sortPantryItems('${col.key}')">${col.label}${sortIcon}</th>`;
  });

  html += "</tr></thead><tbody>";

  pantryItems.forEach((item) => {
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
  card.innerHTML = html;
}

// Load and display pantry
async function loadPantry() {
  const pantrySection = document.getElementById("pantry");

  try {
    const response = await fetch("./pantry.csv");
    const text = await response.text();
    pantryItems = parseCSV(text);

    // Restore saved sort state
    const appState = loadAppState();
    if (appState.pantrySort.column) {
      currentSort = appState.pantrySort;
      // Apply the saved sort
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      pantryItems.sort((a, b) => {
        let aVal = a[currentSort.column];
        let bVal = b[currentSort.column];

        if (currentSort.column === "urgency") {
          aVal = urgencyOrder[aVal] || 0;
          bVal = urgencyOrder[bVal] || 0;
        } else if (currentSort.column === "quantity") {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        }

        if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    renderPantryTable();
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

    // Parse the shopping list into sections
    const lines = text.trim().split("\n");
    const appState = loadAppState();
    const checkedItems = appState.checkedShoppingItems || [];

    let html = '<div class="list-group list-group-flush">';

    lines.forEach((line) => {
      if (line.trim() === "") return; // Skip empty lines

      // Check if it's a header line (contains "Shopping List" or ends with ":")
      if (line.includes("Shopping List") || line.includes("Week")) {
        html += `<div class="list-group-item bg-light"><strong>${line}</strong></div>`;
      } else {
        // It's a regular item - make it checkable
        const isChecked = checkedItems.includes(line);
        const checkedAttr = isChecked ? "checked" : "";
        const strikeStyle = isChecked
          ? 'style="text-decoration: line-through; opacity: 0.5;"'
          : "";

        html += `
          <label class="list-group-item">
            <div class="row align-items-center">
              <div class="col-auto">
                <input class="form-check-input m-0" type="checkbox" ${checkedAttr} onchange="toggleItem(this)">
              </div>
              <div class="col">
                <span class="shopping-item" ${strikeStyle}>${line}</span>
              </div>
            </div>
          </label>
        `;
      }
    });

    html += "</div>";
    card.innerHTML = html;
  } catch (error) {
    card.innerHTML =
      '<div class="alert alert-danger">No shopping list found</div>';
    console.error("Error loading shopping list:", error);
  }
}

// Toggle shopping list item
function toggleItem(checkbox) {
  const itemText = checkbox.closest("label").querySelector(".shopping-item");
  const itemName = itemText.textContent;
  const appState = loadAppState();
  let checkedItems = appState.checkedShoppingItems || [];

  if (checkbox.checked) {
    itemText.style.textDecoration = "line-through";
    itemText.style.opacity = "0.5";
    if (!checkedItems.includes(itemName)) {
      checkedItems.push(itemName);
    }
  } else {
    itemText.style.textDecoration = "none";
    itemText.style.opacity = "1";
    checkedItems = checkedItems.filter((item) => item !== itemName);
  }

  saveAppState({ checkedShoppingItems: checkedItems });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Restore active section from saved state
  const appState = loadAppState();
  const activeSection = appState.activeSection || "pantry";

  // Set the active section
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(activeSection).classList.add("active");

  // Set the active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    const linkHref = link.getAttribute("onclick");
    if (linkHref && linkHref.includes(`'${activeSection}'`)) {
      link.classList.add("active");
    }
  });

  // Load all sections
  loadPantry();
  loadRecipes();
  loadMealPlan();
  loadShoppingList();
});
