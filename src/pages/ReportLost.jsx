
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  MapPin,
  CalendarDays,
  Package,
  FileText,
  Send,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

// Get the currently logged-in user
const getLoggedInUser = () => {
  const keys = [
    "campusfindUser",
    "user",
    "loggedInUser",
    "currentUser",
  ];

  for (const key of keys) {
    try {
      const savedUser = localStorage.getItem(key);

      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (
          user?.id != null ||
          user?.userId != null ||
          user?.user_id != null
        ) {
          return user;
        }
      }
    } catch (error) {
      console.error("Unable to read user details:", error);
    }
  }

  const storedId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id");

  return storedId ? { id: storedId } : null;
};

const ReportLost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) {
      setImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(selectedImage.type)) {
      setErrorMessage(
        "Please select a JPG, JPEG or PNG image."
      );
      e.target.value = "";
      setImage(null);
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5 MB.");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedImage);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Get logged-in user's ID
    const user = getLoggedInUser();

    const userId =
      user?.id ??
      user?.userId ??
      user?.user_id;

    if (userId == null || String(userId).trim() === "") {
      setErrorMessage(
        "Your login details were not found. Please log in again."
      );
      return;
    }

    // Validate and clean form fields
    const cleanedData = {
      itemName: formData.itemName.trim(),
      category: formData.category.trim(),
      location: formData.location.trim(),
      date: formData.date,
      description: formData.description.trim(),
    };

    if (
      !cleanedData.itemName ||
      !cleanedData.category ||
      !cleanedData.location ||
      !cleanedData.date ||
      !cleanedData.description
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // Prepare data for the backend
    const dataToSend = new FormData();

    dataToSend.append("userId", String(userId));
    dataToSend.append("itemName", cleanedData.itemName);
    dataToSend.append("category", cleanedData.category);
    dataToSend.append("location", cleanedData.location);
    dataToSend.append("date", cleanedData.date);
    dataToSend.append("description", cleanedData.description);
    dataToSend.append("type", "lost");

    if (image) {
      dataToSend.append("image", image);
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        body: dataToSend,
      });

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = { message: responseText };
      }

      if (!response.ok) {
        console.error("Report submission failed:", result);

        setErrorMessage(
          result.message ||
          result.error ||
          `Failed to submit report (HTTP ${response.status}).`
        );
        return;
      }

      alert("Lost item report submitted successfully!");

      // Reset the form
      setFormData({
        itemName: "",
        category: "",
        location: "",
        date: "",
        description: "",
      });

      setImage(null);

      const fileInput = document.getElementById("lost-item-image");

      if (fileInput) {
        fileInput.value = "";
      }

      // Open the lost items listing
      navigate("/lost-items");
    } catch (error) {
      console.error("Error submitting lost report:", error);

      setErrorMessage(
        "Cannot connect to the server. Make sure the backend is running on port 5000."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <header className="simple-page-header">
        <Link to="/student-dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="brand-logo">
          <div className="brand-icon">
            <Package size={20} />
          </div>

          <span>
            Campus<span>Find</span>
          </span>
        </div>

        <div />
      </header>

      <main className="report-container">
        <div className="report-heading">
          <div className="report-icon lost">
            <Package size={25} />
          </div>

          <div>
            <span>LOST ITEM REPORT</span>
            <h1>Report a Lost Item</h1>

            <p>
              Provide accurate information to help others identify
              and return your item.
            </p>
          </div>
        </div>

        <form className="report-card" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Item Information</h3>
            <p>Tell us about the item you lost.</p>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="itemName">Item Name *</label>

                <input
                  id="itemName"
                  type="text"
                  name="itemName"
                  placeholder="e.g. Black Wallet"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Documents</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Books">Books</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Keys">Keys</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Where &amp; When?</h3>
            <p>Tell us where and when you last saw the item.</p>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="location">
                  <MapPin size={15} />
                  Last Seen Location *
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g. Library, Block A"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">
                  <CalendarDays size={15} />
                  Date Lost *
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toLocaleDateString("en-CA")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Description</h3>
            <p>Give identifying details to help others recognise it.</p>

            <div className="form-group">
              <label htmlFor="description">
                <FileText size={15} />
                Item Description *
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe the colour, brand, model or unique marks..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Item Image</h3>
            <p>Upload an image if you have one. This is optional.</p>

            <label className="upload-box" htmlFor="lost-item-image">
              <Upload size={28} />

              <strong>
                {image ? image.name : "Click to upload an image"}
              </strong>

              <span>PNG, JPG or JPEG • Maximum 5 MB</span>

              <input
                id="lost-item-image"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {errorMessage && (
            <div
              role="alert"
              style={{
                color: "#b42318",
                background: "#fef3f2",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              {errorMessage}
            </div>
          )}

          <div className="report-actions">
            <Link to="/student-dashboard" className="cancel-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Report"}
              {!submitting && <Send size={17} />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ReportLost;