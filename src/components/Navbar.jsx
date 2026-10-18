import { Bell, Search, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ admin = false }) {
  return (
    <header className="top-navbar">

      <Link to="/" className="navbar-logo">
        <div className="logo-mark">CF</div>

        <div>
          <h2>CampusFind</h2>
          <span>{admin ? "Administration" : "Campus Lost & Found"}</span>
        </div>
      </Link>

      <div className="navbar-right">

        {!admin && (
          <div className="navbar-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search items..."
            />
          </div>
        )}

        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            {admin ? "AD" : "MN"}
          </div>

          <div className="user-info">
            <strong>{admin ? "Administrator" : "Mansi Naik"}</strong>
            <span>{admin ? "Admin" : "Student"}</span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;