import React from "react";
import { motion } from "framer-motion";
import Header from "./Header"; // Adjust paths based on your file structure
import Footer from "./Footer";
import { User, ShoppingBag, Lock, Truck, Headphones } from "lucide-react";

const PrivacyPolicy = () => {
  const colors = {
    darkGreen: "#366e28",
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    softBg: "#f9fbf8",
  };

  const sections = [
    {
      icon: <User size={24} />,
      title: "Data We Collect",
      desc: "To process your orders, we collect your name, email, phone number, and delivery address. We only collect what is necessary to get your herbal products to your doorstep.",
    },
    {
      icon: <ShoppingBag size={24} />,
      title: "How We Use It",
      desc: "Your information is used strictly for order fulfillment, payment processing, and sending you updates about your shipment. We don't spam.",
    },
    {
      icon: <Lock size={24} />,
      title: "Secure Payments",
      desc: "We do not store your credit card or bank details. All payments are handled through secure, encrypted payment gateways to ensure your financial safety.",
    },
    {
      icon: <Truck size={24} />,
      title: "Third-Party Sharing",
      desc: "We only share your address and contact details with our trusted courier partners to ensure accurate and timely delivery of your herbal extracts.",
    },
  ];

  return (
    <>
      <Header />
      <main className="privacy-page">
        {/* Banner */}
        <section className="banner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
          >
            <span className="eyebrow">SHIVAY HERBALS</span>
            <h1>Privacy Policy</h1>
            <div className="line"></div>
          </motion.div>
        </section>

        {/* Content */}
        <section className="content">
          <div className="container grid">
            <div className="policy-list">
              {sections.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="policy-item"
                >
                  <div className="icon-box">{item.icon}</div>
                  <div className="text">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar Contact */}
            <aside className="sidebar">
              <div className="contact-card">
                <Headphones size={32} color={colors.primaryLight} />
                <h3>Privacy Concerns?</h3>
                <p>
                  If you have any questions regarding your data, feel free to
                  reach out to our privacy officer.
                </p>
                <a href="mailto:info@shivayherbals.com" className="btn">
                  Contact Support
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');

        .privacy-page {
          background: ${colors.softBg};
          font-family: "Poppins", sans-serif;
          min-height: 100vh;
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
        .eyebrow {
          color: ${colors.primaryLight};
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 3px;
        }
        .banner h1 {
          font-size: 48px;
          font-weight: 800;
          margin: 10px 0;
        }
        .line {
          width: 60px;
          height: 4px;
          background: ${colors.primaryLight};
          margin: 10px auto;
          border-radius: 2px;
        }
        .content {
          padding: 80px 0;
        }
        .grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 50px;
        }
        .policy-item {
          background: white;
          padding: 30px;
          border-radius: 20px;
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .icon-box {
          background: ${colors.softBg};
          color: ${colors.primaryLight};
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .text h3 {
          color: ${colors.moreDarkGreen};
          margin-bottom: 8px;
          font-size: 20px;
          font-weight: 700;
        }
        .text p {
          color: #666;
          line-height: 1.6;
          font-size: 15px;
        }
        .contact-card {
          background: white;
          padding: 40px;
          border-radius: 30px;
          text-align: center;
          border: 1px solid #eee;
          position: sticky;
          top: 100px;
        }
        .contact-card h3 {
          margin: 15px 0;
          color: ${colors.moreDarkGreen};
        }
        .contact-card p {
          font-size: 14px;
          color: #777;
          margin-bottom: 25px;
        }
        .btn {
          display: inline-block;
          background: ${colors.primaryLight};
          color: white;
          padding: 12px 25px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: 0.3s;
        }
        .btn:hover {
          background: ${colors.darkGreen};
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .banner h1 {
            font-size: 32px;
          }
          .contact-card {
            position: static;
          }
        }
      `}</style>
    </>
  );
};

export default PrivacyPolicy;
