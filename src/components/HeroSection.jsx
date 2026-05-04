import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use this for navigation
import { motion } from "framer-motion";
import { Leaf, ArrowRight, ShieldCheck, Star, Globe } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  // Brand Theme Colors
  const forest = "#0F2E11";
  const organicGreen = "#4A7729";
  const gold = "#D4AF37";
  const lightGreenBg = "#F0F7EE";

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const leafData = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      delay: Math.random() * 2,
      duration: 8 + Math.random() * 12,
      size: 10 + Math.random() * 15,
    }));
    setLeaves(leafData);
  }, []);

  const profiles = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
  ];

  return (
    <section
      className="hero-container"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        // Ensure the path "/assets/img/bgimg.jpeg" exists in your 'public' folder
        background: `linear-gradient(to right, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.1) 100%), url("/bgimg.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .hero-container { 
            background-position: 85% center !important; 
            padding-top: 100px !important;
            align-items: flex-start !important;
            height: auto !important;
            padding-bottom: 40px;
          }
          .content-wrapper {
            margin: 0 auto !important;
          }
          .hero-content { 
            text-align: center; 
            margin: 0 auto !important; 
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(10px);
            padding: 40px 20px !important;
            border-radius: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
            width: 100%;
          }
          .trust-badge { justify-content: center; }
          .action-area { flex-direction: column; gap: 15px !important; align-items: center !important; }
          .hero-title { font-size: 34px !important; }
          .hero-title span.no-wrap { white-space: nowrap !important; }
          .value-points { 
            flex-direction: column !important; 
            align-items: center !important; 
            gap: 15px !important;
            border-top: 1px solid rgba(0,0,0,0.1) !important;
          }
          .hero-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* FALLING LEAVES LAYER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 0.3, 0.3, 0],
              rotate: 720,
              x: [0, 50, -50, 0],
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: leaf.left,
              width: leaf.size,
              height: leaf.size,
              background: organicGreen,
              borderRadius: "2px 10px",
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Main Content Wrapper */}
      <div
        className="content-wrapper"
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "100px auto",
          padding: "0 6%",
          zIndex: 10,
        }}
      >
        <div className="hero-content" style={{ maxWidth: "650px" }}>
          {/* Trust Badge */}
          <motion.div
            className="trust-badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: lightGreenBg,
              padding: "8px 16px",
              borderRadius: "100px",
              marginBottom: "20px",
              fontSize: "13px",
              border: `1px solid ${organicGreen}20`,
            }}
          >
            <div style={{ display: "flex", marginLeft: "4px" }}>
              {profiles.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="user"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "2px solid white",
                    marginLeft: i === 0 ? "0" : "-8px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <span style={{ color: forest, fontWeight: 700 }}>
              Trusted by 10k+ Users
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(38px, 6vw, 75px)",
              fontWeight: 800,
              color: forest,
              lineHeight: 1.1,
              margin: "0 0 20px 0",
              letterSpacing: "-1.5px",
            }}
          >
            <span className="no-wrap">
              Purely <span style={{ color: organicGreen }}>Organic.</span>
            </span>
            <br />
            Radically{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: organicGreen,
                fontFamily: "serif",
              }}
            >
              Effective.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "18px",
              color: "#333",
              lineHeight: 1.6,
              marginBottom: "30px",
              maxWidth: "520px",
            }}
          >
            Experience the harmony of nature and science. Our herbal solutions
            are crafted for your peak vitality and long-term wellness.
          </motion.p>

          {/* Action Area */}
          <motion.div
            className="action-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
              marginBottom: "35px",
            }}
          >
            <button
              className="hero-btn"
              onClick={() => navigate("/products")} // React Router Dom navigation
              style={{
                background: forest,
                color: "white",
                padding: "18px 38px",
                borderRadius: "14px",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow: "0 15px 30px rgba(15, 46, 17, 0.2)",
              }}
            >
              SHOP COLLECTION <ArrowRight size={18} />
            </button>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={gold} color={gold} />
                ))}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: forest,
                  letterSpacing: "1px",
                }}
              >
                4.9/5 USER RATING
              </span>
            </div>
          </motion.div>

          {/* Value Points */}
          <motion.div
            className="value-points"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              display: "flex",
              gap: "25px",
              paddingTop: "25px",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {[
              { icon: <ShieldCheck size={18} />, text: "Lab Tested" },
              { icon: <Globe size={18} />, text: "Eco-Friendly" },
              { icon: <Leaf size={18} />, text: "100% Vegan" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: forest,
                }}
              >
                <span style={{ color: organicGreen }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
