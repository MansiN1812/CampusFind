
import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";

const FoundItems = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin/");

  const [foundItems, setFoundItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        return response.json();
      })
      .then((data) => {
        const found = data.filter(
          (item) =>
            item.type === "found" &&
            item.status !== "recovered"
        );

        setFoundItems(found);
      })
      .catch((error) => {
        console.error("Error fetching found items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = foundItems.filter((item) =>
    (item.item_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Navbar admin={isAdmin} />

      <Sidebar admin={isAdmin} />

      <main className="lost-items-main">
        <div className="lost-items-header">
          <div className="lost-items-header-text">
            <span className="welcome-text">
              {isAdmin ? "ADMIN PANEL" : "STUDENT PORTAL"}
            </span>

            <h1>
              {isAdmin ? "Manage Found Items" : "Found Items"}
            </h1>

            <p>
              {isAdmin
                ? "View and manage all active found item reports."
                : "Browse items that have been reported as found."}
            </p>
          </div>

          {!isAdmin && (
            <Link
              to="/report-found"
              className="lost-report-btn"
            >
              <Plus size={18} />
              Report Found Item
            </Link>
          )}
        </div>

        <div className="lost-filter-bar">
          <div className="lost-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search found items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="lost-filter-btn"
            type="button"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {isAdmin && !loading && (
          <p>
            Active found item reports:{" "}
            <strong>{filteredItems.length}</strong>
          </p>
        )}

        {loading ? (
          <p className="lost-loading-text">
            Loading found items...
          </p>
        ) : filteredItems.length === 0 ? (
          <div className="lost-empty-state">
            <h3>No found items found</h3>

            <p>
              {searchTerm
                ? "Try a different search."
                : "There are currently no active found item reports."}
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
                status="Found"
                type="found"
                onRecovered={(id) => {
                  setFoundItems((prev) =>
                    prev.filter((item) => item.id !== id)
                  );
                }}
                onDeleted={(id) => {
                  setFoundItems((prev) =>
                    prev.filter((item) => item.id !== id)
                  );
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoundItems;