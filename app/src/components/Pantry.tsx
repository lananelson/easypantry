import { useEffect, useState } from "react";
import type { PantryItem } from "../types.js";
import { loadPantryData } from "../utils/dataLoader.js";

export default function Pantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Pantry Inventory</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Urgency</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
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
