import {
  Search,
  ShieldCheck,
  MapPin,
  ArrowRight,
  PackageSearch,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [recoveredCount, setRecoveredCount] = useState(0);
  const [newItemsToday, setNewItemsToday] = useState(0);

  // Fetch statistics from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((response) => response.json())
      .then((data) => {
        setRecoveredCount(data.recoveredItems || 0);
        setNewItemsToday(data.newItemsToday || 0);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, []);

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-navbar">

        <Link to="/" className="home-logo">
          <div className="logo-mark">
            CF
          </div>

          <div>
            <strong>CampusFind</strong>
            <span>Campus Lost & Found</span>
          </div>
        </Link>

        <div className="home-nav-links">
          <a href="#how-it-works">
            How it works
          </a>

          <a href="#recent">
            Recent items
          </a>

          <a href="#about">
            About
          </a>
        </div>

        <div className="home-actions">

          <Link
  to="/login"
  className="login-btn"
>
  Login
</Link>

          <Link
  to="/login"
  className="primary-btn"
>
  Get Started
  <ArrowRight size={17} />
</Link>

        </div>

      </nav>


      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>Trusted Campus Community</span>
          </div>

          <h1>
            Lost something?
            <br />
            <span>
              Let's help you find it.
            </span>
          </h1>

          <p>
            CampusFind makes it simple for students to
            report, search and recover lost belongings
            across campus.
          </p>

          <div className="hero-buttons">

            <Link
              to="/lost-items"
              className="primary-btn large"
            >
              <Search size={18} />
              Find an Item
            </Link>

            <Link
              to="/found-items"
              className="secondary-btn large"
            >
              <PackageSearch size={18} />
              Report Found Item
            </Link>

          </div>

          <div className="hero-trust">

            <div className="trust-users">

              <div className="mini-avatar">R</div>
              <div className="mini-avatar">P</div>
              <div className="mini-avatar">A</div>
              <div className="mini-avatar">+</div>

            </div>

            <div>
              <strong>500+ students</strong>
              <span>already using CampusFind</span>
            </div>

          </div>

        </div>


        {/* HERO VISUAL */}
        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">

              <div>
                <small>CampusFind</small>
                <h3>Find what you're looking for</h3>
              </div>

              <div className="preview-avatar">
                MN
              </div>

            </div>

            <div className="preview-search">
              <Search size={18} />
              <span>
                Search for wallet, ID card, laptop...
              </span>
            </div>

            <div className="preview-filters">

              <span className="filter-active">
                All Items
              </span>

              <span>Lost</span>
              <span>Found</span>

            </div>

            <div className="preview-items">

              <div className="preview-item">

                <div className="preview-item-icon">
                  🎒
                </div>

                <div>
                  <strong>Black Backpack</strong>
                  <small>
                    Library • 2 hours ago
                  </small>
                </div>

                <CheckCircle2
                  size={19}
                  className="check-icon"
                />

              </div>


              <div className="preview-item">

                <div className="preview-item-icon">
                  👛
                </div>

                <div>
                  <strong>Brown Wallet</strong>
                  <small>
                    Cafeteria • Yesterday
                  </small>
                </div>

                <CheckCircle2
                  size={19}
                  className="check-icon"
                />

              </div>


              <div className="preview-item">

                <div className="preview-item-icon">
                  🔑
                </div>

                <div>
                  <strong>Keychain</strong>
                  <small>
                    Main Block • 2 days ago
                  </small>
                </div>

                <CheckCircle2
                  size={19}
                  className="check-icon"
                />

              </div>

            </div>

          </div>


          {/* RECOVERED ITEMS FLOATING CARD */}
          <div className="floating-card floating-one">

            <HeartHandshake size={20} />

            <div>
              <strong>{recoveredCount}</strong>
              <span>Items Recovered</span>
            </div>

          </div>


          {/* NEW ITEMS TODAY FLOATING CARD */}
          <div className="floating-card floating-two">

            <MapPin size={20} />

            <div>
              <strong>{newItemsToday}</strong>
              <span>New Items Today</span>
            </div>

          </div>

        </div>

      </section>


      {/* STATS */}
      <section className="home-stats">

        <div>
          <strong>500+</strong>
          <span>Registered Students</span>
        </div>

        <div>
          <strong>320+</strong>
          <span>Items Reported</span>
        </div>

        <div>
          <strong>{recoveredCount}</strong>
          <span>Items Recovered</span>
        </div>

        <div>
          <strong>{newItemsToday}</strong>
          <span>New Items Today</span>
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Finding lost items made simple
          </h2>

          <p>
            A simple three-step process designed
            specifically for campus communities.
          </p>

        </div>


        <div className="steps">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <PackageSearch />
            </div>

            <h3>
              Report an Item
            </h3>

            <p>
              Tell us about the item you've lost
              or found and add important details.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <Search />
            </div>

            <h3>
              Search & Match
            </h3>

            <p>
              Browse reported items and find
              possible matches using smart filters.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <HeartHandshake />
            </div>

            <h3>
              Claim & Recover
            </h3>

            <p>
              Submit a claim and safely reconnect
              with your belongings.
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="home-footer">

        <div>
          <strong>CampusFind</strong>

          <p>
            Connecting students with their
            lost belongings.
          </p>
        </div>

        <div className="footer-copy">
          © 2026 CampusFind. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;