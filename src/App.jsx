import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // ✅ Added missing import
import Crashed from "./components/Crashed";
import BenefitsPage from "./pages/BenefitsPage";
import ContactPage from "./pages/ContactPage";
import ReturnPage from "./pages/ReturnPage";
import TermsConditionPage from "./pages/TermsConditionPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

import FAQPage from "./pages/FAQPage";
import ShivayShopPage from "./pages/ShivayShopPage";
import ShivayDetailsPage from "./pages/ShivayDetailsPage";
/**
 * Enhanced Scroll Handler
 * Handles both "Scroll to Top" on page change and
 * "Scroll to ID" for cross-page navigation.
 */
const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If a hash exists (e.g., #about-section)
      const id = hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        // Timeout ensures the DOM is fully loaded before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // No hash: scroll to the top of the new page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
};

// ✅ 1. REVERSE PROTECTION: Logged-in users can't see Login/Register
const PublicRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) return null; // Wait for AuthProvider to check storage

  if (auth?.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ✅ 2. ROLE PROTECTION: Only Admins/Managers can see Dashboard
const ProtectDashboard = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) return null; // Prevents "flashing" or wrong redirects on refresh

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = auth.user?.role?.rolename?.toLowerCase().trim();

  // If they are just a "user", kick them to Home
  if (userRole === "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ✅ Wrapped main logic so useLocation() sits safely inside Router context
const AppContent = () => {
  const location = useLocation();

  // ✅ Check if we are on the dashboard
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* Logic for handling scrolls and hashes */}
      <ScrollHandler />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectDashboard>
                <Crashed />
              </ProtectDashboard>
            }
          />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/return-policy" element={<ReturnPage />} />
          <Route path="/terms-condition" element={<TermsConditionPage />} />
          <Route path="/products" element={<ShivayShopPage />} />
          <Route path="/Faq" element={<FAQPage />} />
          <Route path="/product/:id" element={<ShivayDetailsPage />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
