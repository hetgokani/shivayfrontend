import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import {
  FiFilter,
  FiCheck,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import ProductCard from "./ProductCard";

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);

  const [loading, setLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(6);
  const [expandedCats, setExpandedCats] = useState([]);

  const sidebarRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios
            .get("https://shivaybackend.onrender.com/api/category/all")
            .catch(() => ({ data: [] })),
          axios
            .get("https://shivaybackend.onrender.com/api/products/")
            .catch(() => ({ data: [] })),
        ]);

        setCategoriesList(catRes.data);
        const activeProducts = prodRes.data.filter(
          (p) => p.status !== "Inactive",
        );
        setProducts(activeProducts);

        let highestPrice = 0;
        const colorsSet = new Set();
        const sizesSet = new Set();
        const brandsSet = new Set();

        activeProducts.forEach((p) => {
          if (p.brand) {
            const brandName =
              typeof p.brand === "string"
                ? p.brand
                : p.brand.name || p.brand.title;
            if (brandName) brandsSet.add(brandName);
          }

          p.variants?.forEach((v) => {
            const basePrice = v.price || v.originalPrice || 0;
            const price = v.discountPrice > 0 ? v.discountPrice : basePrice;

            if (price > highestPrice) highestPrice = price;

            if (v.colorHex) colorsSet.add(v.colorHex);

            v.attributes?.forEach((attr) => {
              const name = attr.name?.toLowerCase();
              if (name === "color") colorsSet.add(attr.value);
              if (name === "size") sizesSet.add(attr.value);
            });
          });
        });

        highestPrice = Math.ceil(highestPrice);
        setMaxPriceLimit(highestPrice);
        setPriceRange({ min: 0, max: highestPrice });
        setAvailableColors([...colorsSet]);
        setAvailableSizes([...sizesSet]);
        setAvailableBrands([...brandsSet].filter(Boolean));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.offsetHeight
      ) {
        setVisibleLimit((prev) => prev + 6);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseFilteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCats.length > 0) {
        let pIdsAndTitles = [];
        if (product.category) {
          if (typeof product.category === "string")
            pIdsAndTitles.push(product.category);
          if (product.category._id)
            pIdsAndTitles.push(product.category._id.toString());
          if (product.category.title)
            pIdsAndTitles.push(product.category.title);
        }

        if (product.subcategory) {
          if (typeof product.subcategory === "string")
            pIdsAndTitles.push(product.subcategory);
          if (product.subcategory._id)
            pIdsAndTitles.push(product.subcategory._id.toString());
          if (product.subcategory.title)
            pIdsAndTitles.push(product.subcategory.title);
        }

        if (
          typeof product.category === "string" &&
          product.category.includes(",")
        ) {
          pIdsAndTitles.push(
            ...product.category.split(",").map((c) => c.trim()),
          );
        }

        const pIdsLower = pIdsAndTitles.map((id) => id?.toLowerCase() || "");
        const matchesCategory = selectedCats.some((sel) =>
          pIdsLower.includes(sel.toLowerCase()),
        );

        if (!matchesCategory) return false;
      }

      if (selectedBrands.length > 0) {
        const pBrand =
          typeof product.brand === "string"
            ? product.brand
            : product.brand?.name || product.brand?.title || "";
        if (!selectedBrands.includes(pBrand)) return false;
      }

      if (selectedColors.length > 0) {
        const pColors = product.variants
          ?.flatMap((v) => [
            v.colorHex,
            ...(v.attributes
              ?.filter((a) => a.name?.toLowerCase() === "color")
              .map((a) => a.value) || []),
          ])
          .filter(Boolean);

        if (!selectedColors.some((sel) => pColors?.includes(sel))) return false;
      }

      if (selectedSizes.length > 0) {
        const pSizes = product.variants
          ?.flatMap((v) =>
            v.attributes
              ?.filter((a) => a.name?.toLowerCase() === "size")
              .map((a) => a.value),
          )
          .filter(Boolean);

        if (!selectedSizes.some((sel) => pSizes?.includes(sel))) return false;
      }

      return true;
    });
  }, [products, selectedCats, selectedBrands, selectedColors, selectedSizes]);

  useEffect(() => {
    if (products.length === 0) return;

    let dynamicMax = 0;
    baseFilteredProducts.forEach((product) => {
      const defaultVar =
        product.variants?.find((v) => v.isDefault) || product.variants?.[0];
      if (defaultVar) {
        const basePrice = defaultVar.price || defaultVar.originalPrice || 0;
        const price =
          defaultVar.discountPrice > 0 ? defaultVar.discountPrice : basePrice;
        if (price > dynamicMax) dynamicMax = price;
      }
    });

    dynamicMax = Math.ceil(dynamicMax) || 0;

    setMaxPriceLimit(dynamicMax);
    setPriceRange((prev) => ({ ...prev, max: dynamicMax }));
  }, [baseFilteredProducts, products]);

  const filteredProducts = useMemo(() => {
    return baseFilteredProducts.filter((product) => {
      const defaultVar =
        product.variants?.find((v) => v.isDefault) || product.variants?.[0];
      if (defaultVar) {
        const basePrice = defaultVar.price || defaultVar.originalPrice || 0;
        const price =
          defaultVar.discountPrice > 0 ? defaultVar.discountPrice : basePrice;

        const minVal = priceRange.min === "" ? 0 : Number(priceRange.min);
        const maxVal =
          priceRange.max === "" ? Infinity : Number(priceRange.max);

        if (price < minVal || price > maxVal) return false;
      }
      return true;
    });
  }, [baseFilteredProducts, priceRange]);

  const toggleFilter = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
    setVisibleLimit(6);
  };

  const toggleExpand = (e, catId) => {
    e.stopPropagation();
    setExpandedCats((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const getCssColor = (colorName) => {
    const lower = colorName.toLowerCase();
    if (lower === "navy blue") return "#000080";
    if (lower === "light pink") return "#FFB6C1";
    return lower.replace(/\s/g, "");
  };

  return (
    <div className="shop-section position-relative pb-5">
      <div
        className={`sidebar-overlay ${showMobileSidebar ? "open" : ""}`}
        onClick={() => setShowMobileSidebar(false)}
      ></div>

      <div className="container mt-4">
        <div className="row g-4">
          <div
            ref={sidebarRef}
            className={`col-lg-3 filter-wrapper ${
              showMobileSidebar ? "open" : ""
            }`}
          >
            <div className="sidebar-sticky">
              <div className="filter-card shadow-sm border-0">
                <div className="filter-main-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <FiFilter size={18} color="#10b981" />
                    <h5
                      className="m-0 fw-bold text-uppercase"
                      style={{ color: "#0f172a" }}
                    >
                      Browse Filters
                    </h5>
                  </div>
                  <button
                    className="close-filter-btn d-lg-none"
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <FiX size={24} color="#0f172a" />
                  </button>
                </div>

                <div className="accordion" id="shopFilters">
                  {/* CATEGORIES */}
                  <div className="filter-section">
                    <div
                      className="section-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#cats"
                    >
                      <span>Categories</span>
                      <div className="d-flex align-items-center gap-2">
                        {selectedCats.length > 0 && (
                          <span className="active-badge">
                            {selectedCats.length} active
                          </span>
                        )}
                        <FiPlus />
                      </div>
                    </div>
                    <div id="cats" className="collapse show">
                      <div className="section-body">
                        {categoriesList.map((cat) => (
                          <div key={cat._id} className="mb-2">
                            <div
                              className="filter-row d-flex align-items-center justify-content-between"
                              onClick={() =>
                                toggleFilter(
                                  selectedCats,
                                  setSelectedCats,
                                  cat._id,
                                )
                              }
                            >
                              <div className="d-flex align-items-center gap-2">
                                {cat.subcategories &&
                                cat.subcategories.length > 0 ? (
                                  <span
                                    onClick={(e) => toggleExpand(e, cat._id)}
                                    style={{
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "20px",
                                      height: "20px",
                                      background: expandedCats.includes(cat._id)
                                        ? "#10b981"
                                        : "#f1f5f9",
                                      color: expandedCats.includes(cat._id)
                                        ? "#fff"
                                        : "#64748b",
                                      borderRadius: "6px",
                                      transition: "0.2s",
                                    }}
                                  >
                                    {expandedCats.includes(cat._id) ? (
                                      <FiChevronDown size={14} />
                                    ) : (
                                      <FiChevronRight size={14} />
                                    )}
                                  </span>
                                ) : (
                                  <span style={{ width: "20px" }}></span>
                                )}
                                <span
                                  className={
                                    selectedCats.includes(cat._id)
                                      ? "text-success fw-bold text-uppercase"
                                      : "text-uppercase text-dark fw-semibold"
                                  }
                                  style={{ fontSize: "13px" }}
                                >
                                  {cat.title}
                                </span>
                              </div>
                              <div
                                className={`custom-check ${
                                  selectedCats.includes(cat._id)
                                    ? "checked"
                                    : ""
                                }`}
                              >
                                {selectedCats.includes(cat._id) && (
                                  <FiCheck size={12} strokeWidth={4} />
                                )}
                              </div>
                            </div>

                            {cat.subcategories &&
                              cat.subcategories.length > 0 &&
                              expandedCats.includes(cat._id) && (
                                <div className="mt-1 ms-4 ps-2 border-start border-success border-opacity-25">
                                  {cat.subcategories.map((sub) => (
                                    <div
                                      key={sub._id}
                                      className="filter-row py-1 d-flex align-items-center justify-content-between"
                                      onClick={() =>
                                        toggleFilter(
                                          selectedCats,
                                          setSelectedCats,
                                          sub._id,
                                        )
                                      }
                                    >
                                      <span
                                        className={
                                          selectedCats.includes(sub._id)
                                            ? "text-success fw-bold"
                                            : "text-muted fw-semibold"
                                        }
                                        style={{ fontSize: "12.5px" }}
                                      >
                                        {sub.title}
                                      </span>
                                      <div
                                        className={`custom-check ${
                                          selectedCats.includes(sub._id)
                                            ? "checked"
                                            : ""
                                        }`}
                                        style={{
                                          width: "14px",
                                          height: "14px",
                                        }}
                                      >
                                        {selectedCats.includes(sub._id) && (
                                          <FiCheck size={10} strokeWidth={4} />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BRANDS FILTER */}
                  <div className="filter-section">
                    <div
                      className="section-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#brands"
                    >
                      <span>Brands</span>
                      <div className="d-flex align-items-center gap-2">
                        {selectedBrands.length > 0 && (
                          <span className="active-badge">
                            {selectedBrands.length} active
                          </span>
                        )}
                        <FiPlus />
                      </div>
                    </div>
                    <div id="brands" className="collapse">
                      <div className="section-body pb-3">
                        {availableBrands.map((brand, idx) => (
                          <div
                            key={idx}
                            className="filter-row d-flex align-items-center justify-content-between"
                            onClick={() =>
                              toggleFilter(
                                selectedBrands,
                                setSelectedBrands,
                                brand,
                              )
                            }
                          >
                            <span
                              className={
                                selectedBrands.includes(brand)
                                  ? "text-success fw-bold text-capitalize"
                                  : "text-muted text-capitalize"
                              }
                              style={{ fontSize: "13px" }}
                            >
                              {brand}
                            </span>
                            <div
                              className={`custom-check ${
                                selectedBrands.includes(brand) ? "checked" : ""
                              }`}
                            >
                              {selectedBrands.includes(brand) && (
                                <FiCheck size={12} strokeWidth={4} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* COLORS */}
                  <div className="filter-section">
                    <div
                      className="section-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#colors"
                    >
                      <span>Colors</span>
                      <div className="d-flex align-items-center gap-2">
                        {selectedColors.length > 0 && (
                          <span className="active-badge">
                            {selectedColors.length} active
                          </span>
                        )}
                        <FiPlus />
                      </div>
                    </div>
                    <div id="colors" className="collapse">
                      <div className="section-body d-flex flex-wrap gap-2 pb-3">
                        {availableColors.map((color, idx) => {
                          const cssColor = getCssColor(color);
                          const isWhite =
                            cssColor === "white" || cssColor === "#ffffff";

                          return (
                            <div
                              key={idx}
                              className={`color-box ${
                                selectedColors.includes(color) ? "active" : ""
                              }`}
                              style={{
                                backgroundColor: cssColor,
                                border: isWhite
                                  ? "1px solid #cbd5e1"
                                  : "1px solid transparent",
                              }}
                              onClick={() =>
                                toggleFilter(
                                  selectedColors,
                                  setSelectedColors,
                                  color,
                                )
                              }
                            >
                              {selectedColors.includes(color) && (
                                <FiCheck
                                  color={isWhite ? "#000" : "#fff"}
                                  size={16}
                                  strokeWidth={3}
                                  style={{
                                    filter: isWhite
                                      ? "none"
                                      : "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SIZES */}
                  <div className="filter-section">
                    <div
                      className="section-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#sizes"
                    >
                      <span>Sizes</span>
                      <div className="d-flex align-items-center gap-2">
                        {selectedSizes.length > 0 && (
                          <span className="active-badge">
                            {selectedSizes.length} active
                          </span>
                        )}
                        <FiPlus />
                      </div>
                    </div>
                    <div id="sizes" className="collapse">
                      <div className="section-body d-flex flex-wrap gap-2 pb-3">
                        {availableSizes.map((size, idx) => (
                          <div
                            key={idx}
                            className={`size-pill ${
                              selectedSizes.includes(size) ? "active" : ""
                            }`}
                            onClick={() =>
                              toggleFilter(
                                selectedSizes,
                                setSelectedSizes,
                                size,
                              )
                            }
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PRICE RANGE */}
                  <div className="filter-section">
                    <div
                      className="section-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#price"
                    >
                      <span>Price Range</span>
                      <div className="d-flex align-items-center gap-2">
                        <FiPlus />
                      </div>
                    </div>
                    <div id="price" className="collapse">
                      <div className="section-body pb-3">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            className="price-input"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                min: e.target.value,
                              })
                            }
                          />
                          <span className="text-muted fw-bold small">To</span>
                          <input
                            type="number"
                            className="price-input"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                max: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="clear-all-btn"
                  onClick={() => {
                    setSelectedCats([]);
                    setSelectedBrands([]);
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    setPriceRange({ min: 0, max: maxPriceLimit });
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-flex align-items-end mb-4 border-bottom pb-3">
              <h2
                className="fw-bold m-0"
                style={{ color: "#0f172a", fontSize: "28px" }}
              >
                All Products
              </h2>
              <span
                className="ms-2 fw-bold"
                style={{
                  color: "#10b981",
                  fontSize: "16px",
                  paddingBottom: "2px",
                }}
              >
                ({filteredProducts.length} results)
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success mb-3"></div>
                <h6 className="text-muted fw-bold">
                  Loading your green theme...
                </h6>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="fw-bold text-muted">No products found</h4>
              </div>
            ) : (
              <>
                <div className="row g-4 mb-4">
                  {filteredProducts.slice(0, visibleLimit).map((p) => (
                    <div key={p._id} className="col-lg-4 col-md-6 col-6">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {visibleLimit < filteredProducts.length && (
                  <div className="text-center py-4 text-success fw-bold">
                    Scroll to see more...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <button
        className="mobile-filter-btn d-lg-none d-flex"
        onClick={() => setShowMobileSidebar(true)}
      >
        <FiFilter size={18} /> Filters
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .sidebar-sticky { position: sticky; top: 100px; }
        .filter-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; }
        .filter-main-header { padding: 18px 20px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; border-radius: 12px 12px 0 0; }
        .filter-section { border-bottom: 1px solid #f1f5f9; }
        .section-header { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 15px; font-weight: 700; color: #334155; }
        .section-body { padding: 0 20px 15px 20px; }
        .filter-row { display: flex; align-items: center; padding: 8px 0; cursor: pointer; transition: 0.2s; }
        .filter-row:hover { color: #10b981; }
        .active-badge { background: #10b981; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 700; }
        .custom-check { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; background: #f8fafc; transition: 0.2s; }
        .custom-check.checked { background: #10b981; border-color: #10b981; }
        .price-input { width: 100%; border: 2px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none; font-weight: 600; color: #334155; transition: 0.2s; }
        .price-input:focus { border-color: #10b981; background: #ecfdf5; }
        .clear-all-btn { width: calc(100% - 40px); margin: 20px; padding: 10px; border: 2px solid #10b981; background: #ecfdf5; color: #059669; border-radius: 8px; font-size: 14px; font-weight: 800; transition: 0.3s; text-transform: uppercase; cursor: pointer; }
        .clear-all-btn:hover { background: #10b981; color: #fff; }
        .text-success { color: #10b981 !important; }
        .color-box { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .color-box.active { transform: scale(1.1); box-shadow: 0 0 0 2px #fff, 0 0 0 3px #10b981 !important; border-color: transparent !important; }
        .size-pill { padding: 6px 14px; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 700; color: #64748b; transition: 0.2s; }
        .size-pill.active { background: #10b981; color: #fff; border-color: #10b981; }
        
        @media (max-width: 1000px) {
          .filter-wrapper {
            position: fixed;
            top: 0;
            left: -350px;
            width: 300px;
            max-width: 85vw;
            height: 100vh;
            background: #fff;
            z-index: 9999;
            transition: left 0.3s ease-in-out;
            overflow-y: auto;
            padding: 0 !important;
            margin: 0 !important;
          }
          .filter-wrapper.open { left: 0; }
          .sidebar-overlay { display: none; }
          .sidebar-overlay.open {
            display: block; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9998; backdrop-filter: blur(2px);
          }
          .filter-card { border: none; border-radius: 0; }
          .sidebar-sticky { position: static; }
          .close-filter-btn { display: block; background: none; border: none; padding: 0; }
          
          .mobile-filter-btn {
            align-items: center; justify-content: center; gap: 8px; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #10b981; color: #fff; border: none; padding: 12px 28px; border-radius: 50px; font-size: 16px; font-weight: 800; z-index: 9990; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); cursor: pointer; transition: 0.2s ease; letter-spacing: 1px;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default ShopSection;
