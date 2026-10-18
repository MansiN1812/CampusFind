import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

        setFormData({
          itemName: data.item_name || "",
          category: data.category || "",
          location: data.location || "",
          date: data.item_date
            ? data.item_date.substring(0, 10)
            : "",
          description: data.description || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        alert("Cannot connect to the server.");
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // UPDATE ITEM
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.itemName ||
      !formData.category ||
      !formData.location ||
      !formData.date ||
      !formData.description
    ) {
      alert("Please fill all fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update item.");
        setSaving(false);
        return;
      }

      alert("Item updated successfully!");

      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />

        <main className="main-content">
          <p>Loading item...</p>
        </main>
      </>
    );
  }

  // ===============================
  // PAGE
  // ===============================

  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="main-content">

        <div className="page-header">
          <div>
            <h1>Edit Item</h1>
            <p>
              Update the details of your reported item.
            </p>
          </div>
        </div>

        <div className="edit-form-container">

          <form
            className="edit-item-form"
            onSubmit={handleSubmit}
          >

            {/* ITEM NAME */}
            <div className="form-group">
              <label>Item Name</label>

              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name"
              />
            </div>

            {/* CATEGORY */}
            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select category
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Documents">
                  Documents
                </option>

                <option value="Books">
                  Books
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where was the item lost/found?"
              />
            </div>

            {/* DATE */}
            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item..."
                rows="5"
              />
            </div>

            {/* BUTTONS */}
            <div className="edit-form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </>
  );
};

export default EditItem;