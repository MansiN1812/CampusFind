import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "campusfindUser",
      JSON.stringify(data.user)
    );

    if (data.user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Server not connected. Please start the backend.");
  }
};



  return (
    <div className="auth-page">

      <div className="auth-left">
        <Link to="/" className="brand-logo auth-logo">
          <div className="brand-icon">
            <Search size={21} />
          </div>
          <span>Campus<span>Find</span></span>
        </Link>

        <div className="auth-left-content">
          <div className="eyebrow">
            <ShieldCheck size={16} />
            Campus Lost & Found
          </div>

          <h1>
            Welcome back to
            <span> CampusFind.</span>
          </h1>

          <p>
            Sign in to manage your lost and found reports, search for items,
            and stay connected with your campus community.
          </p>

          <div className="auth-benefits">
            <div>
              <ShieldCheck size={19} />
              Secure campus platform
            </div>

            <div>
              <Search size={19} />
              Quickly search reported items
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">
            <h2>Sign in</h2>
            <p>Enter your details to access your account.</p>
          </div>

          <div className="role-switch">
            <button
              type="button"
              className={role === "student" ? "selected" : ""}
              onClick={() => setRole("student")}
            >
              Student
            </button>

            <button
              type="button"
              className={role === "admin" ? "selected" : ""}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#forgot">Forgot password?</a>
              </div>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              Sign In
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-bottom-text">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;