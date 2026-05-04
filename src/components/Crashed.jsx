import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FaChartPie,
  FaUserShield,
  FaBars,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaRegEye,
  FaArrowRightFromBracket,
  FaBoxOpen,
  FaBoxesStacked,
  FaPercent,
  FaFileInvoice,
  FaTruck,
  FaWeightHanging,
} from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { FaQuestionCircle, FaClipboardList } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

import CreateRole from "./CreateRole";
import ViewRole from "./ViewRole";
import CreateUser from "./CreateUser";
import ViewProducts from "./ViewProducts";
import CreateProduct from "./CreateProduct";
import CreateCategory from "./CreateCategory";
import CreateAttribute from "./CreateAttribute";

import Createfaq from "./Createfaq";

import "./Crashed.css";

// Access Denied Fallback UI
const AccessDenied = () => (
  <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
    <h2>Access Denied</h2>
    <p>You do not have permission to view this module.</p>
  </div>
);

export const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: "25px" }}>
    <h2
      style={{
        color: "var(--mern-admin-text-main)",
        fontSize: "24px",
        fontWeight: "700",
        margin: 0,
      }}
    >
      {title}
    </h2>
    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
      {subtitle}
    </p>
    <div
      style={{
        width: "60px",
        height: "4px",
        background: "var(--mern-admin-primary)",
        marginTop: "15px",
        borderRadius: "2px",
      }}
    />
  </div>
);

