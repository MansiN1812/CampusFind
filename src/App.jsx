
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import MyReports from "./pages/MyReports";
import EditItem from "./pages/EditItem";
import ItemDetails from "./pages/ItemDetails";
import MyClaims from "./pages/MyClaims";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import AdminUsers from "./pages/AdminUser.jsx";
import AdminReports from "./pages/AdminReports";
import "./App.css";

function AdminPlaceholder({ title }) {
  return (
    <div className="app-container">
      <Navbar admin={true} />
      <Sidebar admin={true} />

      <main className="lost-items-main">
        <span className="welcome-text">ADMIN PANEL</span>
        <h1>{title}</h1>

        <p>
          Manage CampusFind {title.toLowerCase()} from the admin panel.
        </p>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* Student item pages */}
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />

        {/* Admin item pages */}
        <Route
          path="/admin/lost-items"
          element={<LostItems />}
        />
        <Route
          path="/admin/found-items"
          element={<FoundItems />}
        />

        {/* Item details and editing */}
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/edit-item/:id" element={<EditItem />} />

        {/* Student pages */}
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/my-claims" element={<MyClaims />} />

        {/* Admin management pages */}
        

<Route path="/admin/users" element={<AdminUsers />} />
        <Route
          path="/admin/claims"
          element={<AdminPlaceholder title="Manage Claims" />}
        />
        <Route
  path="/admin/reports"
  element={<AdminReports />}
/>
        <Route
          path="/admin/settings"
          element={<AdminPlaceholder title="Admin Settings" />}
        />

        

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;