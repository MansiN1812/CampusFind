
import {
  MapPin,
  CalendarDays,
  ArrowUpRight,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ItemCard({
  id,
  image,
  title,
  category,
  location,
  date,
  status,
  type,
  onRecovered,
  onDeleted,
}) {
  const navigate = useNavigate();

  const normalizedStatus = String(status || "").toLowerCase();

  const isRecovered = normalizedStatus === "recovered";
  const isRejected = normalizedStatus === "rejected";
  const isPending = normalizedStatus === "pending";

  // DELETE ITEM
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Failed to delete item.");
        return;
      }

      alert("Item deleted successfully!");

      if (onDeleted) {
        onDeleted(id);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Cannot connect to the server.");
    }
  };

  // IMAGE URL
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `http://localhost:5000${
          image.startsWith("/") ? "" : "/"
        }${image}`
    : "https://via.placeholder.com/500x350?text=No+Image";

  // STATUS BADGE
  const getStatusClass = () => {
    if (isRecovered) return "status-recovered";
    if (isRejected) return "status-rejected";
    if (isPending) return "status-pending";

    return String(type || "").toLowerCase() === "found"
      ? "status-found"
      : "status-lost";
  };

  const displayStatus =
    isRecovered
      ? "Recovered"
      : isRejected
      ? "Rejected"
      : isPending
      ? "Pending"
      : status || (type === "found" ? "Found" : "Lost");

  return (
    <div className={`item-card ${isRecovered ? "item-card-recovered" : ""}`}>
      {/* ITEM IMAGE */}
      <div className="item-image-wrapper">
        <img
          src={imageUrl}
          alt={title || "Reported item"}
          className="item-image"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://via.placeholder.com/500x350?text=No+Image";
          }}
        />

        {/* STATUS BADGE */}
        <span className={`item-status ${getStatusClass()}`}>
          {isRecovered && <CheckCircle2 size={14} />}
          {displayStatus}
        </span>
      </div>

      {/* ITEM CONTENT */}
      <div className="item-content">
        <div className="item-category">{category || "Other"}</div>

        <h3>{title || "Unnamed item"}</h3>

        {/* LOCATION & DATE */}
        <div className="item-meta">
          <span>
            <MapPin size={14} />
            {location || "Location not specified"}
          </span>

          <span>
            <CalendarDays size={14} />
            {date || "Date not specified"}
          </span>
        </div>

        {/* FOOTER */}
        <div className="item-footer">
          <span className="item-type">
            {String(type).toLowerCase() === "lost"
              ? "Reported Lost"
              : "Reported Found"}
          </span>

          {!isRecovered && (
            <button
              className="edit-btn"
              type="button"
              onClick={() => navigate(`/edit-item/${id}`)}
            >
              Edit Item
            </button>
          )}

          <button
            className="view-item"
            type="button"
            onClick={() => navigate(`/item/${id}`)}
          >
            View
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* RECOVERY STATUS — ADMIN CONTROLS THIS */}
        {isRecovered ? (
          <div className="recovered-message">
            <CheckCircle2 size={17} />
            <span>This item has been recovered.</span>
          </div>
        ) : isRejected ? (
          <div className="rejected-message">
            <span>This report has been rejected.</span>
          </div>
        ) : null}

        {/* DELETE */}
        <button
          className="delete-btn"
          onClick={handleDelete}
          type="button"
        >
          <Trash2 size={16} />
          Delete Item
        </button>
      </div>
    </div>
  );
}

export default ItemCard;