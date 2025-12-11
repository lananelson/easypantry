import { useEffect, useState } from "react";
import type { ShoppingList } from "../types.js";
import { loadShoppingLists, loadShoppingList } from "../utils/dataLoader.js";
import { loadAppState, updateAppState } from "../utils/appState.js";

export default function ShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>(
    {}
  );
  const [collapsedLists, setCollapsedLists] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const appState = loadAppState();

    loadShoppingLists()
      .then(async (listIds) => {
        const loadedLists = await Promise.all(
          listIds.map((id) => loadShoppingList(id))
        );
        setLists(loadedLists);

        // Initialize state from localStorage
        const checked: Record<string, string[]> = {};
        const collapsed: Record<string, boolean> = {};

        loadedLists.forEach((list) => {
          const stateKey = `shoppingList_${list.week}`;
          const listState = appState[stateKey] || {
            collapsed: list.status === "completed",
            checkedItems: [],
          };
          checked[list.week] = listState.checkedItems || [];
          collapsed[list.week] = listState.collapsed ?? false;
        });

        setCheckedItems(checked);
        setCollapsedLists(collapsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleItem = (listWeek: string, itemName: string) => {
    setCheckedItems((prev) => {
      const listItems = prev[listWeek] || [];
      const newItems = listItems.includes(itemName)
        ? listItems.filter((i) => i !== itemName)
        : [...listItems, itemName];

      updateAppState(`shoppingList_${listWeek}`, {
        collapsed: collapsedLists[listWeek],
        checkedItems: newItems,
      });

      return { ...prev, [listWeek]: newItems };
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">
            Error loading shopping lists: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="accordion" id="shopping-accordion">
          {lists.map((list) => {
            const isCollapsed = collapsedLists[list.week] ?? false;
            const listCheckedItems = checkedItems[list.week] || [];
            const collapseId = `collapse-${list.week}`;

            return (
              <div className="accordion-item" key={list.week}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      isCollapsed ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded={!isCollapsed}
                    aria-controls={collapseId}
                  >
                    {list.title}
                    <span
                      className={`badge ms-2 ${
                        list.status === "completed"
                          ? "bg-green-lt"
                          : "bg-blue-lt"
                      }`}
                    >
                      {list.status === "completed" ? "Completed" : "Active"}
                    </span>
                  </button>
                </h2>
                <div
                  id={collapseId}
                  className={`accordion-collapse collapse ${
                    isCollapsed ? "" : "show"
                  }`}
                  data-bs-parent="#shopping-accordion"
                >
                  <div className="accordion-body p-0">
                    <div className="list-group list-group-flush">
                      {list.items.map((item, index) => (
                        <label key={index} className="list-group-item">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <input
                                className="form-check-input m-0"
                                type="checkbox"
                                checked={listCheckedItems.includes(item.name)}
                                onChange={() =>
                                  toggleItem(list.week, item.name)
                                }
                              />
                            </div>
                            <div className="col">
                              <span
                                className={
                                  listCheckedItems.includes(item.name)
                                    ? "text-decoration-line-through"
                                    : ""
                                }
                                style={
                                  listCheckedItems.includes(item.name)
                                    ? { opacity: 0.5 }
                                    : undefined
                                }
                              >
                                {item.name}
                                {item.for.length > 0 && (
                                  <span className="text-muted small">
                                    {" "}
                                    (for {item.for.join(", ")})
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
