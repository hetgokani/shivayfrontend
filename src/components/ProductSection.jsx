import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock } from "react-icons/fi";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext, useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

const ProductSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: contextProducts } = useAuth();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentImage, setCurrentImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [globalAttributes, setGlobalAttributes] = useState([]);

  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    averageRating: 0,
    count: 0,
    ratingStats: {},
  });

  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [pincodeMsg, setPincodeMsg] = useState("");

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/600";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ffc107" />);
      }
    }
    return stars;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        // 10,000% SAFE FETCHING TO PREVENT CRASHES
        const [res, attrRes] = await Promise.all([
          axios
            .get(`https://shivaybackend.onrender.com/api/products/${id}`)
            .catch(() => ({ data: { product: null, variants: [] } })),
          axios
            .get(`https://shivaybackend.onrender.com/api/attributes`)
            .catch(() => ({ data: [] })),
        ]);

        if (!res.data.product) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setGlobalAttributes(attrRes.data);
        const { product: prodData, variants: varData } = res.data;
        const fullProduct = { ...prodData, variants: varData };
        setProduct(fullProduct);

        if (varData && varData.length > 0) {
          const defVar = varData.find((v) => v.isDefault) || varData[0];
          setSelectedVariant(defVar);
          const initialAttrs = {};
          (defVar.attributes || []).forEach((attr) => {
            initialAttrs[attr.name] = attr.value;
          });
          setSelectedAttributes(initialAttrs);
          const variantImages = defVar.images?.filter((img) => img) || [];
          setCurrentImage(
            variantImages.length > 0 ? variantImages[0] : prodData.thumbnail,
          );
        } else {
          setCurrentImage(prodData.thumbnail);
        }

        const currentCatId = prodData.category?._id || prodData.category;
        const currentCatTitle = prodData.category?.title;

        const related = contextProducts.filter((p) => {
          if (p._id === prodData._id || p.status === "Inactive") return false;
          const pCatId = p.category?._id || p.category;
          const pCatTitle = p.category?.title;
          let categoryMatch = false;
          if (currentCatId && pCatId) {
            categoryMatch = currentCatId.toString() === pCatId.toString();
          } else if (currentCatTitle && pCatTitle) {
            categoryMatch = currentCatTitle === pCatTitle;
          }
          return categoryMatch;
        });

        setRelatedProducts(related);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching specific product:", error);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, contextProducts]);

  useEffect(() => {
    if (selectedVariant?._id) {
      const fetchReviews = async () => {
        try {
          const res = await axios
            .get(
              `https://shivaybackend.onrender.com/api/reviews/${selectedVariant._id}`,
            )
            .catch(() => ({
              data: { reviews: [], averageRating: 0, count: 0 },
            })); // Safe fetch
          setReviewsData(res.data);
        } catch (err) {
          console.error("Error fetching reviews", err);
        }
      };
      fetchReviews();
    }
  }, [selectedVariant?._id]);

  const availableOptions = useMemo(() => {
    const options = {};
    if (!product?.variants) return options;
    product.variants.forEach((v) => {
      (v.attributes || []).forEach((attr) => {
        if (!options[attr.name]) options[attr.name] = new Set();
        options[attr.name].add(attr.value);
      });
    });
    Object.keys(options).forEach((k) => {
      options[k] = Array.from(options[k]);
      if (k.toLowerCase() === "size") {
        options[k].sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return String(a).localeCompare(String(b));
        });
      }
    });
    return options;
  }, [product]);

  const getHexForColor = (colorName) => {
    if (!product?.variants) return colorName;
    const variant = product.variants.find((v) =>
      v.attributes?.some(
        (a) => a.name.toLowerCase() === "color" && a.value === colorName,
      ),
    );
    if (variant?.colorHex) return variant.colorHex;
    const lower = String(colorName).toLowerCase();
    if (lower === "navy blue") return "#000080";
    if (lower === "light pink") return "#FFB6C1";
    return lower.replace(/\s/g, "");
  };

  const handleAttributeSelect = (attrName, attrValue) => {
    const newAttrs = { ...selectedAttributes, [attrName]: attrValue };
    setSelectedAttributes(newAttrs);
    setQuantity(1);
    const matchingVariant = product.variants.find((v) => {
      return Object.entries(newAttrs).every(([key, val]) =>
        v.attributes.some((a) => a.name === key && a.value === val),
      );
    });
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      const variantImages = matchingVariant.images?.filter((img) => img) || [];
      if (variantImages.length > 0) setCurrentImage(variantImages[0]);
      else if (product.thumbnail) setCurrentImage(product.thumbnail);
    }
  };

  const availableStock = selectedVariant?.stock || 0;
  const handleQuantity = (type) => {
    if (type === "inc") {
      if (quantity < availableStock) {
        setQuantity((prev) => prev + 1);
      } else {
        toast.warning("Max limit reached", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    }
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart!");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "https://shivaybackend.onrender.com/api/cart/add",
        {
          productId: product._id,
          variantId: selectedVariant?._id || null,
          quantity: quantity,
        },
        { withCredentials: true },
      );
      toast.success("Added to cart successfully!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login to purchase items!");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "https://shivaybackend.onrender.com/api/cart/add",
        {
          productId: product._id,
          variantId: selectedVariant?._id || null,
          quantity: quantity,
        },
        { withCredentials: true },
      );
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process Buy Now");
    }
  };

  const handlePincodeCheck = async () => {
    if (!pincode || pincode.length < 6)
      return toast.warn("Enter a valid 6-digit pincode");
    setPincodeStatus("checking");
    try {
      const res = await axios
        .get("https://shivaybackend.onrender.com/api/shipping/all")
        .catch(() => ({ data: { methods: [] } }));
      const matched = res.data.methods?.find(
        (item) => item.pincode === pincode,
      );
      if (matched && matched.isAvailable) {
        setPincodeStatus("available");
        setPincodeMsg(
          `Available! Expected delivery in ${
            matched.deliveryDuration || "3-5 Days"
          }`,
        );
      } else {
        setPincodeStatus("unavailable");
        setPincodeMsg("Not available for this location.");
      }
    } catch (err) {
      setPincodeStatus("unavailable");
      setPincodeMsg("Failed to verify pincode.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-5 mt-5">
        <div className="spinner-border text-success"></div>
      </div>
    );
  if (!product)
    return (
      <div className="text-center mt-5 py-5">
        <h3>Product Not Found</h3>
      </div>
    );

  const categoryTitle = product.category?.title || "";
  const subCategoryTitle = product.subcategory?.title || "";
  const fullCategory = subCategoryTitle
    ? `${categoryTitle} > ${subCategoryTitle}`
    : categoryTitle;

  const originalPrice =
    Number(
      selectedVariant?.originalPrice ||
        selectedVariant?.price ||
        product?.price,
    ) || 0;
  const discountPrice = Number(selectedVariant?.discountPrice) || 0;
  const isSale = discountPrice > 0 && discountPrice < originalPrice;
  const price = isSale ? discountPrice : originalPrice;

  const variantImages = selectedVariant?.images?.filter((img) => img) || [];
  const displayableImages =
    variantImages.length > 0
      ? variantImages
      : [product.thumbnail, ...(product.gallery || [])].filter(Boolean);
  const uniqueImages = displayableImages
    .filter((img, index, self) => img && self.indexOf(img) === index)
    .slice(0, 6);

  return (
    <div
      className="product-page-wrapper"
      style={{ backgroundColor: "#fff", fontFamily: "'Inter', sans-serif" }}
    >
      <main className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-5 col-md-12">
            <div
              className="d-flex flex-column-reverse flex-lg-row gap-3 position-sticky"
              style={{ top: "20px" }}
            >
              <div
                className="d-flex flex-lg-column gap-2 overflow-auto"
                style={{ minWidth: "60px", scrollbarWidth: "none" }}
              >
                {uniqueImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    style={{
                      cursor: "pointer",
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      flexShrink: 0,
                      border:
                        currentImage === img
                          ? "2px solid #10b981"
                          : "1px solid #cbd5e1",
                    }}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt="thumb"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="flex-grow-1 text-center bg-white"
                style={{ borderRadius: "12px", border: "1px solid #f1f5f9" }}
              >
                <img
                  src={getImageUrl(currentImage)}
                  alt={product.title}
                  className="img-fluid"
                  style={{
                    objectFit: "contain",
                    maxHeight: "500px",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="product-details-content">
              <h1
                className="fw-bold mt-1 mb-1 text-capitalize"
                style={{
                  fontSize: "26px",
                  color: "#0f172a",
                  lineHeight: "1.3",
                }}
              >
                {product.title}
              </h1>

              <div
                className="d-flex align-items-center gap-2 mb-2"
                style={{
                  visibility: reviewsData.count > 0 ? "visible" : "hidden",
                  minHeight: "24px",
                }}
              >
                <div className="d-flex">
                  {renderStars(reviewsData.averageRating)}
                </div>
                <span
                  style={{
                    color: "#10b981",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab("reviews")}
                >
                  {reviewsData.averageRating} rating ({reviewsData.count}{" "}
                  reviews)
                </span>
              </div>

              <hr className="my-3" style={{ opacity: "0.1" }} />

              <div className="price-block mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-baseline gap-2">
                  {isSale && (
                    <span className="text-muted text-decoration-line-through fs-5">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span
                    className="fw-bold"
                    style={{
                      fontSize: "32px",
                      color: "#0f172a",
                      lineHeight: "1",
                    }}
                  >
                    ₹{price.toLocaleString()}
                  </span>
                </div>
                {isSale && (
                  <span
                    className="fw-bold"
                    style={{
                      backgroundColor: "#ecfdf5",
                      color: "#059669",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {Math.round(
                      ((originalPrice - discountPrice) / originalPrice) * 100,
                    )}{" "}
                    % OFF
                  </span>
                )}
              </div>

              <hr className="my-3" style={{ opacity: "0.1" }} />

              {Object.keys(availableOptions).map((attrName, idx) => {
                const isColor = attrName.toLowerCase() === "color";
                const globalAttr = globalAttributes.find(
                  (a) => a.name.toLowerCase() === attrName.toLowerCase(),
                );
                let isDropdown = globalAttr?.displayAsDropdown || false;

                return (
                  <div key={idx} className="mb-4">
                    <label
                      className="d-block small mb-2 fw-bold text-uppercase"
                      style={{ color: "#64748b" }}
                    >
                      {attrName}:{" "}
                      <span className="text-dark">
                        {selectedAttributes[attrName]}
                      </span>
                    </label>
                    {isDropdown && !isColor ? (
                      <select
                        value={selectedAttributes[attrName] || ""}
                        onChange={(e) =>
                          handleAttributeSelect(attrName, e.target.value)
                        }
                        className="form-select shadow-none"
                        style={{
                          width: "100%",
                          maxWidth: "350px",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          color: "#0f172a",
                          cursor: "pointer",
                          backgroundColor: "#f8fafc",
                          fontWeight: "600",
                        }}
                      >
                        {availableOptions[attrName].map((val, i) => (
                          <option key={i} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="d-flex flex-wrap gap-2 ">
                        {availableOptions[attrName].map((val, i) => {
                          const isSelected =
                            selectedAttributes[attrName] === val;
                          if (isColor) {
                            const hexValue = getHexForColor(val);
                            const isWhite =
                              hexValue.toLowerCase() === "#ffffff" ||
                              hexValue.toLowerCase() === "white";
                            return (
                              <div
                                key={i}
                                onClick={() =>
                                  handleAttributeSelect(attrName, val)
                                }
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  padding: "3px",
                                  border: isSelected
                                    ? "2px solid #10b981"
                                    : "2px solid transparent",
                                  transition: "border-color 0.2s ease",
                                }}
                                title={val}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: hexValue,
                                    borderRadius: "50%",
                                    border: isWhite
                                      ? "1px solid #cbd5e1"
                                      : "1px solid rgba(0,0,0,0.1)",
                                  }}
                                ></div>
                              </div>
                            );
                          } else {
                            return (
                              <button
                                key={i}
                                onClick={() =>
                                  handleAttributeSelect(attrName, val)
                                }
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: isSelected
                                    ? "#ecfdf5"
                                    : "#fff",
                                  color: isSelected ? "#059669" : "#0f172a",
                                  border: isSelected
                                    ? "2px solid #10b981"
                                    : "1px solid #cbd5e1",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  minWidth: "55px",
                                  outline: "none",
                                  transition: "all 0.1s ease-in-out",
                                }}
                              >
                                {val}
                              </button>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <hr className="my-3" style={{ opacity: "0.1" }} />

              <div className="mt-3 text-dark small">
                <div className="row mb-2">
                  <div className="col-4 fw-bold text-muted text-uppercase">
                    Category
                  </div>
                  <div className="col-8 fw-semibold text-dark">
                    {fullCategory || "N/A"}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 fw-bold text-muted text-uppercase">
                    SKU
                  </div>
                  <div className="col-8 fw-semibold text-dark">
                    {selectedVariant?.sku || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="pincode-checker mt-4 p-3 border rounded shadow-sm"
                style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
              >
                <label
                  className="d-block small mb-2 fw-bold"
                  style={{ color: "#334155" }}
                >
                  <FaMapMarkerAlt className="me-1" color="#10b981" /> CHECK
                  DELIVERY AVAILABILITY
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm shadow-none border-0"
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    style={{
                      maxWidth: "180px",
                      borderRadius: "8px",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  />
                  <button
                    className="btn btn-sm shadow-none px-4"
                    onClick={handlePincodeCheck}
                    style={{
                      borderRadius: "8px",
                      backgroundColor: "#10b981",
                      color: "#fff",
                      fontWeight: "bold",
                      border: "none",
                      transition: "0.2s",
                    }}
                  >
                    Check
                  </button>
                </div>
                {pincodeStatus === "checking" && (
                  <div className="mt-2 small text-muted">Verifying...</div>
                )}
                {pincodeStatus === "available" && (
                  <div
                    className="mt-2 small d-flex align-items-center gap-1 fw-bold"
                    style={{ color: "#059669" }}
                  >
                    <FaCheckCircle /> {pincodeMsg}
                  </div>
                )}
                {pincodeStatus === "unavailable" && (
                  <div
                    className="mt-2 small d-flex align-items-center gap-1 fw-bold"
                    style={{ color: "#ef4444" }}
                  >
                    <FaTimesCircle /> {pincodeMsg}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-12">
            <div
              className="border rounded p-4 shadow-sm"
              style={{ borderColor: "#e2e8f0", backgroundColor: "#fff" }}
            >
              <div
                className="fw-bold fs-4 mb-3"
                style={{ color: "#0f172a", lineHeight: "1" }}
              >
                ₹{price.toLocaleString()}
              </div>
              <h5
                className="fs-6 fw-bold mb-3"
                style={{ color: availableStock > 0 ? "#10b981" : "#ef4444" }}
              >
                {availableStock > 0 ? "In stock." : "Currently unavailable."}
              </h5>
              {availableStock > 0 && (
                <div className="mb-4">
                  <label className="small text-muted fw-bold text-uppercase mb-2 d-block">
                    Quantity
                  </label>
                  <div
                    className="d-inline-flex align-items-center rounded"
                    style={{
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#f8fafc",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => handleQuantity("dec")}
                      className="btn shadow-none px-3 py-2 border-end border-0"
                      style={{
                        borderRight: "1px solid #cbd5e1",
                        borderRadius: "0",
                        fontWeight: "800",
                      }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="border-0 bg-transparent text-center fw-bold"
                      style={{
                        width: "50px",
                        outline: "none",
                        fontSize: "15px",
                        color: "#0f172a",
                      }}
                    />
                    <button
                      onClick={() => handleQuantity("inc")}
                      className="btn shadow-none px-3 py-2 border-start border-0"
                      style={{
                        borderLeft: "1px solid #cbd5e1",
                        borderRadius: "0",
                        fontWeight: "800",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              <div className="d-flex flex-column gap-3 mb-3">
                <button
                  onClick={handleAddToCart}
                  className="btn w-100 shadow-sm"
                  style={{
                    background: "#ecfdf5",
                    border: "2px solid #10b981",
                    color: "#059669",
                    padding: "12px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: "800",
                    transition: "0.2s",
                  }}
                  disabled={availableStock === 0}
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn w-100 shadow-sm"
                  style={{
                    background: "#10b981",
                    border: "2px solid #10b981",
                    color: "#ffffff",
                    padding: "12px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: "800",
                    transition: "0.2s",
                  }}
                  disabled={availableStock === 0}
                >
                  Buy Now
                </button>
              </div>
              <div className="d-flex align-items-center justify-content-center gap-2 small text-muted fw-bold mt-4">
                <FiLock size={16} /> SECURE TRANSACTION
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-top">
          <ul
            className="nav nav-tabs mb-3 border-0 gap-3"
            style={{ paddingBottom: "10px" }}
          >
            <li className="nav-item">
              <button
                className={`btn fw-bold px-4 py-2 ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
                style={{
                  color: activeTab === "description" ? "#fff" : "#64748b",
                  backgroundColor:
                    activeTab === "description" ? "#10b981" : "#f1f5f9",
                  border: "none",
                  borderRadius: "50px",
                  transition: "0.2s",
                }}
              >
                Description
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn fw-bold px-4 py-2 ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
                style={{
                  color: activeTab === "reviews" ? "#fff" : "#64748b",
                  backgroundColor:
                    activeTab === "reviews" ? "#10b981" : "#f1f5f9",
                  border: "none",
                  borderRadius: "50px",
                  transition: "0.2s",
                }}
              >
                Reviews ({reviewsData.count})
              </button>
            </li>
          </ul>

          <div
            className="tab-content p-4 border rounded shadow-sm bg-white"
            style={{ borderColor: "#e2e8f0" }}
          >
            {activeTab === "description" && (
              <div
                className="text-dark m-0 p-0"
                style={{
                  lineHeight: "1.8",
                  fontSize: "15px",
                  color: "#334155",
                }}
              >
                {product.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-muted m-0 fw-bold">
                    No description available for this product.
                  </p>
                )}
              </div>
            )}
            {activeTab === "reviews" && (
              <div
                className="text-dark m-0 p-0"
                style={{ lineHeight: "1.6", fontSize: "15px" }}
              >
                {reviewsData.reviews.length > 0 ? (
                  <div className="d-flex flex-column gap-4">
                    {reviewsData.reviews.map((rev) => (
                      <div key={rev._id} className="pb-3 border-bottom">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: "36px",
                              height: "36px",
                              fontSize: "14px",
                              backgroundColor: "#ecfdf5",
                              color: "#059669",
                            }}
                          >
                            {rev.user?.name?.charAt(0).toUpperCase() || "G"}
                          </div>
                          <span className="fw-bold text-dark">
                            {rev.user?.name || "Guest User"}
                          </span>
                        </div>
                        <div className="d-flex gap-1 mb-2">
                          {renderStars(rev.rating)}
                        </div>
                        <p
                          className="m-0 text-dark"
                          style={{ color: "#334155" }}
                        >
                          {rev.comment}
                        </p>
                        <div
                          className="text-muted mt-2 fw-bold"
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                          }}
                        >
                          Reviewed on{" "}
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted m-0 fw-bold">
                    No reviews yet for this variant.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-top">
          <h3 className="fw-bold mb-4 fs-4" style={{ color: "#0f172a" }}>
            Customers who viewed this item also viewed
          </h3>
          <div className="row g-3 mb-5">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p._id} className="col-xl-3 col-lg-4 col-md-4 col-6">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductSection;
