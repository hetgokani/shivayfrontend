import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Zap, Warehouse, ShieldCheck } from "lucide-react";

const AboutSection = () => {
  const colors = {
    darkGreen: "#366e28",
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    softBg: "#f9fbf8",
    accentLeaf: "rgba(94, 151, 48, 0.1)",
  };

  const highlights = [
    {
      icon: <CheckCircle2 size={18} />,
      text: "ISO 9001:2008 Certified Company",
    },
    {
      icon: <ShieldCheck size={18} />,
      text: "Strict Quality Control & Hygiene",
    },
    { icon: <Award size={18} />, text: "Global Exporter & Supplier" },
  ];

  return (
    <section id="about-section" className="about-section">
      <div className="container">
        <div className="content-wrapper">
          {/* LEFT SIDE: IMAGE AREA */}
          <motion.div
            className="image-container"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="image-frame">
              <img
                src="/about.png"
                alt="Shivay Herbals Process"
                className="main-img"
              />
              <div className="experience-badge">
                <span className="years">ESTD</span>
                <span className="exp-text">2021</span>
              </div>
            </div>
            <div className="blob-decoration"></div>
          </motion.div>

          {/* RIGHT SIDE: TEXT AREA */}
          <motion.div
            className="text-container"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">ABOUT SHIVAY HERBALS</span>
            <h2 className="title">
              Bridging Ancient Wisdom with{" "}
              <span className="highlight">Modern Precision</span>
            </h2>

            <p className="description">
              Founded in 2010, <strong>Shivay Herbals & Healthcare</strong> is a
              leading manufacturer and exporter of Essential Oils, Herbal
              Extracts, and PG Extracts. We operate with a commitment to purity,
              ensuring our products are contaminant-free and precisely composed
              for the global healthcare and personal care industries.
            </p>

            <div className="highlights-list">
              {highlights.map((item, i) => (
                <div key={i} className="highlight-item">
                  <div className="icon-box">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-header">
                  <Zap size={20} color={colors.primaryLight} />
                  <h4>Infrastructure</h4>
                </div>
                <p>
                  Equipped with pulverizers and distillation units for massive
                  bulk production.
                </p>
              </div>

              <div className="info-item">
                <div className="info-header">
                  <Warehouse size={20} color={colors.primaryLight} />
                  <h4>Storage</h4>
                </div>
                <p>
                  Systematic, moisture-free warehousing to maintain
                  international standards.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .about-section {
          padding: 80px 0;
          background: ${colors.softBg};
          font-family: "Poppins", sans-serif;
          overflow: hidden;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .content-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .image-container {
          position: relative;
        }

        .image-frame {
          position: relative;
          z-index: 5;
          border-radius: 30px 100px 30px 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .main-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .experience-badge {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: ${colors.moreDarkGreen};
          color: #fff;
          padding: 15px 25px;
          border-radius: 15px;
          text-align: center;
          line-height: 1.2;
        }

        .years {
          font-size: 12px;
          font-weight: 400;
          display: block;
          opacity: 0.8;
        }
        .exp-text {
          font-size: 24px;
          font-weight: 800;
        }

        .blob-decoration {
          position: absolute;
          top: -20px;
          left: -20px;
          width: 100%;
          height: 100%;
          background: ${colors.accentLeaf};
          border-radius: 30px 100px 30px 30px;
          z-index: 1;
        }

        .eyebrow {
          color: ${colors.primaryLight};
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          margin-bottom: 15px;
          display: block;
        }

        .title {
          font-size: 38px;
          color: ${colors.moreDarkGreen};
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .highlight {
          color: ${colors.primaryLight};
        }

        .description {
          color: #555;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .highlights-list {
          margin-bottom: 30px;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-weight: 600;
          color: #333;
          font-size: 15px;
        }

        .icon-box {
          background: ${colors.accentLeaf};
          color: ${colors.primaryLight};
          padding: 6px;
          border-radius: 50%;
          display: flex;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 35px;
        }

        .info-item {
          background: #fff;
          padding: 15px;
          border-radius: 15px;
          border: 1px solid #eee;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-header h4 {
          margin: 0;
          font-size: 16px;
          color: ${colors.moreDarkGreen};
        }

        .info-item p {
          font-size: 13px;
          color: #777;
          margin: 0;
          line-height: 1.5;
        }

        .cta-button {
          background: ${colors.primaryLight};
          color: #fff;
          padding: 15px 35px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cta-button:hover {
          background: ${colors.moreDarkGreen};
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            gap: 40px;
          }
          .title {
            font-size: 32px;
          }
          .main-img {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 50px 0;
          }
          .content-wrapper {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .image-container {
            order: 2;
            max-width: 450px;
            margin: 0 auto;
          }
          .main-img {
            height: 300px;
          }
          .text-container {
            order: 1;
          }
          .highlight-item {
            justify-content: center;
          }
          .info-grid {
            grid-template-columns: 1fr;
            text-align: left;
          }
          .title {
            font-size: 28px;
          }
          .experience-badge {
            padding: 10px 15px;
            bottom: 10px;
            right: 10px;
          }
          .exp-text {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
