
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API = "http://localhost:5000/api/admin/reports";
const ITEMS_API = "http://localhost:5000/api/admin/reports/items";

function getCount(data, keys) {
  for (const key of keys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return 0;
}

function AdminReports() {
  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsResponse, itemsResponse] = await Promise.all([
        fetch(API),
        fetch(ITEMS_API),
      ]);

      if (!statsResponse.ok) {
        throw new Error(`Statistics API error: ${statsResponse.status}`);
      }

      if (!itemsResponse.ok) {
        throw new Error(`Items report API error: ${itemsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      const itemsData = await itemsResponse.json();

      setStats(Array.isArray(statsData) ? {} : statsData);

      const rows = Array.isArray(itemsData)
        ? itemsData
        : Array.isArray(itemsData.items)
          ? itemsData.items
          : [];

      setItems(rows);
    } catch (err) {
      console.error("Reports loading error:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure server.js is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const total = getCount(stats, ["total_items", "totalItems", "total"]);
  const lost = getCount(stats, ["lost_items", "lostItems", "lost"]);
  const found = getCount(stats, ["found_items", "foundItems", "found"]);
  const recovered = getCount(stats, [
    "recovered_items",
    "recoveredItems",
    "recovered",
  ]);

  const filteredItems = items.filter((item) =>
    [
      item.item_name,
      item.itemName,
      item.name,
      item.category,
      item.location,
      item.type,
      item.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN");
  };

  return (
    <div className="app-container">
      <Navbar admin={true} />
      <Sidebar admin={true} />

      <main className="lost-items-main admin-reports-page">
        <span className="welcome-text">ADMIN PANEL</span>

        <div className="admin-reports-heading">
          <div>
            <h1>Reports Management</h1>
            <p>
              View CampusFind item statistics and recently reported items.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadReports}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="admin-users-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadReports}>
              Try Again
            </button>
          </div>
        )}

        <div className="admin-report-stats">
          <div className="admin-report-card">
            <div className="admin-report-icon blue">
              <Package size={23} />
            </div>
            <div>
              <p>Total Items</p>
              <h2>{loading ? "—" : total}</h2>
            </div>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon orange">
              <Search size={23} />
            </div>
            <div>
              <p>Lost Items</p>
              <h2>{loading ? "—" : lost}</h2>
            </div>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon purple">
              <ClipboardList size={23} />
            </div>
            <div>
              <p>Found Items</p>
              <h2>{loading ? "—" : found}</h2>
            </div>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon green">
              <CheckCircle size={23} />
            </div>
            <div>
              <p>Recovered Items</p>
              <h2>{loading ? "—" : recovered}</h2>
            </div>
          </div>
        </div>

        <section className="admin-report-table-section">
          <div className="admin-report-table-heading">
            <div>
              <h2>Recent Items Report</h2>
              <p>Items reported on CampusFind</p>
            </div>

            <span className="admin-report-count">
              {filteredItems.length} items
            </span>
          </div>

          <div className="admin-report-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search item, category, location or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="admin-report-message">Loading reports...</p>
          ) : !error && filteredItems.length === 0 ? (
            <div className="admin-report-empty">
              <AlertCircle size={30} />
              <h3>No items found</h3>
              <p>
                {search
                  ? "Try another search term."
                  : "Reported items will appear here when available."}
              </p>
            </div>
          ) : !error ? (
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td>{item.id ?? "—"}</td>
                      <td>
                        {item.item_name || item.itemName || item.name || "—"}
                      </td>
                      <td>{item.category || "—"}</td>
                      <td>{item.location || "—"}</td>
                      <td>
                        <span className="admin-report-type">
                          {item.type || "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-report-status ${String(
                            item.status || "pending"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        {formatDate(
                          item.item_date ||
                            item.itemDate ||
                            item.created_at ||
                            item.createdAt
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default AdminReports;