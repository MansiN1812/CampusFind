
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  PackageSearch,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API = "http://localhost:5000/api";


function getLoggedInUser() {
  const keys = [
    "campusfindUser",
    "user",
    "loggedInUser",
    "currentUser",
  ];

  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);

      if (value) {
        const user = JSON.parse(value);

        if (
          user &&
          typeof user === "object" &&
          (
            user.id != null ||
            user.userId != null ||
            user.user_id != null
          )
        ) {
          return user;
        }
      }
    } catch (error) {
      console.error("Could not read saved user:", error);
    }
  }

  const id =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id");

  return id ? { id } : null;
}
function MyReports() {
  const navigate = useNavigate();
  const currentUser = getLoggedInUser();

  const userId =
    currentUser?.id ??
    currentUser?.userId ??
    currentUser?.user_id;

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const response = await fetch(`${API}/items`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from server.");
      }

      setReports(data);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter to the current student's records.
  const myReports =
    userId == null
      ? []
      : reports.filter(
          (item) =>
            String(item.user_id ?? item.userId) === String(userId)
        );

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formattedReports = myReports.map((item) => {
    const rawStatus = String(item.status || "pending").toLowerCase();

    let status = "Pending";

    if (rawStatus === "recovered" || rawStatus === "resolved") {
      status = "Resolved";
    } else if (rawStatus === "matched") {
      status = "Matched";
    } else if (rawStatus === "rejected") {
      status = "Rejected";
    }

    return {
      id: item.id,
      image: item.image
        ? item.image.startsWith("http")
          ? item.image
          : `http://localhost:5000${
              item.image.startsWith("/") ? "" : "/"
            }${item.image}`
        : "",
      name: item.item_name || "Unnamed item",
      type: String(item.type).toLowerCase() === "lost" ? "Lost" : "Found",
      category: item.category || "—",
      location: item.location || "—",
      date: formatDate(item.item_date),
      status,
    };
  });

  const filteredReports = formattedReports.filter((report) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      report.name.toLowerCase().includes(query) ||
      report.category.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query);

    const matchesType =
      typeFilter === "All" || report.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const lostReports = formattedReports.filter(
    (report) => report.type === "Lost"
  ).length;

  const foundReports = formattedReports.filter(
    (report) => report.type === "Found"
  ).length;

  const resolvedReports = formattedReports.filter(
    (report) => report.status === "Resolved"
  ).length;

  const getStatusClass = (status) =>
    status.toLowerCase().replace(/\s+/g, "-");

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/items/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete report.");
      }

      setReports((previous) =>
        previous.filter((item) => String(item.id) !== String(id))
      );

      window.alert("Report deleted successfully.");
    } catch (err) {
      console.error("Delete report error:", err);
      window.alert(err.message || "Could not delete report.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main my-reports-page">
        <div className="page-heading reports-heading">
          <div>
            <span className="welcome-text">CAMPUSFIND</span>
            <h1>My Reports</h1>
            <p>Track and manage your lost and found reports.</p>
          </div>

          <div className="report-header-actions">
            <Link to="/report-lost" className="secondary-report-btn">
              <Plus size={17} />
              Report Lost
            </Link>

            <Link to="/report-found" className="primary-btn">
              <Plus size={17} />
              Report Found
            </Link>
          </div>
        </div>

        {error && (
          <div className="dashboard-error" role="alert">
            {error}
            <button type="button" onClick={() => fetchReports(true)}>
              Try again
            </button>
          </div>
        )}

        {userId == null && (
          <div className="dashboard-error" role="alert">
            Login user ID was not found. Please log in again. If this
            continues, check which localStorage key your login page uses.
          </div>
        )}

        <div className="report-stats">
          <div className="report-stat-card">
            <div className="report-stat-icon">
              <PackageSearch size={21} />
            </div>
            <div>
              <span>Total Reports</span>
              <h3>{formattedReports.length}</h3>
            </div>
          </div>

          <div className="report-stat-card">
            <div className="report-stat-icon lost-icon">
              <AlertCircle size={21} />
            </div>
            <div>
              <span>Lost Reports</span>
              <h3>{lostReports}</h3>
            </div>
          </div>

          <div className="report-stat-card">
            <div className="report-stat-icon found-icon">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Found Reports</span>
              <h3>{foundReports}</h3>
            </div>
          </div>

          <div className="report-stat-card">
            <div className="report-stat-icon resolved-icon">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Resolved</span>
              <h3>{resolvedReports}</h3>
            </div>
          </div>
        </div>

        <div className="reports-toolbar">
          <div className="reports-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="report-filter">
            <SlidersHorizontal size={17} />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Matched">Matched</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              type="button"
              className="text-button"
              onClick={() => fetchReports(true)}
              disabled={refreshing}
              title="Refresh reports"
            >
              <RefreshCw size={16} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="reports-table-card">
          <div className="reports-table-header">
            <div>
              <h2>Your Reports</h2>
              <p>
                {filteredReports.length} report
                {filteredReports.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="no-reports">
              <PackageSearch size={42} />
              <h3>Loading reports...</h3>
            </div>
          ) : userId == null ? (
            <div className="no-reports">
              Please log in again to view your reports.
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <div className="report-item-info">
                          {report.image ? (
                            <img src={report.image} alt={report.name} />
                          ) : (
                            <div className="report-image-placeholder">
                              <PackageSearch size={22} />
                            </div>
                          )}

                          <div>
                            <strong>{report.name}</strong>
                            <span>
                              Report #{String(report.id).padStart(3, "0")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`report-type-badge ${report.type.toLowerCase()}`}
                        >
                          {report.type}
                        </span>
                      </td>

                      <td>{report.category}</td>
                      <td>{report.location}</td>
                      <td>{report.date}</td>

                      <td>
                        <span
                          className={`report-status ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {report.status === "Resolved" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock3 size={14} />
                          )}
                          {report.status}
                        </span>
                      </td>

                      <td>
                        <div className="report-actions">
                          <button
                            className="table-action view"
                            title="View Report"
                            type="button"
                            onClick={() => navigate(`/item/${report.id}`)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            className="table-action edit"
                            title="Edit Report"
                            type="button"
                            onClick={() => navigate(`/edit-item/${report.id}`)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="table-action delete"
                            title="Delete Report"
                            type="button"
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-reports">
              <PackageSearch size={42} />
              <h3>No reports found</h3>
              <p>
                {search || typeFilter !== "All" || statusFilter !== "All"
                  ? "Try changing your search or filters."
                  : "Your submitted lost and found reports will appear here."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyReports;