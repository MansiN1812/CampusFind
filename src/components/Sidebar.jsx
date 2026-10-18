
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Search,
  PackageOpen,
  ClipboardList,
  HeartHandshake,
  Users,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  ShieldCheck,
  House,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function getLoggedInUser() {
  try {
    const saved = localStorage.getItem("campusfindUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function Sidebar({ admin = false }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ lost: 0, found: 0 });

  const loadCounts = useCallback(async () => {
    try {
      const user = getLoggedInUser();
      const response = await fetch(`${API}/items`);

      if (!response.ok) return;

      const items = await response.json();
      if (!Array.isArray(items)) return;

      // Student sees only their own reports.
      const visibleItems = items;

      setCounts({
        lost: visibleItems.filter(
          (item) => String(item.type).toLowerCase() === "lost"
        ).length,
        found: visibleItems.filter(
          (item) => String(item.type).toLowerCase() === "found"
        ).length,
      });
    } catch (error) {
      console.error("Unable to load sidebar counts:", error);
    }
  }, [admin]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const studentLinks = [
    { title: "Home", icon: House, path: "/" },
    {
      title: "Overview",
      icon: LayoutDashboard,
      path: "/student-dashboard",
    },
    {
      title: "Lost Items",
      icon: Search,
      path: "/lost-items",
      count: counts.lost,
    },
    {
      title: "Found Items",
      icon: PackageOpen,
      path: "/found-items",
      count: counts.found,
    },
    {
      title: "My Reports",
      icon: ClipboardList,
      path: "/my-reports",
    },
    {
      title: "My Claims",
      icon: HeartHandshake,
      path: "/my-claims",
    },
  ];

  const adminLinks = [
    { title: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
    { title: "Lost Items", icon: Search, path: "/admin/lost-items" },
    { title: "Found Items", icon: PackageOpen, path: "/admin/found-items" },
    { title: "Users", icon: Users, path: "/admin/users" },
    { title: "Claims", icon: HeartHandshake, path: "/admin/claims" },
    { title: "Reports", icon: BarChart3, path: "/admin/reports" },
  ];

  const links = admin ? adminLinks : studentLinks;

  const handleLogout = () => {
    localStorage.removeItem("campusfindUser");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">CF</div>
        <div>
          <strong>CampusFind</strong>
          <span>{admin ? "Admin Panel" : "Student Portal"}</span>
        </div>
      </div>

      <div className="sidebar-section-title">MAIN MENU</div>

      <nav className="sidebar-nav">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.title}</span>

              {item.count !== undefined && (
                <span
                  style={{
                    marginLeft: "auto",
                    minWidth: "24px",
                    textAlign: "center",
                    padding: "2px 7px",
                    borderRadius: "12px",
                    background: "#e8efff",
                    color: "#174ea6",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {!admin && (
        <>
          <div className="sidebar-section-title">QUICK ACTION</div>
          <NavLink to="/report-lost" className="sidebar-link report-link">
            <PlusCircle size={19} />
            <span>Report an Item</span>
          </NavLink>
        </>
      )}

      <div className="sidebar-bottom">
        <NavLink
          to={admin ? "/admin/settings" : "/settings"}
          className="sidebar-link"
        >
          {admin ? <ShieldCheck size={19} /> : <Settings size={19} />}
          <span>{admin ? "Admin Settings" : "Settings"}</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-link logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;