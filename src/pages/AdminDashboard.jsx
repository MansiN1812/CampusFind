
import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  Search,
  PackageOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/Statcard";

const API = "http://localhost:5000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Load dashboard data from backend
  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError("");

    try {
      const [usersResponse, itemsResponse] = await Promise.all([
        fetch(`${API}/api/users`),
        fetch(`${API}/api/items`),
      ]);

      if (!usersResponse.ok || !itemsResponse.ok) {
        throw new Error("Could not load dashboard data.");
      }

      const [usersData, itemsData] = await Promise.all([
        usersResponse.json(),
        itemsResponse.json(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);

      const allItems = Array.isArray(itemsData)
        ? itemsData
        : Array.isArray(itemsData.items)
        ? itemsData.items
        : [];

      setItems(allItems);
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to backend. Make sure server.js is running."
          : err.message
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Refresh periodically so newly submitted reports appear
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadDashboard(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [loadDashboard]);

  const students = users.filter(
    (user) => user.role?.toLowerCase() === "student"
  );

  const lostItems = items.filter(
    (item) => item.type?.toLowerCase() === "lost"
  );

  const foundItems = items.filter(
    (item) => item.type?.toLowerCase() === "found"
  );

  const recoveredItems = items.filter(
    (item) => item.status?.toLowerCase() === "recovered"
  );

  const rejectedItems = items.filter(
    (item) => item.status?.toLowerCase() === "rejected"
  );

  const recentItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.createdAt || 0).getTime() -
        new Date(a.created_at || a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const getStudentName = (item) => {
    const user = users.find(
      (u) => String(u.id) === String(item.user_id ?? item.userId)
    );

    return (
      item.student_name ||
      item.studentName ||
      user?.name ||
      "Unknown student"
    );
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN");
  };

  const getItemName = (item) =>
    item.item_name || item.itemName || item.name || "Unnamed item";

  const getStatusClass = (status) => {
    const value = String(status || "pending").toLowerCase();

    if (value === "recovered" || value === "resolved") {
      return "approved-badge";
    }

    if (value === "rejected") {
      return "rejected-badge";
    }

    return "pending-badge";
  };

  // Admin marks an item as recovered
  const handleRecover = async (item) => {
    if (String(item.status || "").toLowerCase() === "recovered") {
      return;
    }

    const confirmed = window.confirm(
      `Mark "${getItemName(item)}" as recovered?`
    );

    if (!confirmed) return;

    setUpdatingId(item.id);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/items/${item.id}/recover`,
        { method: "PUT" }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update recovery status."
        );
      }

      // Update the admin screen immediately
      setItems((previousItems) =>
        previousItems.map((currentItem) =>
          String(currentItem.id) === String(item.id)
            ? { ...currentItem, status: "recovered" }
            : currentItem
        )
      );

      window.alert("Item marked as recovered successfully!");

      // Sync the latest database data without showing the loading screen
      await loadDashboard(false);
    } catch (err) {
      console.error("Recovery error:", err);
      setError(err.message || "Could not recover item.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar admin />
      <Sidebar admin />

      <main className="dashboard-main">
        <div className="dashboard-heading">
          <div>
            <span className="welcome-text">ADMINISTRATION</span>
            <h1>Dashboard Overview</h1>
            <p>Monitor and manage CampusFind reports.</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => loadDashboard()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="admin-users-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => loadDashboard()}
            >
              Try Again
            </button>
          </div>
        )}

        <div className="stats-grid">
          <StatCard
            icon={<Users />}
            title="Total Students"
            value={loading ? "—" : students.length}
            description="Registered student accounts"
          />

          <StatCard
            icon={<Search />}
            title="Lost Reports"
            value={loading ? "—" : lostItems.length}
            description="Total lost item reports"
          />

          <StatCard
            icon={<PackageOpen />}
            title="Found Reports"
            value={loading ? "—" : foundItems.length}
            description="Total found item reports"
          />

          <StatCard
            icon={<CheckCircle2 />}
            title="Items Recovered"
            value={loading ? "—" : recoveredItems.length}
            description="Marked as recovered"
          />
        </div>

        <section className="admin-table-section">
          <div className="section-title-row">
            <div>
              <h2>Recent Reports</h2>
              <p>Latest lost and found submissions.</p>
            </div>

            <button
              type="button"
              className="outline-btn"
              onClick={() => navigate("/admin/reports")}
            >
              View all reports
            </button>
          </div>

          {loading ? (
            <p>Loading reports...</p>
          ) : !error && recentItems.length === 0 ? (
            <p>No reports have been submitted yet.</p>
          ) : !error ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>STUDENT</th>
                    <th>TYPE</th>
                    <th>LOCATION</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {recentItems.map((item) => {
                    const isRecovered =
                      String(item.status || "").toLowerCase() ===
                      "recovered";

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="table-item">
                            <div className="table-icon">
                              {item.type?.toLowerCase() === "lost"
                                ? "🔎"
                                : "📦"}
                            </div>

                            <div>
                              <strong>{getItemName(item)}</strong>
                              <span>{item.category || "Other"}</span>
                            </div>
                          </div>
                        </td>

                        <td>{getStudentName(item)}</td>

                        <td>
                          <span
                            className={
                              item.type?.toLowerCase() === "lost"
                                ? "type-lost"
                                : "type-found"
                            }
                          >
                            {item.type || "—"}
                          </span>
                        </td>

                        <td>{item.location || "—"}</td>

                        <td>
                          <span className={getStatusClass(item.status)}>
                            {isRecovered
                              ? "Recovered"
                              : item.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            item.created_at ||
                              item.createdAt ||
                              item.item_date
                          )}
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              type="button"
                              className="table-action"
                              title="View item"
                              onClick={() =>
                                navigate(`/item/${item.id}`)
                              }
                            >
                              <Eye size={17} />
                            </button>

                            {isRecovered ? (
                              <span
                                className="approved-badge"
                                title="This item has been recovered"
                              >
                                <CheckCircle2 size={15} />
                                Done
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="table-action"
                                title="Mark as recovered"
                                disabled={updatingId === item.id}
                                onClick={() => handleRecover(item)}
                              >
                                {updatingId === item.id ? (
                                  <RefreshCw size={17} />
                                ) : (
                                  <Check size={17} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="review-cards">
          <div className="review-card">
            <div className="review-card-icon">
              <Clock />
            </div>
            <div>
              <strong>Not connected</strong>
              <span>Claims feature needs a claims API</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/claims")}
            >
              Review
            </button>
          </div>

          <div className="review-card">
            <div className="review-card-icon">
              <CheckCircle2 />
            </div>
            <div>
              <strong>{loading ? "—" : recoveredItems.length}</strong>
              <span>Items marked recovered</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/reports")}
            >
              View
            </button>
          </div>

          <div className="review-card">
            <div className="review-card-icon">
              <XCircle />
            </div>
            <div>
              <strong>{loading ? "—" : rejectedItems.length}</strong>
              <span>Rejected reports</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/reports")}
            >
              View
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;