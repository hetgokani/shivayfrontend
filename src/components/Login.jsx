import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Exact hex colors from the image
  const colors = {
    shivayGreen: "#3a7a27", // Main Brand Green
    heroBg: "#2d5a27", // Darker Side Panel
    primaryLight: "#76b543", // Success/Leaf Green
    inputBg: "#f9f9f9",
    border: "#eeeeee",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        formData,
        { withCredentials: true },
      );

      if (response.status === 200) {
        const user = response.data.data.user;
        const token = response.data.token;

        login(user, token);
        toast.success("Login Successful!!");

        const userRole = user?.role?.rolename?.toLowerCase().trim();

        setTimeout(() => {
          if (userRole === "user") {
            navigate("/");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* LEFT PANEL - Hero Section */}
      <div className="side-panel">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="content-wrapper"
        >
          <Leaf size={80} className="leaf-icon" />
          <h1>
            Welcome Back to <span>Shivay Herbals</span>
          </h1>
          <p>
            Experience purity and wellness with our premium herbal products.
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Form Section */}
      <div className="form-panel">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="form-card"
        >
          <div className="form-header">
            <h2>Login</h2>
            <p>Access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <Mail size={20} className="field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field">
              <Lock size={20} className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          font-family: 'Inter', 'Poppins', sans-serif;
        }

        /* Side Panel Styling */
        .side-panel {
          flex: 1;
          background: ${colors.heroBg};
          background: linear-gradient(145deg, #2d5a27 0%, #1a3c17 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: white;
        }

        .content-wrapper {
          max-width: 450px;
          text-align: left;
        }

        .leaf-icon {
          color: #8cc63f;
          margin-bottom: 20px;
        }

        .content-wrapper h1 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 15px;
        }

        .content-wrapper span {
          color: #8cc63f;
        }

        .content-wrapper p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* Form Panel Styling */
        .form-panel {
          flex: 1;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .form-card {
          width: 100%;
          max-width: 420px;
        }

        .form-header h2 {
          font-size: 2.2rem;
          color: #333;
          margin-bottom: 8px;
        }

        .form-header p {
          color: #777;
          margin-bottom: 35px;
        }

        /* Input Styling */
        .input-field {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          background: ${colors.inputBg};
          border: 1.5px solid ${colors.border};
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .input-field:focus-within {
          border-color: ${colors.shivayGreen};
          background: #fff;
          box-shadow: 0 0 0 4px rgba(58, 122, 39, 0.1);
        }

        .field-icon {
          margin-left: 15px;
          color: #999;
        }

        .input-field input {
          width: 100%;
          padding: 16px 15px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          color: #333;
        }

        .toggle-eye {
          background: none;
          border: none;
          padding: 0 15px;
          cursor: pointer;
          color: #999;
          display: flex;
          align-items: center;
        }

        /* Button Styling */
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: ${colors.shivayGreen};
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2d5a27;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .footer-text {
          text-align: center;
          margin-top: 30px;
          color: #666;
        }

        .reg-link {
          color: ${colors.shivayGreen};
          text-decoration: none;
          font-weight: 700;
        }

        .reg-link:hover {
          text-decoration: underline;
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .content-wrapper h1 { font-size: 2.2rem; }
        }

        @media (max-width: 850px) {
          .side-panel { display: none; }
          .form-panel { flex: 1; }
        }
      `}</style>
    </div>
  );
};

export default Login;
