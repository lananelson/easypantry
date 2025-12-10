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

  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Activate nav item
  event.target.closest(".nav-item").classList.add("active");

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

// Load shopping lists (supports multiple lists)
async function loadShoppingList() {
  const shoppingSection = document.getElementById("shopping");
  const card = shoppingSection.querySelector(".card-body");

  try {
    // Load all shopping lists - for now just the one
    const lists = ["2025-W50"];
    let html =
      '<div class="accordion accordion-inverted accordion-plus" id="shopping-accordion">';

    for (const listId of lists) {
      try {
        const response = await fetch(`./shopping-lists/${listId}.json`);
        const list = await response.json();

        const appState = loadAppState();
        const listState = appState[`shoppingList_${listId}`] || {
          collapsed: list.status === "completed",
          checkedItems: [],
        };

        const statusBadge =
          list.status === "completed"
            ? '<span class="badge bg-green-lt">Completed</span>'
            : list.status === "active"
            ? '<span class="badge bg-blue-lt">Active</span>'
            : "";

        const collapseId = `collapse-${listId}`;
        const showClass = listState.collapsed ? "" : "show";
        const expandedAttr = listState.collapsed ? "false" : "true";

        html += `
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button ${
                listState.collapsed ? "collapsed" : ""
              }" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${expandedAttr}" onclick="toggleShoppingList('${listId}')">
                ${list.title}
                <div class="accordion-button-toggle accordion-button-toggle-plus">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                    <path d="M12 5l0 14"></path>
                    <path d="M5 12l14 0"></path>
                  </svg>
                </div>
                <div class="ms-auto me-3">
                  ${statusBadge}
                </div>
              </button>
            </div>
            <div id="${collapseId}" class="accordion-collapse collapse ${showClass}" data-bs-parent="#shopping-accordion">
              <div class="accordion-body p-0">
                <div class="list-group list-group-flush">
        `;

        list.items.forEach((item) => {
          const isChecked = listState.checkedItems.includes(item.name);
          const checkedAttr = isChecked ? "checked" : "";
          const strikeStyle = isChecked
            ? 'style="text-decoration: line-through; opacity: 0.5;"'
            : "";

          // Format the "for" recipes if present
          const forRecipes =
            item.for && item.for.length > 0
              ? `<span class="text-muted small"> (for ${item.for.join(
                  ", "
                )})</span>`
              : "";

          html += `
            <label class="list-group-item">
              <div class="row align-items-center">
                <div class="col-auto">
                  <input class="form-check-input m-0" type="checkbox" ${checkedAttr}
                         onchange="toggleShoppingItem(this, '${listId}', '${item.name.replace(
            /'/g,
            "\\'"
          )}')">
                </div>
                <div class="col">
                  <span class="shopping-item" ${strikeStyle}>${
            item.name
          }${forRecipes}</span>
                </div>
              </div>
            </label>
          `;
        });

        html += `
                </div>
              </div>
            </div>
          </div>
        `;
      } catch (err) {
        console.error(`Error loading shopping list ${listId}:`, err);
      }
    }

    html += "</div>";

    if (
      html ===
      '<div class="accordion accordion-inverted" id="shopping-accordion"></div>'
    ) {
      html = '<div class="alert alert-info">No shopping lists found</div>';
    }

    card.innerHTML = html;
  } catch (error) {
    card.innerHTML =
      '<div class="alert alert-danger">Error loading shopping lists</div>';
    console.error("Error loading shopping lists:", error);
  }
}

// Toggle shopping list collapse
function toggleShoppingList(listId) {
  const collapseEl = document.getElementById(`collapse-${listId}`);
  const appState = loadAppState();
  const stateKey = `shoppingList_${listId}`;
  const listState = appState[stateKey] || {
    collapsed: false,
    checkedItems: [],
  };

  // The accordion button handles the actual collapse, we just track state
  const isCollapsed = collapseEl.classList.contains("show");
  listState.collapsed = isCollapsed; // Will be opposite after Bootstrap handles the toggle

  saveAppState({ [stateKey]: listState });
}

// Toggle shopping list item
function toggleShoppingItem(checkbox, listId, itemName) {
  const itemText = checkbox.closest("label").querySelector(".shopping-item");
  const appState = loadAppState();
  const stateKey = `shoppingList_${listId}`;
  const listState = appState[stateKey] || {
    collapsed: false,
    checkedItems: [],
  };

  if (checkbox.checked) {
    itemText.style.textDecoration = "line-through";
    itemText.style.opacity = "0.5";
    if (!listState.checkedItems.includes(itemName)) {
      listState.checkedItems.push(itemName);
    }
  } else {
    itemText.style.textDecoration = "none";
    itemText.style.opacity = "1";
    listState.checkedItems = listState.checkedItems.filter(
      (item) => item !== itemName
    );
  }

  saveAppState({ [stateKey]: listState });
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

  // Set the active nav item
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
    const link = item.querySelector(".nav-link");
    const linkHref = link ? link.getAttribute("onclick") : null;
    if (linkHref && linkHref.includes(`'${activeSection}'`)) {
      item.classList.add("active");
    }
  });

  // Load all sections
  loadPantry();
  loadRecipes();
  loadMealPlan();
  loadShoppingList();
});
