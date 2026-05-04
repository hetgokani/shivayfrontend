import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Trash2, ChevronRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const THEME = {
  forest: "#0F2E11",
  organicGreen: "#4A7729",
  white: "#FFFFFF",
  border: "#eef2ee",
};

const SidebarFilters = ({
  categoriesList,
  selectedCategories,
  selectedSubcategories,
  toggleCategory,
  toggleSubcategory,
  openAccordion,
  setOpenAccordion,
  price,
  setPrice,
  clearFilters,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
    <div
      className="filter-main-header"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: `2px solid ${THEME.organicGreen}20`,
        paddingBottom: "15px",
      }}
    >
      <Filter size={20} color={THEME.forest} strokeWidth={3} />
      <span
        style={{
          fontWeight: "900",
          fontSize: "16px",
          color: THEME.forest,
          letterSpacing: "1.5px",
        }}
      >
        BROWSE FILTERS
      </span>
    </div>

    <div>
      <h4
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: "#888",
          marginBottom: "15px",
        }}
      >
        CATEGORIES
      </h4>
      {categoriesList.map((cat, i) => {
        const isCatActive = selectedCategories.includes(cat._id);
        const hasSubs = cat.subcategories && cat.subcategories.length > 0;
        return (
          <div
            key={cat._id}
            style={{
              marginBottom: "5px",
              borderBottom: `1px solid ${THEME.border}`,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <input
                type="checkbox"
                checked={isCatActive}
                onChange={() => toggleCategory(cat._id)}
                style={{
                  accentColor: THEME.organicGreen,
                  width: "18px",
                  height: "18px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              />
              <button
                onClick={() =>
                  hasSubs && setOpenAccordion(openAccordion === i ? null : i)
                }
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "12px 0",
                  cursor: hasSubs ? "pointer" : "default",
                  fontWeight: "700",
                  color: isCatActive ? THEME.organicGreen : THEME.forest,
                  fontSize: "14px",
                }}
              >
                {cat.title}
                {hasSubs &&
                  (openAccordion === i ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  ))}
              </button>
            </div>
            <AnimatePresence>
              {hasSubs && openAccordion === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden", paddingLeft: "28px" }}
                >
                  {cat.subcategories.map((sub) => (
                    <label
                      key={sub._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        fontSize: "13px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        color: selectedSubcategories.includes(sub.title)
                          ? THEME.organicGreen
                          : "#555",
                        background: selectedSubcategories.includes(sub.title)
                          ? `${THEME.organicGreen}10`
                          : "transparent",
                        fontWeight: selectedSubcategories.includes(sub.title)
                          ? "700"
                          : "400",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub.title)}
                        onChange={() => toggleSubcategory(sub.title, cat._id)}
                        style={{
                          accentColor: THEME.organicGreen,
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      {sub.title}
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>

    <div>
      <h4
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: "#888",
          marginBottom: "15px",
        }}
      >
        PRICE RANGE
      </h4>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <span
          style={{ fontSize: "13px", fontWeight: "700", color: THEME.forest }}
        >
          ₹
        </span>
        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : parseInt(e.target.value))
          }
          style={{
            width: "100%",
            padding: "5px 10px",
            borderRadius: "6px",
            border: `1px solid ${THEME.border}`,
            fontSize: "14px",
            fontWeight: "700",
            color: THEME.forest,
          }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="10000"
        step="50"
        value={price || 0}
        onChange={(e) => setPrice(parseInt(e.target.value))}
        style={{
          width: "100%",
          accentColor: THEME.organicGreen,
          cursor: "pointer",
        }}
      />
    </div>

    <button
      onClick={clearFilters}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: `1px solid ${THEME.border}`,
        background: THEME.white,
        color: "#e74c3c",
        fontWeight: "800",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
      }}
    >
      <Trash2 size={16} /> CLEAR ALL
    </button>
  </div>
);

const ShivayAllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [price, setPrice] = useState(10000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://shivaybackend.onrender.com/api/category/all"),
          axios.get("https://shivaybackend.onrender.com/api/products"),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data.filter((p) => p.status === "Active"));
        setLoading(false);
      } catch (err) {
        toast.error("Failed to connect to backend");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const mainVar =
        p.variants?.find((v) => v.isDefault) || p.variants?.[0] || {};
      const actualPrice =
        mainVar.discountPrice ||
        mainVar.originalPrice ||
        mainVar.price ||
        p.price ||
        0;

      const matchesPrice = actualPrice <= price;
      if (!matchesPrice) return false;

      if (selectedCategories.length === 0 && selectedSubcategories.length === 0)
        return true;

      const pCatId = p.category?._id || p.category;
      const matchesCat = selectedCategories.includes(pCatId);
      const matchesSub = selectedSubcategories.includes(p.subcategory);

      return matchesCat || matchesSub;
    });
  }, [products, selectedCategories, selectedSubcategories, price]);

  const toggleCategory = (id) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const toggleSubcategory = (subTitle, parentId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subTitle)
        ? prev.filter((s) => s !== subTitle)
        : [...prev, subTitle],
    );
    if (!selectedCategories.includes(parentId))
      setSelectedCategories((prev) => [...prev, parentId]);
  };

  if (loading)
    return (
      <div
        style={{ padding: "100px", textAlign: "center", color: THEME.forest }}
      >
        Loading Products...
      </div>
    );

  return (
    <section
      style={{
        backgroundColor: THEME.white,
        padding: "60px 5% 80px",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <ToastContainer />

      <style>
        {`
          .mobile-filter-btn {
            display: none;
          }
          .filter-overlay {
            display: none;
          }
          .close-sidebar-btn {
            display: none;
          }
          
          /* Ensures the beautiful serif font loads */
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          
          .premium-heading {
            font-family: 'Playfair Display', serif, sans-serif !important;
          }

          @media (max-width: 768px) {
            .mobile-filter-btn {
              display: flex !important;
              position: fixed;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              background: ${THEME.organicGreen};
              color: white;
              border: none;
              padding: 14px 16px 14px 12px;
              border-radius: 0 10px 10px 0;
              z-index: 998;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              box-shadow: 4px 4px 15px rgba(0,0,0,0.2);
              font-weight: 800;
              font-size: 14px;
              transition: 0.3s;
            }
            .mobile-filter-btn:active {
              background: ${THEME.forest};
            }
            
            /* FIXED MOBILE SIDEBAR: FULL HEIGHT, NO GAPS */
            .desktop-sidebar {
              position: fixed !important;
              top: 0 !important;
              bottom: 0 !important;
              left: -100% !important;
              height: 100vh !important;
              width: 85% !important;
              max-width: 360px !important;
              z-index: 1000 !important;
              transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              border-radius: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            .desktop-sidebar.open {
              left: 0 !important;
              box-shadow: 4px 0 25px rgba(0,0,0,0.3) !important;
            }
            
            /* REMOVED ROUNDED CORNERS AND MARGINS FOR FULL HEIGHT */
            .sidebar-inner-content {
              height: 100vh !important;
              max-height: 100vh !important;
              border-radius: 0 !important;
              border: none !important;
              padding: 60px 20px 20px 20px !important; /* Top padding clears the close button */
              margin: 0 !important;
              top: 0 !important;
              position: relative !important;
              overflow-y: auto !important;
            }
            
            /* BEAUTIFUL CLOSE BUTTON */
            .close-sidebar-btn {
              display: flex !important;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 15px;
              right: 15px;
              background: #f1f5f9;
              border: none;
              border-radius: 50%;
              width: 36px;
              height: 36px;
              cursor: pointer;
              color: ${THEME.forest};
              z-index: 1001;
              transition: 0.2s;
            }
            .close-sidebar-btn:active {
              background: #e2e8f0;
            }
            
            .filter-overlay.open {
              display: block !important;
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.6);
              z-index: 999;
              backdrop-filter: blur(3px);
            }
            .product-grid {
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
              gap: 15px !important;
            }
            .product-card {
              padding: 10px !important;
              border-radius: 12px !important;
            }
            .product-image-container {
              height: 160px !important;
              border-radius: 10px !important;
              margin-bottom: 8px !important;
            }
            .product-title {
              font-size: 13px !important;
              margin: 4px 0 !important;
            }
            .product-price {
              font-size: 15px !important;
            }
            .buy-now-btn {
              padding: 10px !important;
              font-size: 12px !important;
              border-radius: 8px !important;
            }
          }
        `}
      </style>

      {/* MOBILE OVERLAY */}
      <div
        className={`filter-overlay ${isMobileFilterOpen ? "open" : ""}`}
        onClick={() => setIsMobileFilterOpen(false)}
      />

      {/* MOBILE CENTER-LEFT FLOATING BUTTON */}
      <button
        className="mobile-filter-btn"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <Filter size={18} />
      </button>

      {/* FIXED PREMIUM HEADING SECTION */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto 50px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: THEME.organicGreen,
            fontWeight: "800",
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "2px",
              background: THEME.organicGreen,
            }}
          ></span>
          SHIVAY HERBALS
          <span
            style={{
              width: "30px",
              height: "2px",
              background: THEME.organicGreen,
            }}
          ></span>
        </span>
        <h2
          className="premium-heading"
          style={{
            fontSize: "clamp(28px, 6vw, 46px)",
            fontWeight: "900",
            color: THEME.forest,
            marginTop: "15px",
            marginBottom: "15px",
            lineHeight: "1.2",
          }}
        >
          Nature's Finest Selection
        </h2>
        <div
          style={{
            width: "60px",
            height: "4px",
            background: THEME.organicGreen,
            borderRadius: "4px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "30px",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* SIDEBAR (BECOMES FULL HEIGHT POPUP ON MOBILE) */}
        <aside
          className={`desktop-sidebar ${isMobileFilterOpen ? "open" : ""}`}
          style={{ width: "280px", flexShrink: 0 }}
        >
          <div
            className="sidebar-inner-content"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              border: `1px solid ${THEME.border}`,
              position: "sticky",
              top: "20px",
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
            }}
          >
            {/* MOBILE CLOSE BUTTON */}
            <button
              className="close-sidebar-btn"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <X size={22} />
            </button>

            <SidebarFilters
              categoriesList={categories}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              toggleCategory={toggleCategory}
              toggleSubcategory={toggleSubcategory}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              price={price}
              setPrice={setPrice}
              clearFilters={() => {
                setSelectedCategories([]);
                setSelectedSubcategories([]);
                setPrice(10000);
              }}
            />
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div style={{ flex: 1 }}>
          <div
            className="product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "30px",
            }}
          >
            {filteredProducts.map((p) => {
              const mainVar =
                p.variants?.find((v) => v.isDefault) || p.variants?.[0] || {};
              const pOriginal =
                mainVar.originalPrice || mainVar.price || p.price || 0;
              const pDiscount = mainVar.discountPrice || 0;
              const hasDiscount = pDiscount > 0 && pDiscount < pOriginal;

              return (
                <motion.div
                  key={p._id}
                  className="product-card"
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/product/${p._id}`)}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    border: `1px solid ${THEME.border}`,
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex", // ADDED
                    flexDirection: "column", // ADDED
                    height: "100%", // ADDED: Ensures the card fills the grid track
                  }}
                >
                  <div
                    className="product-image-container"
                    style={{
                      width: "100%",
                      height: "240px",
                      borderRadius: "15px",
                      overflow: "hidden",
                      marginBottom: "12px",
                    }}
                  >
                    <img
                      src={`http://localhost:5000${mainVar.images?.[0] || p.thumbnail}`}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  {/* ADDED: Flex properties here to push the button down */}
                  <div
                    style={{
                      padding: "0 5px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "900",
                        color: THEME.organicGreen,
                        background: `${THEME.organicGreen}15`,
                        padding: "4px 10px",
                        borderRadius: "50px",
                        alignSelf: "flex-start", // Keeps the badge from stretching
                      }}
                    >
                      {p.category?.title}
                    </span>
                    <h3
                      className="product-title"
                      style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: THEME.forest,
                        margin: "8px 0",
                      }}
                    >
                      {p.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                        marginTop: "auto", // ADDED: Pushes price and button to the bottom
                      }}
                    >
                      <span
                        className="product-price"
                        style={{
                          fontSize: "18px",
                          fontWeight: "900",
                          color: THEME.forest,
                        }}
                      >
                        ₹{hasDiscount ? pDiscount : pOriginal}
                      </span>
                      {hasDiscount && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{pOriginal}
                        </span>
                      )}
                    </div>
                    <button
                      className="buy-now-btn"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: THEME.forest,
                        color: "white",
                        border: "none",
                        fontWeight: "800",
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShivayAllProducts;
