import React from "react";
import { motion } from "framer-motion";
import Header from "./Header"; // Adjust paths based on your project structure
import Footer from "./Footer";
import {
  Scale,
  FileText,
  CreditCard,
  Truck,
  AlertTriangle,
  UserCheck,
  Globe,
  ArrowRight,
} from "lucide-react";

const TermsCondition = () => {
  const colors = {
    darkGreen: "#366e28",
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    softBg: "#f9fbf8",
  };

  const termSections = [
    {
      icon: <UserCheck size={24} />,
      title: "1. Acceptance of Terms",
      desc: "By accessing and using Shivay Herbals, you agree to comply with these terms. Our products are intended for personal use and professional herbal formulation. Misuse of products or website content is strictly prohibited.",
    },
    {
      icon: <CreditCard size={24} />,
      title: "2. Payment & Pricing",
      desc: "All prices are listed in INR. We reserve the right to change prices without notice. Payments must be cleared before dispatch. We use encrypted gateways to ensure your financial security.",
    },
    {
      icon: <Truck size={24} />,
      title: "3. Shipping & Delivery",
      desc: "We ship globally. Delivery timelines are estimates and may vary based on customs or courier delays. Once a tracking ID is generated, the risk of loss passes to the carrier.",
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "4. Product Disclaimer",
      desc: "Our herbal extracts and oils are natural products. Variations in color or aroma are normal. These products are not intended to diagnose, treat, or cure any disease. Always consult a specialist before use.",
    },
    {
      icon: <Scale size={24} />,
      title: "5. Intellectual Property",
      desc: "All content, including logos, images of herbal processes, and product descriptions, are the property of Shivay Herbals. Unauthorized reproduction is strictly prohibited.",
    },
    {
      icon: <Globe size={24} />,
      title: "6. Governing Law",
      desc: "These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in our registered location.",
    },
  ];

  return (
    <>
      <Header />
      <main className="terms-page">
        {/* Banner Section */}
        <section className="banner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
          >
            <span className="eyebrow">LEGAL FRAMEWORK</span>
            <h1>Terms & Conditions</h1>
            <div className="line"></div>
            <p className="last-updated">Last Updated: April 2026</p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="content">
          <div className="container grid">
            <div className="terms-list">
              {termSections.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="term-item"
                >
                  <div className="icon-wrapper">{item.icon}</div>
                  <div className="text-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <aside className="sidebar">
              <div className="summary-card">
                <FileText size={32} color={colors.primaryLight} />
                <h3>Quick Summary</h3>
                <p>
                  By purchasing from Shivay Herbals, you agree that our products
                  are 100% organic, sales are final, and data is handled
                  securely.
                </p>
                <ul className="mini-list">
                  <li>No unauthorized reselling</li>
                  <li>Secure encrypted payments</li>
                  <li>International shipping standards</li>
                </ul>
                <a href="/contact" className="contact-btn">
                  <span>Have Questions?</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap");

        .terms-page {
          background: ${colors.softBg};
          font-family: "Poppins", sans-serif;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 25px;
        }

        .banner {
          background: ${colors.moreDarkGreen};
          padding: 140px 0 80px;
          text-align: center;
          color: white;
        }

        .eyebrow {
          color: ${colors.primaryLight};
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .banner h1 {
          font-size: 48px;
          font-weight: 800;
          margin: 15px 0;
          letter-spacing: -1px;
        }

        .line {
          width: 60px;
          height: 4px;
          background: ${colors.primaryLight};
          margin: 0 auto 20px;
          border-radius: 2px;
        }

        .last-updated {
          font-size: 13px;
          opacity: 0.7;
          font-style: italic;
        }

        .content {
          padding: 80px 0;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .term-item {
          background: white;
          padding: 35px;
          border-radius: 30px;
          display: flex;
          gap: 25px;
          margin-bottom: 25px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
          transition: 0.3s ease;
        }

        .term-item:hover {
          transform: translateY(-5px);
          border-color: ${colors.primaryLight};
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
        }

        .icon-wrapper {
          background: ${colors.softBg};
          color: ${colors.primaryLight};
          width: 55px;
          height: 55px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .text-content h3 {
          color: ${colors.moreDarkGreen};
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .text-content p {
          color: #666;
          line-height: 1.8;
          font-size: 15px;
        }

        .summary-card {
          background: white;
          padding: 40px;
          border-radius: 40px;
          border: 1px solid #eee;
          position: sticky;
          top: 100px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
        }

        .summary-card h3 {
          margin: 15px 0;
          color: ${colors.moreDarkGreen};
          font-size: 22px;
          font-weight: 800;
        }

        .summary-card p {
          font-size: 14px;
          color: #777;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .mini-list {
          list-style: none;
          padding: 0;
          margin-bottom: 30px;
          text-align: left;
        }

        .mini-list li {
          font-size: 13px;
          font-weight: 700;
          color: #555;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mini-list li::before {
          content: "";
          width: 6px;
          height: 6px;
          background: ${colors.primaryLight};
          border-radius: 50%;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: ${colors.moreDarkGreen};
          color: white;
          padding: 18px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: 0.3s;
        }

        .contact-btn:hover {
          background: ${colors.primaryLight};
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(94, 151, 48, 0.2);
        }

        @media (max-width: 991px) {
          .grid { grid-template-columns: 1fr; }
          .banner h1 { font-size: 36px; }
          .summary-card { position: static; margin-top: 40px; }
        }
      `}</style>
    </>
  );
};

export default TermsCondition;
