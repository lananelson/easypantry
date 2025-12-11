import { useEffect, useState } from "react";
import type { PantryItem } from "../types.js";
import { getComparableValue } from "../types.js";
import { loadPantryData } from "../utils/dataLoader.js";
import { loadAppState, updateAppState } from "../utils/appState.js";

export default function Pantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof PantryItem>(() => {
    const state = loadAppState();
    return state.pantry?.sortBy || "name";
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
    const state = loadAppState();
    return state.pantry?.sortOrder || "asc";
  });

  useEffect(() => {
    loadPantryData()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    updateAppState({ pantry: { sortBy, sortOrder } });
  }, [sortBy, sortOrder]);

  const handleSort = (column: keyof PantryItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const aVal = getComparableValue(a, sortBy);
    const bVal = getComparableValue(b, sortBy);

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return sortOrder === "asc" ? comparison : -comparison;
  });

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
            Error loading pantry: {error}
          </div>
        </div>
      </div>
    );
  }

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "urgency-high";
      case "medium":
        return "urgency-medium";
      case "low":
        return "urgency-low";
      default:
        return "";
    }
  };

  const getSortIcon = (column: keyof PantryItem) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Pantry Inventory</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("name")}
              >
                Name{getSortIcon("name")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("category")}
              >
                Category{getSortIcon("category")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("quantity")}
              >
                Quantity{getSortIcon("quantity")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("location")}
              >
                Location{getSortIcon("location")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("urgency")}
              >
                Urgency{getSortIcon("urgency")}
              </th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <tr key={index}>
                <td className={getUrgencyClass(item.urgency)}>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  {item.quantity} {item.unit}
                </td>
                <td>
                  <span className="badge bg-secondary-lt">{item.location}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      item.urgency === "high"
                        ? "bg-red-lt"
                        : item.urgency === "medium"
                        ? "bg-orange-lt"
                        : "bg-secondary-lt"
                    }`}
                  >
                    {item.urgency}
                  </span>
                </td>
                <td className="text-secondary">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
