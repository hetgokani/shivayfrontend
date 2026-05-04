import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa";

const THEME = {
  forest: "#0F2E11",
  organicGreen: "#4A7729",
  white: "#FFFFFF",
  border: "#eef2ee",
};

const ProductPage = () => {
  const { id } = useParams();
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
        console.log("Fetching data for Product ID:", id);

        // 1. Fetch data from backend
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log("API Response received:", res.data);

        // 2. Validate response structure
        if (res.data && res.data.product) {
          const productData = res.data.product;
          const variantData = res.data.variants || [];

          setProduct(productData);
          setVariants(variantData);

          // 3. Select Default Variant or first available[cite: 1, 2]
          const def = variantData.find((v) => v.isDefault) || variantData[0];
          setSelectedVariant(def);

          // 4. Handle Image Initialization
          const validImages = def?.images?.filter((img) => img) || [];
          setCurrentImage(validImages[0] || productData.thumbnail);

          // 5. Initialize Attribute State based on chosen variant[cite: 2]
          const initialAttrs = {};
          def?.attributes?.forEach((attr) => {
            initialAttrs[attr.name] = attr.value;
          });
          setSelectedAttributes(initialAttrs);

          setLoading(false);
        } else {
          console.error(
            "Data structure error: 'product' field missing in response",
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        toast.error("Error connecting to server");
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Logic to switch variants when attributes are clicked[cite: 1, 2]
  const handleAttributeClick = (name, value) => {
    const updatedAttrs = { ...selectedAttributes, [name]: value };
    setSelectedAttributes(updatedAttrs);

    // Find the variant matching the new selection
    const match = variants.find((v) =>
      v.attributes.every((a) => updatedAttrs[a.name] === a.value),
    );

    if (match) {
      setSelectedVariant(match);
      const firstValidImg = match.images?.filter((img) => img)[0];
      if (firstValidImg) setCurrentImage(firstValidImg);
    }
  };

  const handleWhatsAppBuy = () => {
    const phoneNumber = "919876543210"; // REPLACE WITH YOUR NUMBER
    const pTitle = product?.title;
    const pPrice =
      selectedVariant?.discountPrice ||
      selectedVariant?.originalPrice ||
      selectedVariant?.price;
    const pSku = selectedVariant?.sku || "N/A";
    const pAttrs = selectedVariant?.attributes
      ?.map((a) => `${a.name}: ${a.value}`)
      .join(", ");

    const message = `*Order Inquiry*%0A--------------------------%0A*Product:* ${pTitle}%0A*Price:* ₹${pPrice}%0A*SKU:* ${pSku}%0A*Selection:* ${pAttrs}%0A--------------------------%0A*Link:* ${window.location.href}`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading)
    return (
      <div
        style={{ padding: "100px", textAlign: "center", color: THEME.forest }}
      >
        Loading details...
      </div>
    );

  if (!product)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2 style={{ color: THEME.forest }}>Product not found.</h2>
        <p>Please check your backend connection at http://localhost:5000</p>
      </div>
    );

  // Map unique attribute options for the UI[cite: 2]
  const attributeMap = variants.reduce((acc, v) => {
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

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "40px auto",
        padding: "0 5%",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <ToastContainer />
      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
        {/* Gallery Section */}
        <div style={{ flex: "1 1 500px" }}>
          <div
            style={{
              width: "100%",
              borderRadius: "30px",
              overflow: "hidden",
              border: `1px solid ${THEME.border}`,
              background: "#fdfdfd",
            }}
          >
            <img
              src={`http://localhost:5000${currentImage}`}
              style={{ width: "100%", height: "600px", objectFit: "contain" }}
              alt="Main Product"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "20px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            {selectedVariant?.images
              ?.filter((img) => img)
              .map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${img}`}
                  onClick={() => setCurrentImage(img)}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "15px",
                    cursor: "pointer",
                    border:
                      currentImage === img
                        ? `2px solid ${THEME.organicGreen}`
                        : `1px solid ${THEME.border}`,
                    objectFit: "cover",
                  }}
                  alt="thumb"
                />
              ))}
          </div>
        </div>

        {/* Info Section */}
        <div style={{ flex: "1 1 400px" }}>
          <span
            style={{
              color: THEME.organicGreen,
              fontWeight: "900",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {product.category?.title || "Herbal"}
          </span>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "900",
              color: THEME.forest,
              margin: "10px 0 20px",
            }}
          >
            {product.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: THEME.forest,
              }}
            >
              ₹{hasDiscount ? pDiscount : pOriginal}
            </span>
            {hasDiscount && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#999",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                ₹{pOriginal}
              </span>
            )}
            {hasDiscount && (
              <span
                style={{
                  background: `${THEME.organicGreen}15`,
                  color: THEME.organicGreen,
                  padding: "5px 12px",
                  borderRadius: "8px",
                  fontWeight: "800",
                  fontSize: "14px",
                }}
              >
                {Math.round(((pOriginal - pDiscount) / pOriginal) * 100)}% OFF
              </span>
            )}
          </div>

          <div
            style={{
              marginBottom: "30px",
              borderBottom: `1px solid ${THEME.border}`,
              paddingBottom: "30px",
            }}
          >
            <p style={{ color: "#555", lineHeight: "1.8", fontSize: "16px" }}>
              {product.description}
            </p>
          </div>

          {/* Selection UI */}
          {Object.entries(attributeMap).map(([name, values]) => (
            <div key={name} style={{ marginBottom: "30px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "900",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "15px",
                  letterSpacing: "1px",
                }}
              >
                Select {name}
              </label>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[...values].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAttributeClick(name, val)}
                    style={{
                      padding: "12px 25px",
                      borderRadius: "12px",
                      border:
                        selectedAttributes[name] === val
                          ? `2px solid ${THEME.organicGreen}`
                          : `1px solid ${THEME.border}`,
                      background:
                        selectedAttributes[name] === val
                          ? `${THEME.organicGreen}10`
                          : THEME.white,
                      color: THEME.forest,
                      fontWeight: "800",
                      cursor: "pointer",
                      transition: "0.2s all ease",
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Action Button */}
          <button
            onClick={handleWhatsAppBuy}
            style={{
              width: "100%",
              background: "#25D366",
              color: "white",
              padding: "22px",
              border: "none",
              borderRadius: "20px",
              fontWeight: "900",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              marginTop: "40px",
              boxShadow: "0 10px 25px rgba(37, 211, 102, 0.25)",
            }}
          >
            <FaWhatsapp size={26} /> ORDER VIA WHATSAPP
          </button>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: THEME.organicGreen,
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            <FaCheckCircle />{" "}
            <span>SKU: {selectedVariant?.sku || "Select options"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
