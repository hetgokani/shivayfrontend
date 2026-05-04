import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  FaWhatsapp,
  FaCheckCircle,
  FaArrowLeft,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";

const THEME = {
  forest: "#0F2E11",
  organicGreen: "#4A7729",
  white: "#FFFFFF",
  border: "#e2e8f0",
  softBg: "#f8fafc",
  textDark: "#1e293b",
  textMuted: "#64748b",
};

const ShivayProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (res.data && res.data.product) {
          const pData = res.data.product;
          const vData = res.data.variants || [];
          setProduct(pData);
          setVariants(vData);

          const def = vData.find((v) => v.isDefault) || vData[0] || {};
          setSelectedVariant(def);

          const validImages = def.images?.filter((i) => i) || [];
          setCurrentImage(validImages[0] || pData.thumbnail);

          const initialAttrs = {};
          def.attributes?.forEach((a) => (initialAttrs[a.name] = a.value));
          setSelectedAttributes(initialAttrs);
        }
        setLoading(false);
      } catch (err) {
        toast.error("Product details not found");
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAttributeClick = (name, value) => {
    const updated = { ...selectedAttributes, [name]: value };
    setSelectedAttributes(updated);

    const match = variants.find((v) =>
      v.attributes.every((a) => updated[a.name] === a.value),
    );

    if (match) {
      setSelectedVariant(match);
      const firstImg = match.images?.filter((i) => i)[0];
      if (firstImg) setCurrentImage(firstImg);
    }
  };

  // UPDATED WHATSAPP LOGIC ONLY
  const handleWhatsAppOrder = () => {
    const phone = "918094816007"; // REPLACE WITH YOUR NUMBER

    const catTitle = product?.category?.title || "N/A";
    const subCatTitle = product?.subcategory?.title
      ? `\n*Subcategory:* ${product.subcategory.title}`
      : "";
    const pPrice =
      selectedVariant?.discountPrice ||
      selectedVariant?.originalPrice ||
      selectedVariant?.price ||
      0;

    const selectionText =
      selectedVariant?.attributes?.length > 0
        ? selectedVariant.attributes
            .map((a) => `${a.name}: ${a.value}`)
            .join(", ")
        : "N/A";

    const msg = `*New Order Inquiry*\n\n*Product:* ${product.title}\n*Category:* ${catTitle}${subCatTitle}\n*SKU:* ${selectedVariant?.sku || "N/A"}\n*Selection:* ${selectionText}\n*Price:* ₹${pPrice}`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME.forest,
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading product details...
      </div>
    );

  if (!product)
    return (
      <div
        style={{ padding: "120px 20px", textAlign: "center", fontSize: "20px" }}
      >
        Product Not Found
      </div>
    );

  const attrMap = variants.reduce((acc, v) => {
    v.attributes.forEach((a) => {
      if (!acc[a.name]) acc[a.name] = new Set();
      acc[a.name].add(a.value);
    });
    return acc;
  }, {});

  const pOriginal =
    selectedVariant?.originalPrice || selectedVariant?.price || 0;
  const pDiscount = selectedVariant?.discountPrice || 0;
  const hasDiscount = pDiscount > 0 && pDiscount < pOriginal;

  // Gather up to 5 images from the variant (fallback to product gallery if variant has no images)
  const displayImages = (
    selectedVariant?.images?.filter((i) => i)?.length > 0
      ? selectedVariant.images
      : [product.thumbnail, ...(product.gallery || [])]
  )
    .filter((i) => i)
    .slice(0, 5);

  return (
    <div style={{ backgroundColor: THEME.white, minHeight: "100vh" }}>
      <ToastContainer position="top-right" />

      {/* 
        CRITICAL FIX: padding-top: 120px pushes the content down 
        so your website's navigation bar doesn't cover it.
      */}
      <div className="product-page-wrapper">
        {/* Breadcrumb / Back Button */}
        <div className="breadcrumb-nav">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft size={14} /> Back to Products
          </button>
        </div>

        <div className="product-grid-layout">
          {/* LEFT: Image Gallery */}
          <div className="gallery-section">
            <div className="main-image-box">
              {hasDiscount && <div className="sale-badge">SALE</div>}
              <img
                src={`http://localhost:5000${currentImage}`}
                alt={product.title}
                className="main-img"
              />
            </div>

            {/* 5 Thumbnails */}
            <div className="thumbnail-list">
              {displayImages.map((img, i) => (
                <div
                  key={i}
                  className={`thumb-box ${currentImage === img ? "active" : ""}`}
                  onClick={() => setCurrentImage(img)}
                >
                  <img
                    src={`http://localhost:5000${img}`}
                    alt={`view-${i}`}
                    className="thumb-img"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="details-section">
            <span className="category-tag">{product.category?.title}</span>
            <h1 className="product-title">{product.title}</h1>

            <div className="pricing-block">
              <span className="current-price">
                ₹{hasDiscount ? pDiscount : pOriginal}
              </span>
              {hasDiscount && (
                <>
                  <span className="original-price">₹{pOriginal}</span>
                  <span className="save-badge">
                    Save{" "}
                    {Math.round(((pOriginal - pDiscount) / pOriginal) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="divider" />

            {/* ATTRIBUTE SELECTORS */}
            <div className="attributes-container">
              {Object.entries(attrMap).map(([name, values]) => (
                <div key={name} className="attribute-group">
                  <label className="attribute-label">Select {name}</label>
                  <div className="attribute-buttons">
                    {[...values].map((v) => {
                      const isActive = selectedAttributes[name] === v;
                      return (
                        <button
                          key={v}
                          onClick={() => handleAttributeClick(name, v)}
                          className={`attr-btn ${isActive ? "active" : ""}`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="action-container">
              <button onClick={handleWhatsAppOrder} className="whatsapp-btn">
                <FaWhatsapp size={22} /> Buy on WhatsApp
              </button>
            </div>

            {/* TRUST & META INFO */}
            <div className="meta-info-box">
              <div className="trust-item">
                <FaShippingFast size={18} color={THEME.organicGreen} />
                <span>Fast Delivery Pan India</span>
              </div>
              <div className="trust-item">
                <FaShieldAlt size={18} color={THEME.organicGreen} />
                <span>100% Secure Checkout</span>
              </div>
            </div>

            <div className="sku-box">
              <FaCheckCircle size={14} />{" "}
              <span>SKU: {selectedVariant?.sku || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS STYLES */}
      <style>{`
        .product-page-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 20px 80px 20px; /* 120px top padding fixes the overlap */
        }

        .breadcrumb-nav {
          margin-bottom: 30px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: ${THEME.textMuted};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .back-btn:hover {
          color: ${THEME.forest};
        }

        .product-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        /* Gallery Styles */
        .main-image-box {
          width: 100%;
          background: ${THEME.softBg};
          border: 1px solid ${THEME.border};
          border-radius: 16px;
          padding: 20px;
          position: relative;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .sale-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: ${THEME.forest};
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .thumbnail-list {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-top: 15px;
        }

        .thumb-box {
          aspect-ratio: 1 / 1;
          border-radius: 10px;
          border: 2px solid ${THEME.border};
          overflow: hidden;
          cursor: pointer;
          background: ${THEME.softBg};
          transition: all 0.2s ease;
        }

        .thumb-box.active {
          border-color: ${THEME.organicGreen};
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Details Styles */
        .category-tag {
          color: ${THEME.organicGreen};
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .product-title {
          font-size: 32px;
          color: ${THEME.textDark};
          font-weight: 800;
          margin: 10px 0 20px 0;
          line-height: 1.3;
        }

        .pricing-block {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 28px;
          font-weight: 800;
          color: ${THEME.forest};
        }

        .original-price {
          font-size: 18px;
          color: ${THEME.textMuted};
          text-decoration: line-through;
          font-weight: 500;
        }

        .save-badge {
          background: #dcfce7;
          color: #166534;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
        }

        .product-description {
          font-size: 15px;
          color: ${THEME.textMuted};
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .divider {
          height: 1px;
          background-color: ${THEME.border};
          margin-bottom: 25px;
        }

        .attributes-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .attribute-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: ${THEME.textDark};
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .attribute-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .attr-btn {
          padding: 10px 20px;
          background: white;
          border: 1px solid ${THEME.border};
          border-radius: 8px;
          color: ${THEME.textDark};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .attr-btn:hover {
          border-color: ${THEME.organicGreen};
        }

        .attr-btn.active {
          background: ${THEME.forest};
          border-color: ${THEME.forest};
          color: white;
        }

        .whatsapp-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #25D366;
          color: white;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.2);
          transition: transform 0.1s;
        }

        .whatsapp-btn:active {
          transform: scale(0.98);
        }

        .meta-info-box {
          display: flex;
          gap: 20px;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid ${THEME.border};
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: ${THEME.textMuted};
          font-weight: 500;
        }

        .sku-box {
          margin-top: 15px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: ${THEME.textMuted};
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 900px) {
          .product-grid-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .product-page-wrapper {
            padding-top: 100px; /* Slightly less on mobile, adjust if needed */
          }
        }

        @media (max-width: 480px) {
          .product-title {
            font-size: 26px;
          }
          .current-price {
            font-size: 24px;
          }
          .thumbnail-list {
            gap: 8px;
          }
          .meta-info-box {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ShivayProductDetails;
