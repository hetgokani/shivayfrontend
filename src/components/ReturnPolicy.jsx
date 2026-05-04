import React from "react";
import { motion } from "framer-motion";
import Header from "./Header"; // Adjust paths based on your project structure
import Footer from "./Footer";
import { ShieldCheck, PackageX, AlertCircle, HelpCircle } from "lucide-react";

const ReturnPolicy = () => {
  const colors = {
    darkGreen: "#366e28",
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    softBg: "#f9fbf8",
  };

  const policyPoints = [
    {
      icon: <PackageX size={28} />,
      title: "Strict No-Return Policy",
      desc: "Due to the sensitive nature of herbal extracts and essential oils, we do not accept returns once the product has been dispatched. This ensures the chemical integrity and hygiene of our supplies for all global clients.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Final Sale Agreement",
      desc: "All purchases of Essential Oils, Herbal Extracts, and PG Extracts are final. As an ISO 9001:2008 certified leader, we maintain a closed-loop supply chain that cannot accommodate returned items.",
    },
    {
      icon: <AlertCircle size={28} />,
      title: "Damaged Goods",
      desc: "In the rare event of transit damage, please record an unboxing video and contact us within 24 hours. We will investigate and provide a resolution based on the evidence provided.",
    },
  ];

  return (
    <>
      <Header />
      <div className="policy-wrapper">
        {/* Banner Section */}
        <section className="banner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
          >
            <span className="subtitle">TRANSPARENCY</span>
            <h1>Refund & Return Policy</h1>
            <div className="line"></div>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="content-body">
          <div className="container grid">
            <div className="main-content">
              {policyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="policy-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="icon-container">{point.icon}</div>
                  <div className="text-container">
                    <h3>{point.title}</h3>
                    <p>{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar Support */}
            <aside className="sidebar">
              <div className="support-card">
                <HelpCircle size={40} color={colors.primaryLight} />
                <h4>Need Clarification?</h4>
                <p>
                  Our team is here to help you understand our quality protocols.
                </p>
                <a href="mailto:shivayherbal1@gmail.com" className="email-link">
                  shivayherbal1@gmail.com
                </a>
                <br />
                <br />
                <a
                  href="mailto:vikas.shivay@hotmail.com"
                  className="email-link"
                >
                  vikas.shivay@hotmail.com
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
      <Footer />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap");

        .policy-wrapper {
          background: ${colors.softBg};
          font-family: "Poppins", sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .banner {
          background: ${colors.moreDarkGreen};
          padding: 100px 0 60px;
          text-align: center;
          color: white;
        }

        .subtitle {
          color: ${colors.primaryLight};
          letter-spacing: 3px;
          font-weight: 700;
          font-size: 14px;
        }

        .banner h1 {
          font-size: 45px;
          margin: 15px 0;
          font-weight: 800;
        }

        .line {
          width: 80px;
          height: 4px;
          background: ${colors.primaryLight};
          margin: 0 auto;
          border-radius: 2px;
        }

        .content-body {
          padding: 80px 0;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 50px;
        }

        .policy-card {
          background: white;
          padding: 35px;
          border-radius: 24px;
          display: flex;
          gap: 25px;
          margin-bottom: 25px;
          border: 1px solid #eef2ed;
        }

        .icon-container {
          background: ${colors.softBg};
          color: ${colors.primaryLight};
          width: 65px;
          height: 65px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .text-container h3 {
          color: ${colors.moreDarkGreen};
          font-size: 22px;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .text-container p {
          color: #555;
          line-height: 1.8;
          font-size: 15px;
        }

        .support-card {
          background: white;
          padding: 40px;
          border-radius: 30px;
          text-align: center;
          border: 2px dashed ${colors.primaryLight};
          position: sticky;
          top: 120px;
        }

        .support-card h4 {
          margin: 20px 0 10px;
          color: ${colors.moreDarkGreen};
          font-size: 20px;
        }

        .support-card p {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        .email-link {
          color: ${colors.primaryLight};
          font-weight: 700;
          text-decoration: underline;
        }

        @media (max-width: 991px) {
          .grid { grid-template-columns: 1fr; }
          .banner h1 { font-size: 32px; }
          .support-card { position: static; }
        }
      `}</style>
    </>
  );
};

export default ReturnPolicy;
