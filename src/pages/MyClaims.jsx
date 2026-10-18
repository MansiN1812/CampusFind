import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  Clock3,
  CheckCircle2,
  XCircle,
  PackageSearch,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MyClaims() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // No claims have been submitted yet.
  // Actual claims will be connected to the database later.
  const claims = [];

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = claim.itemName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingClaims = claims.filter(
    (claim) => claim.status === "Pending"
  ).length;

  const approvedClaims = claims.filter(
    (claim) => claim.status === "Approved"
  ).length;

  const rejectedClaims = claims.filter(
    (claim) => claim.status === "Rejected"
  ).length;

  const getStatusIcon = (status) => {
    if (status === "Pending") {
      return <Clock3 size={14} />;
    }

    if (status === "Approved") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "Rejected") {
      return <XCircle size={14} />;
    }

    return null;
  };

  return (
    <div className="dashboard-layout">

      {/* NAVBAR */}
      <Navbar />

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="dashboard-main my-claims-page">

        {/* PAGE HEADER */}
        <div className="page-heading claims-heading">

          <div>
            <span className="welcome-text">
              CAMPUSFIND
            </span>

            <h1>My Claims</h1>

            <p>
              Track the claims you have submitted for lost
              and found items.
            </p>
          </div>

        </div>

        {/* STATISTICS */}
        <div className="claim-stats">

          {/* TOTAL */}
          <div className="claim-stat-card">

            <div className="claim-stat-icon">
              <PackageSearch size={21} />
            </div>

            <div>
              <span>Total Claims</span>
              <h3>{claims.length}</h3>
            </div>

          </div>

          {/* PENDING */}
          <div className="claim-stat-card">

            <div className="claim-stat-icon pending">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>
              <h3>{pendingClaims}</h3>
            </div>

          </div>

          {/* APPROVED */}
          <div className="claim-stat-card">

            <div className="claim-stat-icon approved">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Approved</span>
              <h3>{approvedClaims}</h3>
            </div>

          </div>

          {/* REJECTED */}
          <div className="claim-stat-card">

            <div className="claim-stat-icon rejected">
              <XCircle size={21} />
            </div>

            <div>
              <span>Rejected</span>
              <h3>{rejectedClaims}</h3>
            </div>

          </div>

        </div>

        {/* SEARCH + FILTER */}
        <div className="claims-toolbar">

          <div className="claims-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search your claims..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="claim-filter">

            <SlidersHorizontal size={17} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

          </div>

        </div>

        {/* CLAIMS TABLE */}
        <div className="claims-table-card">

          <div className="claims-table-header">

            <div>

              <h2>Your Claims</h2>

              <p>
                {filteredClaims.length} claim
                {filteredClaims.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

            </div>

          </div>

          {/* NO CLAIMS */}
          {filteredClaims.length === 0 ? (

            <div className="no-claims">

              <PackageSearch size={45} />

              <h3>
                No claims found
              </h3>

              <p>
                You have not submitted any claims yet.
              </p>

            </div>

          ) : (

            /* CLAIMS TABLE */
            <div className="claims-table-wrapper">

              <table className="claims-table">

                <thead>

                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredClaims.map((claim) => (

                    <tr key={claim.id}>

                      {/* ITEM */}
                      <td>

                        <div className="claim-item-info">

                          <img
                            src={claim.image}
                            alt={claim.itemName}
                          />

                          <div>

                            <strong>
                              {claim.itemName}
                            </strong>

                            <span>
                              Claim #
                              {String(claim.id).padStart(
                                3,
                                "0"
                              )}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td>
                        {claim.category}
                      </td>

                      {/* LOCATION */}
                      <td>
                        {claim.location}
                      </td>

                      {/* DATE */}
                      <td>
                        {claim.date}
                      </td>

                      {/* STATUS */}
                      <td>

                        <span
                          className={`claim-status ${claim.status.toLowerCase()}`}
                        >
                          {getStatusIcon(
                            claim.status
                          )}

                          {claim.status}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td>

                        <button
                          className="claim-view-btn"
                          onClick={() =>
                            alert(
                              `Viewing claim for ${claim.itemName}`
                            )
                          }
                        >
                          <Eye size={15} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default MyClaims;