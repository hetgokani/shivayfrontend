import React, { useState, useEffect, useMemo, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoHeartCircleOutline, IoHeartCircle } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const getCssColor = (colorName) => {
  if (!colorName) return "transparent";
  const lower = String(colorName).toLowerCase();
  if (lower === "navy blue") return "#000080";
  if (lower === "light pink") return "#FFB6C1";
  return lower.replace(/\s/g, "");
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => v.isDefault) || product.variants[0];
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0 });

  useEffect(() => {
    if (selectedVariant?._id) {
      const fetchRating = async () => {
        try {
          const res = await axios
            .get(
              `https://shivaybackend.onrender.com/api/reviews/${selectedVariant._id}`,
            )
            .catch(() => ({ data: { averageRating: 0, count: 0 } })); // Safe fetch
          setRatingInfo({
            average: res.data.averageRating || 0,
            count: res.data.count || 0,
          });
        } catch (err) {
          console.error("Error fetching card rating", err);
        }
      };
      fetchRating();
    }
  }, [selectedVariant?._id]);

  useEffect(() => {
    if (user && product?._id) {
      axios
        .get("https://shivaybackend.onrender.com/api/wishlist", {
          withCredentials: true,
        })
        .catch(() => ({ data: { items: [] } })) // Safe fetch
        .then((res) => {
          const items = res.data?.items || [];
          const foundItem = items.find(
            (item) =>
              (item.product?._id === product._id ||
                item.product === product._id) &&
              (!selectedVariant ||
                item.variant?._id === selectedVariant._id ||
                item.variant === selectedVariant._id),
          );

          if (foundItem) {
            setWishlisted(true);
            setWishlistItemId(foundItem._id);
          } else {
            setWishlisted(false);
            setWishlistItemId(null);
          }
        })
        .catch((err) => console.error("Wishlist check error", err));
    } else {
      setWishlisted(false);
    }
  }, [user, product?._id, selectedVariant?._id]);

  const renderStars = (rating) => {
    const stars = [];
    const starSize = isMobile ? 10 : 12;
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} size={starSize} color="#ffc107" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} size={starSize} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} size={starSize} color="#ffc107" />);
      }
    }
    return stars;
  };

  const colorOptions = useMemo(() => {
    if (!product?.variants) return [];
    const colors = new Map();
    product.variants.forEach((v) => {
      const colorAttr = v.attributes?.find(
        (a) => a.name.toLowerCase() === "color",
      );
      if (colorAttr && !colors.has(colorAttr.value)) {
        colors.set(colorAttr.value, v);
      }
    });
    return Array.from(colors.entries()).map(([color, variant]) => ({
      color,
      variant,
    }));
  }, [product]);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const originalPrice = Number(
    selectedVariant?.price ||
      selectedVariant?.originalPrice ||
      product?.price ||
      0,
  );

  const discountPrice = Number(selectedVariant?.discountPrice || 0);
  const isSale = discountPrice > 0 && discountPrice < originalPrice;
  const currentPrice = isSale ? discountPrice : originalPrice;

  const displayImg = getImageUrl(
    selectedVariant?.images?.[0] || product?.thumbnail,
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "https://shivaybackend.onrender.com/api/cart/add",
        {
          productId: product._id,
          variantId: selectedVariant?._id || null,
          quantity: 1,
        },
        { withCredentials: true },
      );
      toast.success("Added to Cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Error adding to cart");
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (!wishlisted) {
        const res = await axios.post(
          "https://shivaybackend.onrender.com/api/wishlist/add",
          {
            productId: product._id,
            variantId: selectedVariant?._id || null,
          },
          { withCredentials: true },
        );
        setWishlisted(true);
        const newItem = res.data.wishlist?.items?.find(
          (i) =>
            i.product === product._id && i.variant === selectedVariant?._id,
        );
        if (newItem) setWishlistItemId(newItem._id);

        toast.success("Added to Wishlist!");
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        if (wishlistItemId) {
          await axios.delete(
            `https://shivaybackend.onrender.com/api/wishlist/remove/${wishlistItemId}`,
            { withCredentials: true },
          );
          setWishlisted(false);
          setWishlistItemId(null);
          toast.info("Removed from Wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating wishlist");
    }
  };

  return (
    <div
      className="product-card"
      style={{
        borderRadius: isMobile ? "12px" : "20px",
        border: "1px solid #e2e8f0",
        boxShadow: isHovered
          ? "0 12px 30px rgba(0,0,0,0.08)"
          : "0 4px 15px rgba(0,0,0,0.03)",
        overflow: "hidden",
        background: "#fff",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={`/product/${product?._id}`}
        style={{
          height: isMobile ? "160px" : "220px",
          padding: isMobile ? "10px" : "15px",
          flexShrink: 0,
        }}
      >
        <img
          src={displayImg}
          alt={product?.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: isMobile ? "8px" : "14px",
            backgroundColor: "#f8fafc",
          }}
        />
      </NavLink>

      <div
        style={{
          padding: isMobile ? "10px" : "15px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "4px",
            visibility: ratingInfo.count === 0 ? "hidden" : "visible",
          }}
        >
          <div style={{ display: "flex" }}>
            {renderStars(ratingInfo.average)}
          </div>
          <span
            style={{
              fontSize: isMobile ? "10px" : "12px",
              color: "#64748b",
              fontWeight: "600",
            }}
          >
            {Number(ratingInfo.average).toFixed(1)}
          </span>
        </div>

        <NavLink
          to={`/product/${product?._id}`}
          style={{
            fontSize: isMobile ? "13px" : "16px",
            fontWeight: "600",
            color: "#0f172a",
            textDecoration: "none",
            marginBottom: "4px",
            wordWrap: "break-word",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product?.title}
        </NavLink>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isMobile ? "4px" : "8px",
            marginBottom: isMobile ? "6px" : "10px",
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "14px" : "17px",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            ₹{currentPrice.toFixed(2)}
          </span>
          {isSale && (
            <span
              style={{
                fontSize: isMobile ? "10px" : "12px",
                textDecoration: "line-through",
                color: "#94a3b8",
              }}
            >
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {colorOptions.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: isMobile ? "8px" : "10px",
            }}
          >
            {colorOptions.map(({ color, variant }, idx) => {
              const isSelected = selectedVariant?._id === variant._id;
              const cssColor = variant.colorHex || getCssColor(color);
              const isWhite =
                cssColor === "white" ||
                cssColor === "#ffffff" ||
                cssColor === "#fff";
              const dotSize = isMobile ? "14px" : "18px";
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    backgroundColor: cssColor,
                    cursor: "pointer",
                    border: isWhite
                      ? "1px solid #cbd5e1"
                      : "1px solid transparent",
                    boxShadow: isSelected
                      ? "0 0 0 2px #fff, 0 0 0 3px #10b981"
                      : "none",
                  }}
                  title={color}
                />
              );
            })}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: isMobile ? "4px" : "8px",
            marginTop: "auto",
            width: "100%",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleWishlist}
            style={{
              width: isMobile ? "32px" : "42px",
              height: isMobile ? "32px" : "42px",
              flexShrink: 0,
              borderRadius: "8px",
              background: "#fff",
              border: "1px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            {wishlisted ? (
              <IoHeartCircle size={isMobile ? 22 : 28} color="#10b981" />
            ) : (
              <IoHeartCircleOutline size={isMobile ? 22 : 28} color="#94a3b8" />
            )}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={selectedVariant?.stock === 0}
            style={{
              flex: 1,
              height: isMobile ? "32px" : "42px",
              borderRadius: "8px",
              border: "none",
              background: "#10b981",
              color: "#fff",
              fontWeight: "700",
              fontSize: isMobile ? "11px" : "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.2s",
              cursor: selectedVariant?.stock === 0 ? "not-allowed" : "pointer",
              opacity: selectedVariant?.stock === 0 ? 0.7 : 1,
              padding: "0 5px",
            }}
          >
            {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
