import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, X, Menu } from "lucide-react";
import axios from "axios";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // -- NEW STATE FOR SEARCH FUNCTIONALITY --
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Create a reference to the header to detect outside clicks
  const headerRef = useRef(null);

  const colors = {
    darkGreen: "#366e28",
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    white: "#FFFFFF",
    charcoal: "#333333",
    borderGray: "#e5e7eb",
  };

  // -- NEW: FETCH ALL PRODUCTS FOR SEARCH ONCE --
  useEffect(() => {
    const fetchProductsForSearch = async () => {
      try {
        const res = await axios.get(
          "https://shivaybackend.onrender.com/api/products",
        );
        // Only keep active products
        setAllProducts(res.data.filter((p) => p.status === "Active"));
      } catch (error) {
        console.error("Error fetching products for search:", error);
      }
    };
    fetchProductsForSearch();
  }, []);

  // -- NEW: HANDLE SEARCH INPUT --
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setIsSearching(true);
      const filtered = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          (p.category?.title &&
            p.category.title.toLowerCase().includes(query.toLowerCase())),
      );
      setSearchResults(filtered);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  // -- NEW: HANDLE CLICKING A SEARCH RESULT --
  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    searchQuery("");
    setIsSearching(false);
  };

  // Close search bar when clicking outside of the header area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setIsSearching(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      <header className="main-header" ref={headerRef}>
        <div className="header-container">
          {/* LEFT: LOGO */}
          <div className="logo-area">
            <Link to="/">
              <img
                src="/shivayherbalslogo.jpeg"
                alt="Shivay Herbals"
                className="logo-img"
              />
            </Link>
          </div>

          {/* MIDDLE: LINKS */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {[
                { name: "Home", link: "/" },
                { name: "About Us", link: "/#about-section" },
                { name: "Products", link: "/products" },
                { name: "Benefits", link: "/benefits" },
                { name: "FAQ", link: "/faq" },
                { name: "Contact", link: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="nav-item">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT: ICONS */}
          <div className="icon-group">
            <div
              className="icon-btn search-trigger"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) {
                  setSearchQuery("");
                  setIsSearching(false);
                }
              }}
            >
              {isSearchOpen ? (
                <X size={22} color={colors.primaryLight} />
              ) : (
                <Search size={22} color={colors.charcoal} />
              )}
            </div>

            <div className="mobile-toggle" onClick={() => setIsMenuOpen(true)}>
              <Menu size={28} color={colors.charcoal} />
            </div>
          </div>
        </div>

        {/* SEARCHBAR - FIXED RESPONSIVE UI */}
        <div className={`search-dropdown ${isSearchOpen ? "active" : ""}`}>
          <div className="search-inner-container">
            <Search
              size={18}
              color={colors.primaryLight}
              className="search-icon-inside"
              style={{ flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus={isSearchOpen}
            />
            {searchQuery && (
              <button
                className="search-close-btn"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* -- NEW: SEARCH RESULTS DROPDOWN -- */}
          {isSearching && (
            <div className="search-results-container">
              {searchResults.length > 0 ? (
                <ul className="search-results-list">
                  {searchResults.map((product) => {
                    const mainVar =
                      product.variants?.find((v) => v.isDefault) ||
                      product.variants?.[0] ||
                      {};
                    const price =
                      mainVar.discountPrice ||
                      mainVar.originalPrice ||
                      mainVar.price ||
                      0;

                    // --- IMAGE FIX APPLIED HERE ---
                    const imgPath = mainVar.images?.[0] || product.thumbnail;
                    const resolvedImgSrc = imgPath
                      ? imgPath.startsWith("http")
                        ? imgPath
                        : `https://shivaybackend.onrender.com${imgPath}`
                      : "https://via.placeholder.com/50";

                    return (
                      <li
                        key={product._id}
                        className="search-result-item"
                        onClick={() => handleResultClick(product._id)}
                      >
                        <img
                          src={resolvedImgSrc}
                          alt={product.title}
                          className="search-result-img"
                        />
                        <div className="search-result-info">
                          <span className="search-result-title">
                            {product.title}
                          </span>
                          <span className="search-result-price">₹{price}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="search-no-results">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`side-drawer mobile-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3 style={{ margin: 0, fontSize: "20px", color: colors.darkGreen }}>
            Menu
          </h3>
          <div className="close-btn" onClick={() => setIsMenuOpen(false)}>
            ✕
          </div>
        </div>
        <nav className="drawer-nav">
          {[
            { name: "Home", link: "/" },
            { name: "About Us", link: "/#about-section" },
            { name: "Products", link: "/products" },
            { name: "Benefits", link: "/benefits" },
            { name: "FAQ", link: "/faq" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="drawer-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <style jsx>{`
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 90px;
          background: #fff;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .header-container {
          width: 100%;
          height: 100%;
          padding: 0 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1002;
          background: #fff;
        }
        .logo-img {
          height: 70px;
        }
        .nav-links {
          display: flex;
          gap: 30px;
          list-style: none;
        }
        .nav-item {
          text-decoration: none;
          color: ${colors.charcoal};
          font-weight: 500;
          font-size: 16px;
          transition: 0.3s;
        }
        .nav-item:hover {
          color: ${colors.primaryLight};
        }
        .icon-group {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .icon-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: 0.3s;
        }
        .icon-btn:hover {
          background: #f5f5f5;
        }
        .mobile-toggle {
          cursor: pointer;
          display: none;
        }

        /* FIXED SEARCHBAR */
        .search-dropdown {
          position: absolute;
          top: 90px;
          left: 0;
          width: 100%;
          background: #fff;
          z-index: 1001;
          padding: 15px 5%;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.08);
          border-top: 1px solid #f0f0f0;
          visibility: hidden;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        .search-dropdown.active {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
        }
        .search-inner-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          background: #f9fafb;
          padding: 4px 16px;
          border-radius: 50px;
          border: 1.5px solid ${colors.borderGray};
          transition: 0.3s;
        }
        .search-inner-container:focus-within {
          border-color: ${colors.primaryLight};
          background: #fff;
        }
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          padding: 12px 8px;
          font-size: 16px;
          width: 100%;
          min-width: 0; /* Crucial for mobile flex behavior */
        }
        .search-close-btn {
          background: #eeeeee;
          border: none;
          width: 32px;
          height: 32px;
          min-width: 32px; /* Force it to remain a circle */
          flex-shrink: 0; /* Prevents squishing on mobile */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #666;
          margin-left: 8px;
          padding: 0;
        }

        /* --- NEW: SEARCH RESULTS CSS --- */
        .search-results-container {
          max-width: 800px;
          margin: 15px auto 0;
          background: #fff;
          border: 1px solid ${colors.borderGray};
          border-radius: 12px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
          max-height: 400px;
          overflow-y: auto;
        }
        .search-results-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-result-item:hover {
          background: #f9fafb;
        }
        .search-result-item:last-child {
          border-bottom: none;
        }
        .search-result-img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          background: #f0f0f0;
        }
        .search-result-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .search-result-title {
          font-size: 14px;
          font-weight: 600;
          color: ${colors.charcoal};
        }
        .search-result-price {
          font-size: 13px;
          font-weight: 800;
          color: ${colors.primaryLight};
        }
        .search-no-results {
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        /* DRAWER STYLES */
        .side-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 300px;
          height: 100vh;
          background: #fff;
          z-index: 2000;
          transition: 0.4s;
          padding: 30px;
        }
        .side-drawer.open {
          right: 0;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .drawer-link {
          font-size: 18px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
        }
        .drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1500;
        }

        @media (max-width: 999px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .main-header {
            height: 80px;
          }
          .search-dropdown {
            top: 80px;
          }
          .logo-img {
            height: 60px;
          }
          .search-inner-container {
            padding: 4px 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
