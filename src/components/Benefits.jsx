import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Activity,
  ShieldCheck,
  Sparkles,
  Wind,
  Droplets,
  Zap,
} from "lucide-react";

const Benefits = () => {
  // Brand Theme Colors
  const darkGreen = "#366e28";
  const primaryLight = "#5e9730";
  const moreDarkGreen = "#144e16";
  const offWhite = "#F0F7EE";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const benefitCategories = [
    {
      title: "Ayurvedic Vitality",
      desc: "Harnessing Asparagus Racemosus and Sharpunkha for hormonal balance and deep cellular rejuvenation.",
      icon: <Activity size={32} />,
      items: ["Asparagus Racemosus", "Sharpunkha", "Laminaria"],
    },
    {
      title: "Mental Focus",
      desc: "Sage Leaf and Evening Primrose designed to soothe the nervous system and enhance cognitive clarity.",
      icon: <Wind size={32} />,
      items: ["Evening Primrose", "Hypericum", "Sage Leaf"],
    },
    {
      title: "Antioxidant Shield",
      desc: "Powerful Grape Seed and Citrus Bioflavonoids provide defense against free radicals and oxidative stress.",
      icon: <ShieldCheck size={32} />,
      items: ["Bioflavonoids", "Grape Seed", "Licorice"],
    },
    {
      title: "Superfruit Nutrients",
      desc: "Exotic Maqui Berry and White Monk Fruit extracts for natural energy and metabolic peak performance.",
      icon: <Sparkles size={32} />,
      items: ["Monk Fruit", "Maqui Berry", "Miraculin"],
    },
    {
      title: "Botanical Extracts",
      desc: "Traditional Chinese and Herbal extracts like Paeoniflorin and Red Wine Leaf for holistic biological care.",
      icon: <Leaf size={32} />,
      items: ["Red Wine Leaf", "Paeoniflorin", "Kudzu"],
    },
    {
      title: "Pure Essential Oils",
      desc: "Distilled Lavender, Eucalyptus, and Rosemary for premium aromatherapy and transdermal wellness.",
      icon: <Droplets size={32} />,
      items: ["Lavender", "Eucalyptus", "Rosemary"],
    },
  ];

  if (!mounted) return null;

  return (
    <div
      style={{
        backgroundColor: offWhite,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* --- HERO SECTION --- */}
      <section
        className="hero-section"
        style={{
          background: `radial-gradient(circle at top right, ${darkGreen}, ${moreDarkGreen})`,
          padding: "120px 6% 140px", // Optimized padding
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            opacity: 0.05,
            color: "white",
          }}
        >
          <Leaf size={500} fill="currentColor" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              padding: "10px 25px",
              borderRadius: "50px",
              marginBottom: "30px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Zap size={16} color="#fff" fill="#fff" />
            <span
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              ELITE HEALTHCARE SOLUTIONS
            </span>
          </motion.div>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(34px, 5vw, 64px)", // Tighter text scaling
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              margin: 0,
            }}
          >
            The Gold Standard of <br />
            <span
              style={{
                background: `linear-gradient(to right, ${primaryLight}, #cddc39)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              Organic Benefits
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              maxWidth: "600px",
              margin: "25px auto 0",
              fontSize: "18px",
              lineHeight: "1.6",
              fontWeight: 300,
            }}
          >
            Merging ancient Ayurvedic traditions with clinical precision to
            deliver results you can feel.
          </p>
        </motion.div>
      </section>

      {/* --- BENEFITS GRID --- */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "-80px auto 0", // Perfectly balanced overlap
          padding: "0 6% 100px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "25px",
          }}
        >
          {benefitCategories.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -12,
                boxShadow: "0 30px 60px -12px rgba(20, 78, 22, 0.15)",
              }}
              style={{
                background: "white",
                padding: "40px 35px", // Sleeker card padding
                borderRadius: "32px",
                border: "1px solid rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${primaryLight}, ${darkGreen})`,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 16px -4px ${primaryLight}50`,
                }}
              >
                {benefit.icon}
              </div>

              <h3
                style={{
                  color: moreDarkGreen,
                  fontSize: "24px",
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  margin: 0,
                  minHeight: "70px",
                }}
              >
                {benefit.desc}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {benefit.items.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: darkGreen,
                      background: "#f0f9ed",
                      padding: "6px 12px",
                      borderRadius: "50px",
                      border: `1px solid ${primaryLight}15`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Leaf
                size={120}
                style={{
                  position: "absolute",
                  right: "-30px",
                  bottom: "-30px",
                  opacity: 0.03,
                  color: moreDarkGreen,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;700;800&display=swap');
        
        @media (max-width: 1024px) {
          div[style*="grid-template-columns"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .hero-section { padding: 80px 5% 100px !important; }
          div[style*="margin: -80px"] { margin: -60px auto 0 !important; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 20px !important; }
          div[style*="padding: 40px 35px"] { padding: 30px 25px !important; border-radius: 24px !important; }
          h1 { font-size: 32px !important; }
          h3 { font-size: 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default Benefits;