const Crashed = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openProductMenu, setOpenProductMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth > 768,
  );

  const [editingProduct, setEditingProduct] = useState(null);
  const [lowStockCount, setLowStockCount] = useState(0);

  const permissions = auth?.user?.role?.permissions;

  // EXACT PERMISSIONS BASED ON YOUR ROLE SCHEMA
  const canShowAccessControl =
    permissions?.role?.add || permissions?.role?.view;
  const canShowProductControl =
    permissions?.products?.add || permissions?.products?.view;
  const canShowCategoryControl =
    permissions?.category?.add || permissions?.category?.view;
  const canShowStockControl =
    permissions?.stock?.view || permissions?.stock?.add;
  const canShowGstControl = permissions?.gst?.view || permissions?.gst?.add;
  const canShowFaqControl = permissions?.faq?.view;

  // NEW: Orders Permission (Checking the 'order' key from your schema)
  const canShowOrderControl =
    permissions?.order?.view || permissions?.order?.edit;
  const canShowInvoiceControl =
    permissions?.invoice?.view || permissions?.invoice?.add;
  useEffect(() => {
    if (!auth?.user) navigate("/login");
  }, [auth, navigate]);

  const handleGoToCreate = () => {
    setEditingProduct(null);
    setActivePage("create-products");
  };

  const handleGoToEdit = (product) => {
    setEditingProduct({ ...product, mode: "edit" });
    setActivePage("create-products");
  };

  const handleGoToDuplicate = (product) => {
    setEditingProduct({ ...product, mode: "duplicate" });
    setActivePage("create-products");
  };

  const handleBackToView = () => {
    setEditingProduct(null);
    setActivePage("view-products");
  };

  const handleEditFromStock = async (productId) => {
    if (!productId) return toast.error("Product ID missing");
    try {
      const res = await axios.get(
        `https://shivaybackend.onrender.com/api/products/${productId}`,
      );
      const p = res.data.product;

      const formattedProduct = {
        ...p,
        brand: p.brand?._id || p.brand,
        category: p.category?._id || p.category,
        subcategory: p.subcategory?._id || p.subcategory,
        variants: res.data.variants,
        mode: "edit",
      };

      setEditingProduct(formattedProduct);
      setActivePage("create-products");
    } catch (err) {
      toast.error("Failed to fetch product details for editing.");
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <h2
              style={{
                color: "var(--mern-admin-text-main)",
                // clamp() makes it responsive (min 22px, scales up, max 28px)
                fontSize: "clamp(22px, 4vw, 28px)",
                fontWeight: "800",
                margin: 0,
                lineHeight: "1.2",
              }}
            >
              Welcome, {auth.user.name}
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "clamp(13px, 2vw, 16px)",
                marginTop: "8px",
                marginBottom: 0,
              }}
            >
              Developed By BlackNova Tech
            </p>
            <div
              style={{
                width: "60px",
                height: "5px",
                background: "var(--mern-admin-primary)",
                margin: "15px auto 0", // 'auto' perfectly centers the line
                borderRadius: "4px",
              }}
            />
          </div>
        );
      case "create-role":
        return permissions?.role?.add ? <CreateRole /> : <AccessDenied />;
      case "view-role":
        return permissions?.role?.view ? <ViewRole /> : <AccessDenied />;
      case "create-user":
        return permissions?.role?.add ? <CreateUser /> : <AccessDenied />;
      case "create-category":
        return permissions?.category?.add ? (
          <CreateCategory />
        ) : (
          <AccessDenied />
        );
      case "create-products":
        return permissions?.products?.add ? (
          <CreateProduct
            editData={editingProduct}
            onSuccess={handleBackToView}
            onCancel={handleBackToView}
          />
        ) : (
          <AccessDenied />
        );
      case "view-products":
        return permissions?.products?.view ? (
          <ViewProducts
            onEdit={handleGoToEdit}
            onDuplicate={handleGoToDuplicate}
            onAdd={handleGoToCreate}
          />
        ) : (
          <AccessDenied />
        );
      case "create-attribute":
        return permissions?.products?.add ? (
          <CreateAttribute />
        ) : (
          <AccessDenied />
        );

      case "manage-faq":
        return canShowFaqControl ? <Createfaq /> : <AccessDenied />;

      default:
        return <div>Loading Module...</div>;
    }
  };

  if (!auth?.user) return null;

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      background: "var(--mern-admin-bg)",
    },
    sidebar: {
      background: "var(--mern-admin-secondary)",
      color: "white",
      position: "fixed",
      top: 0,
      bottom: 0,
      transition: "0.3s",
      zIndex: 1000,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    logo: {
      padding: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    logoBox: {
      width: "32px",
      height: "32px",
      background: "var(--mern-admin-primary)",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    navItem: (active) => ({
      padding: "12px 24px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: active ? "var(--mern-admin-primary)" : "transparent",
    }),
    subItem: (active) => ({
      padding: "10px 24px 10px 54px",
      cursor: "pointer",
      opacity: active ? 1 : 0.7,
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }),
    main: {
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      transition: "0.3s",
    },
    header: {
      height: "70px",
      background: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 30px",
      borderBottom: "1px solid #e2e8f0",
    },
    content: { padding: "30px", overflowY: "auto", flex: 1 },
    card: {
      background: "white",
      padding: "30px",
      borderRadius: "16px",
      minHeight: "80vh",
      boxShadow: "0 2px 15px rgba(0,0,0,0.02)",
    },
    userProfile: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
    },
    menuBtn: {
      border: "none",
      background: "none",
      fontSize: "20px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" />

      <style>
        {`
          .mobile-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); z-index: 999; transition: 0.3s; }
          @media (max-width: 768px) {
            .mobile-overlay.active { display: block; }
            .responsive-main { margin-left: 0 !important; }
            .responsive-header { padding: 0 15px !important; }
            .responsive-content { padding: 15px !important; }
            .responsive-card { padding: 15px !important; }
          }
        `}
      </style>

      <div
        className={`mobile-overlay ${isSidebarVisible ? "active" : ""}`}
        onClick={() => setIsSidebarVisible(false)}
      ></div>

      <aside
        style={{ ...styles.sidebar, width: isSidebarVisible ? "260px" : "0px" }}
      >
        <div style={styles.logo}>
          <div style={styles.logoBox}>S</div> SHIVAY HERBALS
        </div>

        <div style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
          <div
            style={styles.navItem(activePage === "dashboard")}
            onClick={() => {
              setActivePage("dashboard");
              if (window.innerWidth <= 768) setIsSidebarVisible(false);
            }}
          >
            <FaChartPie /> Dashboard
          </div>

          {canShowAccessControl && (
            <>
              <div
                style={styles.navItem(openUserMenu)}
                onClick={() => setOpenUserMenu(!openUserMenu)}
              >
                <FaUserShield /> <span style={{ flex: 1 }}>Access Control</span>
                {openUserMenu ? (
                  <FaChevronDown size={10} />
                ) : (
                  <FaChevronRight size={10} />
                )}
              </div>
              {openUserMenu && (
                <div style={{ background: "rgba(0,0,0,0.1)" }}>
                  {permissions?.role?.add && (
                    <div
                      style={styles.subItem(activePage === "create-role")}
                      onClick={() => {
                        setActivePage("create-role");
                        if (window.innerWidth <= 768)
                          setIsSidebarVisible(false);
                      }}
                    >
                      <FaPlus size={10} /> Create Role
                    </div>
                  )}
                  {permissions?.role?.view && (
                    <div
                      style={styles.subItem(activePage === "view-role")}
                      onClick={() => {
                        setActivePage("view-role");
                        if (window.innerWidth <= 768)
                          setIsSidebarVisible(false);
                      }}
                    >
                      <FaRegEye size={10} /> View Roles
                    </div>
                  )}
                  {permissions?.role?.add && (
                    <div
                      style={styles.subItem(activePage === "create-user")}
                      onClick={() => {
                        setActivePage("create-user");
                        if (window.innerWidth <= 768)
                          setIsSidebarVisible(false);
                      }}
                    >
                      <FaPlus size={10} /> Create User
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {canShowProductControl && (
            <>
              <div
                style={styles.navItem(openProductMenu)}
                onClick={() => setOpenProductMenu(!openProductMenu)}
              >
                <FaBoxOpen /> <span style={{ flex: 1 }}>Products</span>
                {openProductMenu ? (
                  <FaChevronDown size={10} />
                ) : (
                  <FaChevronRight size={10} />
                )}
              </div>
              {openProductMenu && (
                <div style={{ background: "rgba(0,0,0,0.1)" }}>
                  {permissions?.products?.add && (
                    <div
                      style={styles.subItem(activePage === "create-attribute")}
                      onClick={() => {
                        setActivePage("create-attribute");
                        if (window.innerWidth <= 768)
                          setIsSidebarVisible(false);
                      }}
                    >
                      <FaPlus size={10} /> Attributes
                    </div>
                  )}

                  {permissions?.products?.add && (
                    <div
                      style={styles.subItem(activePage === "create-products")}
                      onClick={() => {
                        handleGoToCreate();
                        if (window.innerWidth <= 768)
                          setIsSidebarVisible(false);
                      }}
                    >
                      <FaPlus size={10} /> Create Product
                    </div>
                  )}
                  {permissions?.products?.view && (
                    <div
                      style={styles.subItem(activePage === "view-products")}
                      onClick={() => {
                        handleBackToView();
                        if (window.innerWidth <= 768)
                          setIsSidebarVisible(false);
                      }}
                    >
                      <FaRegEye size={10} /> View Products
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {canShowCategoryControl && (
            <div
              style={styles.navItem(activePage === "create-category")}
              onClick={() => {
                setActivePage("create-category");
                if (window.innerWidth <= 768) setIsSidebarVisible(false);
              }}
            >
              <BiSolidCategory /> Category
            </div>
          )}

          {canShowFaqControl && (
            <div
              style={styles.navItem(activePage === "manage-faq")}
              onClick={() => {
                setActivePage("manage-faq");
                if (window.innerWidth <= 768) setIsSidebarVisible(false);
              }}
            >
              <FaQuestionCircle /> Manage FAQ
            </div>
          )}

          {/* ✅ FIXED: Correctly standardized active states */}
        </div>
      </aside>

      <div
        className="responsive-main"
        style={{ ...styles.main, marginLeft: isSidebarVisible ? "260px" : "0" }}
      >
        <header style={styles.header} className="responsive-header">
          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            style={styles.menuBtn}
          >
            <FaBars />
          </button>
          <div
            style={{ position: "relative" }}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <div style={styles.userProfile}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>
                  {auth.user.name}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--mern-admin-primary)",
                  }}
                >
                  {auth.user.role?.rolename}
                </div>
              </div>
              <div style={styles.logoBox}>
                {auth.user.name[0].toUpperCase()}
              </div>
            </div>
            {showUserDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                  background: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  width: "150px",
                  zIndex: 2000,
                }}
                onClick={logout}
              >
                <div
                  style={{
                    color: "red",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <FaArrowRightFromBracket /> Sign Out
                </div>
              </div>
            )}
          </div>
        </header>
        <main style={styles.content} className="responsive-content">
          <div style={styles.card} className="responsive-card">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Crashed;
