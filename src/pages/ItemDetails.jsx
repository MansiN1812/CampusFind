import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Tag,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH ITEM
  // ===============================

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/items/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Item not found.");
          navigate(-1);
          return;
        }

        setItem(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  // ===============================
  // RECOVER ITEM
  // ===============================

  const handleRecover = async () => {
    const confirmRecover = window.confirm(
      "Are you sure you want to mark this item as recovered?"
    );

    if (!confirmRecover) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${id}/recover`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update item.");
        return;
      }

      alert("Item marked as recovered successfully!");

      setItem((prev) => ({
        ...prev,
        status: "recovered",
      }));
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the server.");
    }
  };

  // ===============================
  // DELETE ITEM
  // ===============================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete item.");
        return;
      }

      alert("Item deleted successfully!");

      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the server.");
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="item-details-page">
        <div className="item-details-loading">
          Loading item details...
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `http://localhost:5000${item.image}`
    : "https://via.placeholder.com/700x450?text=No+Image";

  const isRecovered = item.status === "recovered";

  return (
    <div className="item-details-page">

      <div className="item-details-container">

        {/* BACK */}

        <button
          className="details-back-btn"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* MAIN CARD */}

        <div className="item-details-card">

          {/* IMAGE */}

          <div className="item-details-image-section">

            <img
              src={imageUrl}
              alt={item.item_name}
              className="item-details-image"
            />

            <span
              className={`details-status ${
                item.type === "found"
                  ? "details-found"
                  : "details-lost"
              }`}
            >
              {item.type === "found" ? "Found" : "Lost"}
            </span>

          </div>

          {/* INFORMATION */}

          <div className="item-details-content">

            <div className="details-category">
              {item.category}
            </div>

            <h1>{item.item_name}</h1>

            <p className="details-subtitle">
              {item.type === "lost"
                ? "This item has been reported as lost."
                : "This item has been reported as found."}
            </p>

            {/* INFO */}

            <div className="details-info-grid">

              <div className="details-info-box">
                <MapPin size={19} />

                <div>
                  <span>Location</span>
                  <strong>{item.location}</strong>
                </div>
              </div>

              <div className="details-info-box">
                <CalendarDays size={19} />

                <div>
                  <span>Date</span>
                  <strong>{item.item_date}</strong>
                </div>
              </div>

              <div className="details-info-box">
                <Tag size={19} />

                <div>
                  <span>Category</span>
                  <strong>{item.category}</strong>
                </div>
              </div>

              <div className="details-info-box">
                <CheckCircle2 size={19} />

                <div>
                  <span>Status</span>

                  <strong>
                    {isRecovered
                      ? "Recovered"
                      : "Active"}
                  </strong>
                </div>
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="details-description">

              <h3>Description</h3>

              <p>
                {item.description}
              </p>

            </div>

            {/* ACTIONS */}

            <div className="details-actions">

              {!isRecovered && (
                <button
                  className="details-recover-btn"
                  onClick={handleRecover}
                  type="button"
                >
                  <CheckCircle2 size={17} />
                  Mark as Recovered
                </button>
              )}

              <button
                className="details-edit-btn"
                onClick={() =>
                  navigate(`/edit-item/${id}`)
                }
                type="button"
              >
                <Pencil size={17} />
                Edit Item
              </button>

              <button
                className="details-delete-btn"
                onClick={handleDelete}
                type="button"
              >
                <Trash2 size={17} />
                Delete Item
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ItemDetails;