import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  MapPin,
  CalendarDays,
  PackageCheck,
  FileText,
  Send,
  X,
} from "lucide-react";

const ReportFound = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // HANDLE IMAGE
  // ===============================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // 5 MB image size limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  // ===============================
  // SUBMIT FORM
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.itemName.trim()) {
      alert("Please enter the item name.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter where you found the item.");
      return;
    }

    if (!formData.date) {
      alert("Please select the date.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please provide a description.");
      return;
    }

   
try {
  const savedUser = localStorage.getItem("campusfindUser");

  if (!savedUser) {
    alert("Please log in again before submitting a report.");
    return;
  }

  let loggedInUser;

  try {
    loggedInUser = JSON.parse(savedUser);
  } catch {
    alert("Your login session is invalid. Please log in again.");
    return;
  }

  const userId =
    loggedInUser?.id ??
    loggedInUser?.userId ??
    loggedInUser?.user_id;

  if (!userId) {
    alert("Your user ID is missing. Please log in again.");
    return;
  }

  const dataToSend = new FormData();

  dataToSend.append("userId", String(userId));
  dataToSend.append("itemName", formData.itemName);
  dataToSend.append("category", formData.category);
  dataToSend.append("location", formData.location);
  dataToSend.append("date", formData.date);
  dataToSend.append("description", formData.description);
  dataToSend.append("type", "found");

  if (image) {
    dataToSend.append("image", image);
  }

  const response = await fetch(
    "http://localhost:5000/api/items",
    {
      method: "POST",
      body: dataToSend,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Failed to submit report.");
    return;
  }

  alert("Found item report submitted successfully!");

  setFormData({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
  });

  setImage(null);

  navigate("/found-items");
} catch (error) {
  console.error("Error submitting found report:", error);
  alert("Cannot connect to the server.");
}
  };

  return (
    <div className="form-page">

      {/* HEADER */}
      <header className="simple-page-header">

        <Link
          to="/found-items"
          className="back-link"
        >
          <ArrowLeft size={18} />
          Back to Found Items
        </Link>

        <div className="brand-logo">

          <div className="brand-icon">
            <PackageCheck size={20} />
          </div>

          <span>
            Campus<span>Find</span>
          </span>

        </div>

        <div></div>

      </header>


      {/* MAIN CONTENT */}
      <main className="report-container">

        {/* PAGE HEADING */}
        <div className="report-heading">

          <div className="report-icon found">
            <PackageCheck size={25} />
          </div>

          <div>

            <span>FOUND ITEM REPORT</span>

            <h1>Report a Found Item</h1>

            <p>
              Help return someone's belongings by providing
              accurate details about the item you found.
            </p>

          </div>

        </div>


        {/* FORM */}
        <form
          className="report-card"
          onSubmit={handleSubmit}
        >

          {/* ITEM INFORMATION */}
          <div className="form-section">

            <h3>Item Information</h3>

            <p>
              Tell us about the item you found.
            </p>

            <div className="form-grid">

              {/* ITEM NAME */}
              <div className="form-group">

                <label>
                  Item Name *
                </label>

                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g. Blue Water Bottle"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* CATEGORY */}
              <div className="form-group">

                <label>
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
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

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Books">
                    Books
                  </option>

                  <option value="Clothing">
                    Clothing
                  </option>

                  <option value="Keys">
                    Keys
                  </option>

                  <option value="Stationery">
                    Stationery
                  </option>

                  <option value="Bags">
                    Bags
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* LOCATION & DATE */}
          <div className="form-section">

            <h3>Where & When?</h3>

            <p>
              Provide details about where and when you found
              the item.
            </p>

            <div className="form-grid">

              {/* LOCATION */}
              <div className="form-group">

                <label>
                  <MapPin size={15} />
                  Found Location *
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. College Canteen"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* DATE */}
              <div className="form-group">

                <label>
                  <CalendarDays size={15} />
                  Date Found *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>


          {/* DESCRIPTION */}
          <div className="form-section">

            <h3>Description</h3>

            <p>
              Provide identifying details that can help us
              find the owner.
            </p>

            <div className="form-group">

              <label>
                <FileText size={15} />
                Item Description *
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe the colour, brand, condition, identifying marks or any other details..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>

            </div>

          </div>


          {/* IMAGE UPLOAD */}
          <div className="form-section">

            <h3>Item Image</h3>

            <p>
              Upload an image of the found item if available.
            </p>

            <label className="upload-box">

              <Upload size={28} />

              <strong>
                {image
                  ? image.name
                  : "Click to upload an image"}
              </strong>

              <span>
                PNG, JPG or JPEG • Maximum 5 MB
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
              />

            </label>

            {image && (
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => setImage(null)}
              >
                <X size={15} />
                Remove image
              </button>
            )}

          </div>


          {/* ACTION BUTTONS */}
          <div className="report-actions">

            <Link
              to="/found-items"
              className="cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="primary-btn"
            >
              Submit Found Report
              <Send size={17} />
            </button>

          </div>

        </form>

      </main>

    </div>
  );
};

export default ReportFound;