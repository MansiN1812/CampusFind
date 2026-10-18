
import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";

const API = "http://localhost:5000/api";

const LostItems = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin/");

  const [lostItems, setLostItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLostItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/items`);

      if (!response.ok) {
        throw new Error("Could not load lost item reports.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected data received from server.");
      }

      const lost = data.filter(
        (item) =>
          String(item.type).toLowerCase() === "lost" &&
          String(item.status || "pending").toLowerCase() !== "recovered"
      );

      setLostItems(lost);
    } catch (err) {
      console.error("Lost items error:", err);
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLostItems();
  }, [fetchLostItems]);

  const filteredItems = lostItems.filter((item) =>
    String(item.item_name || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  const removeItemFromList = (id) => {
    setLostItems((previous) =>
      previous.filter((item) => String(item.id) !== String(id))
    );
  };

  return (
    <div className="app-container">
      <Navbar admin={isAdmin} />
      <Sidebar admin={isAdmin} />

      <main className="lost-items-main">
        <div className="lost-items-header">
          <div className="lost-items-header-text">
            <span className="welcome-text">
              {isAdmin ? "ADMINISTRATION" : "STUDENT PORTAL"}
            </span>

            <h1>{isAdmin ? "Manage Lost Items" : "Lost Items"}</h1>

            <p>
              {isAdmin
                ? "Review and monitor lost item reports submitted on CampusFind."
                : "Browse items that have been reported as lost."}
            </p>
          </div>

          {!isAdmin && (
            <Link to="/report-lost" className="lost-report-btn">
              <Plus size={18} />
              Report Lost Item
            </Link>
          )}
        </div>

        <div className="lost-filter-bar">
          <div className="lost-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search lost items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="lost-filter-btn"
            type="button"
            onClick={fetchLostItems}
            disabled={loading}
          >
            <RefreshCw size={17} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <p className="lost-total-count">
          {isAdmin ? "Total active lost reports: " : "Active lost items: "}
          <strong>{filteredItems.length}</strong>
        </p>

        {error && (
          <div role="alert" className="dashboard-error">
            {error}
            <button type="button" onClick={fetchLostItems}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="lost-loading-text">Loading lost items...</p>
        ) : filteredItems.length === 0 ? (
          <div className="lost-empty-state">
            <h3>No lost items found</h3>
            <p>
              {searchTerm
                ? "Try a different search."
                : "There are currently no active lost item reports."}
            </p>
          </div>
        ) : (
          <div className="lost-items-grid">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                image={item.image}
                title={item.item_name}
                category={item.category}
                location={item.location}
                date={item.item_date}
                status="Lost"
                type="lost"
                onRecovered={removeItemFromList}
                onDeleted={removeItemFromList}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LostItems;