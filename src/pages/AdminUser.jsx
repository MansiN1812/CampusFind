
import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/api/users";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid users data received from server.");
      }

      console.log("AdminUsers: users received", data);
      setUsers(data);
    } catch (err) {
      console.error("AdminUsers fetch error:", err);
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
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.name || ""} ${user.email || ""} ${user.role || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const students = users.filter(
    (user) => user.role?.toLowerCase() === "student"
  ).length;

  const admins = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;

  return (
    <div className="app-container">
      <Navbar admin={true} />
      <Sidebar admin={true} />

      <main className="lost-items-main">
        <span className="welcome-text">ADMIN PANEL</span>
        <h1>Manage Users</h1>
        <p>View registered students and administrators on CampusFind.</p>

        <div className="lost-filter-bar">
          <div className="lost-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="admin-refresh-button"
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="admin-users-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadUsers}>
              Try Again
            </button>
          </div>
        )}

        <div className="admin-user-stats">
          <div className="admin-user-stat">
            <Users size={24} />
            <div>
              <p>Total Users</p>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="admin-user-stat">
            <GraduationCap size={24} />
            <div>
              <p>Students</p>
              <h2>{students}</h2>
            </div>
          </div>

          <div className="admin-user-stat">
            <ShieldCheck size={24} />
            <div>
              <p>Administrators</p>
              <h2>{admins}</h2>
            </div>
          </div>
        </div>

        <section className="admin-users-table-section">
          <h2>Registered Users</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : !error && filteredUsers.length === 0 ? (
            <p>
              {search
                ? "No users match your search."
                : "No registered users found."}
            </p>
          ) : !error ? (
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name || "—"}</td>
                      <td>{user.email || "—"}</td>
                      <td>
                        <span className="admin-role-badge">
                          {user.role || "student"}
                        </span>
                      </td>
                      <td>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
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
};

export default AdminUsers;