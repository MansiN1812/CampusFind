import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  Users,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const About = () => {
  return (
    <div className="about-page">

      {/* Navbar */}
      <header className="public-navbar">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Search size={21} />
          </div>
          <span>Campus<span>Find</span></span>
        </Link>

        <nav className="public-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/lost-items">Lost Items</Link>
          <Link to="/found-items">Found Items</Link>
        </nav>

        <div className="public-nav-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="primary-btn">
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="eyebrow">
            <ShieldCheck size={16} />
            About CampusFind
          </div>

          <h1>
            Making lost things
            <span> easier to find.</span>
          </h1>

          <p>
            CampusFind is a campus-focused Lost & Found Management System
            designed to help students and staff report, search, and recover
            lost belongings quickly and securely.
          </p>

          <div className="about-buttons">
            <Link to="/report-lost" className="primary-btn large">
              Report Lost Item
              <ArrowRight size={18} />
            </Link>

            <Link to="/found-items" className="secondary-btn large">
              Browse Found Items
            </Link>
          </div>
        </div>

        <div className="about-visual">
          <div className="about-visual-card">
            <div className="visual-icon">
              <Search size={30} />
            </div>

            <h3>Find it faster.</h3>
            <p>
              Search through reported items and connect with the right person.
            </p>

            <div className="visual-check">
              <CheckCircle2 size={18} />
              Simple reporting
            </div>

            <div className="visual-check">
              <CheckCircle2 size={18} />
              Easy searching
            </div>

            <div className="visual-check">
              <CheckCircle2 size={18} />
              Secure verification
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="section-heading">
          <span>OUR MISSION</span>
          <h2>A smarter way to handle lost & found items.</h2>
          <p>
            Instead of depending only on notice boards or word of mouth,
            CampusFind brings everything into one organized platform.
          </p>
        </div>

        <div className="about-feature-grid">

          <div className="about-feature-card">
            <div className="feature-icon blue">
              <Search size={23} />
            </div>
            <h3>Easy to Search</h3>
            <p>
              Quickly search and filter lost and found items based on
              category, location and other details.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="feature-icon teal">
              <Users size={23} />
            </div>
            <h3>Built for Campus</h3>
            <p>
              Designed specifically for students, staff and administrators
              within a college environment.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="feature-icon green">
              <ShieldCheck size={23} />
            </div>
            <h3>Secure & Organized</h3>
            <p>
              Admin verification and structured reports help keep the
              platform reliable and trustworthy.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="feature-icon orange">
              <Bell size={23} />
            </div>
            <h3>Stay Updated</h3>
            <p>
              Keep track of your reports, item status and important
              notifications from one place.
            </p>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="about-process">
        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>Three simple steps.</h2>
        </div>

        <div className="process-grid">
          <div className="process-card">
            <div className="process-number">01</div>
            <h3>Report</h3>
            <p>
              Report a lost item or submit details about something you found
              on campus.
            </p>
          </div>

          <div className="process-card">
            <div className="process-number">02</div>
            <h3>Search</h3>
            <p>
              Browse or search the platform to find matching lost and found
              item reports.
            </p>
          </div>

          <div className="process-card">
            <div className="process-number">03</div>
            <h3>Recover</h3>
            <p>
              Connect with the appropriate person and recover the item
              through the campus process.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div>
          <h2>Lost something on campus?</h2>
          <p>
            Report it now and give your belongings a better chance of being
            returned.
          </p>
        </div>

        <Link to="/report-lost" className="white-btn">
          Report Lost Item
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div>
          <strong>CampusFind</strong>
          <p>Connecting campus communities, one item at a time.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>

    </div>
  );
};

export default About;