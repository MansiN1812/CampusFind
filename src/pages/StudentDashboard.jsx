
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  PackageOpen,
  HeartHandshake,
  ClipboardList,
  Plus,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/Statcard";
import ItemCard from "../components/ItemCard";

const API = "http://localhost:5000/api";

function getLoggedInUser() {
  const possibleKeys = [
    "campusfindUser",
    "user",
    "loggedInUser",
    "currentUser",
  ];

  for (const key of possibleKeys) {
    try {
      const value = localStorage.getItem(key);

      if (value) {
        const parsed = JSON.parse(value);

        if (
          parsed &&
          typeof parsed === "object" &&
          (parsed.id != null ||
            parsed.userId != null ||
            parsed.user_id != null)
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Unable to read saved user:", error);
    }
  }

  const id =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id");

  return id ? { id } : null;
}

function StudentDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = getLoggedInUser();

  const userId =
    currentUser?.id ??
    currentUser?.userId ??
    currentUser?.user_id;

  const displayName =
    currentUser?.name ||
    currentUser?.username ||
    "Student";

  // Fetch latest reports and recovery statuses
  const fetchItems = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(`${API}/items`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load items.");
      }

      const allItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : null;

      if (!allItems) {
        throw new Error("Unexpected response from server.");
      }

      setItems(allItems);
    } catch (err) {
      console.error("Student dashboard error:", err);
      setError(
        err.message || "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch and automatic refresh every 5 seconds
  useEffect(() => {
    fetchItems();

    const intervalId = setInterval(() => {
      fetchItems(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchItems]);

  // Only the logged-in student's reports
  const myItems =
    userId == null
      ? []
      : items.filter(
          (item) =>
            String(item.user_id ?? item.userId) ===
            String(userId)
        );

  const lostItems = myItems.filter(
    (item) => String(item.type).toLowerCase() === "lost"
  );

  const foundItems = myItems.filter(
    (item) => String(item.type).toLowerCase() === "found"
  );

  const recoveredItems = myItems.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "recovered"
  );

  const activeLostItems = lostItems.filter(
    (item) =>
      !["recovered", "rejected"].includes(
        String(item.status || "").toLowerCase()
      )
  );

  const activeFoundItems = foundItems.filter(
    (item) =>
      !["recovered", "rejected"].includes(
        String(item.status || "").toLowerCase()
      )
  );

  const recentItems = [...myItems]
    .sort(
      (a, b) =>
        new Date(
          b.created_at || b.createdAt || b.item_date || 0
        ).getTime() -
        new Date(
          a.created_at || a.createdAt || a.item_date || 0
        ).getTime()
    )
    .slice(0, 6);

  const formatDate = (value) => {
    if (!value) return "—";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(value);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Students do not change recovery status; the admin does.
  const handleRecovered = () => {
    fetchItems(true);
  };

  const handleDeleted = (id) => {
    setItems((previousItems) =>
      previousItems.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  };

  const getDisplayStatus = (item) => {
    const status = String(item.status || "").toLowerCase();

    if (status === "recovered") return "Recovered";
    if (status === "rejected") return "Rejected";
    if (status === "pending") return "Pending";

    return String(item.type).toLowerCase() === "found"
      ? "Found"
      : "Lost";
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-heading">
          <div>
            <span className="welcome-text">
              STUDENT DASHBOARD
            </span>

            <h1>Welcome, {displayName} 👋</h1>

            <p>
              Track your lost and found reports on campus.
            </p>
          </div>

          <button
            className="primary-btn"
            type="button"
            onClick={() => navigate("/report-lost")}
          >
            <Plus size={18} />
            Report Item
          </button>
        </div>

        {error && (
          <div className="dashboard-error" role="alert">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => fetchItems(true)}
              disabled={refreshing}
            >
              Try again
            </button>
          </div>
        )}

        {userId == null && (
          <div className="dashboard-error" role="alert">
            Your login user ID was not found. Please log out
            and log in again.
          </div>
        )}

        <div className="stats-grid">
          <StatCard
            icon={<Search />}
            title="My Lost Items"
            value={loading ? "—" : lostItems.length}
            description={`${activeLostItems.length} active reports`}
          />

          <StatCard
            icon={<PackageOpen />}
            title="My Found Items"
            value={loading ? "—" : foundItems.length}
            description={`${activeFoundItems.length} active reports`}
          />

          <StatCard
            icon={<HeartHandshake />}
            title="My Claims"
            value="—"
            description="Claims feature not connected"
          />

          <StatCard
            icon={<ClipboardList />}
            title="Recovered"
            value={loading ? "—" : recoveredItems.length}
            description="Your recovered reports"
          />
        </div>

        <section className="dashboard-section">
          <div className="section-title-row">
            <div>
              <h2>My Recent Reports</h2>
              <p>Your latest lost and found submissions.</p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="text-button"
                type="button"
                onClick={() => fetchItems(true)}
                disabled={refreshing}
              >
                <RefreshCw size={16} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                className="text-button"
                type="button"
                onClick={() => navigate("/my-reports")}
              >
                View my reports
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="items-grid">
            {loading ? (
              <div className="dashboard-loading">
                Loading reports...
              </div>
            ) : userId == null ? (
              <div className="dashboard-empty">
                Please log in again to view your reports.
              </div>
            ) : recentItems.length === 0 ? (
              <div className="dashboard-empty">
                <PackageOpen size={42} />
                <h3>No reports yet</h3>
                <p>
                  Your lost and found reports will appear here.
                </p>
              </div>
            ) : (
              recentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  title={item.item_name || item.itemName}
                  category={item.category}
                  location={item.location}
                  date={formatDate(
                    item.item_date || item.created_at
                  )}
                  status={getDisplayStatus(item)}
                  type={item.type}
                  onRecovered={handleRecovered}
                  onDeleted={handleDeleted}
                />
              ))
            )}
          </div>
        </section>

        <section className="activity-section">
          <div className="section-title-row">
            <div>
              <h2>Recent Activity</h2>
              <p>Updates on your reports</p>
            </div>
          </div>

          <div className="activity-list">
            {recentItems.length === 0 ? (
              <div className="activity-item">
                <div className="activity-icon blue">+</div>
                <div>
                  <strong>No activity yet</strong>
                  <span>
                    Your report activity will appear here.
                  </span>
                </div>
              </div>
            ) : (
              recentItems.slice(0, 3).map((item) => {
                const status = String(
                  item.status || ""
                ).toLowerCase();

                const isRecovered = status === "recovered";

                return (
                  <div className="activity-item" key={item.id}>
                    <div
                      className={`activity-icon ${
                        isRecovered
                          ? "green"
                          : item.type === "found"
                          ? "blue"
                          : "orange"
                      }`}
                    >
                      {isRecovered ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        "+"
                      )}
                    </div>

                    <div>
                      <strong>
                        {isRecovered
                          ? "Item recovered"
                          : status === "rejected"
                          ? "Report rejected"
                          : item.type === "found"
                          ? "Found item reported"
                          : "Lost item reported"}
                      </strong>

                      <span>
                        {item.item_name || item.itemName} — Status:{" "}
                        {getDisplayStatus(item)}
                      </span>
                    </div>

                    <small>
                      {formatDate(
                        item.item_date || item.created_at
                      )}
                    </small>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;