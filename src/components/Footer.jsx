import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";

const Footer = () => {
  const year = new Date().getFullYear();

  const footerBg = "#144e16";
  const primaryLight = "#5e9730";
  const darkGreenAccent = "#366e28";
  const offWhite = "#F0F7EE";

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Benefits", href: "/benefits" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Return Policy", href: "/return-policy" },
    { name: "Terms & Conditions", href: "/terms-condition" },
  ];

  return (
    <footer
      style={{
        backgroundColor: footerBg,
        color: offWhite,
        padding: "80px 6% 30px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.6fr 0.8fr 1.2fr;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-heading {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 25px;
          color: white;
          position: relative;
          display: inline-block;
        }

        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 30px;
          height: 2px;
          background: ${primaryLight};
        }

        .quick-link-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(240, 247, 238, 0.7);
          text-decoration: none;
          font-size: 14px;
        }

        .quick-link-item:hover {
          color: ${primaryLight};
          transform: translateX(8px);
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
          font-size: 14px;
          color: rgba(240, 247, 238, 0.8);
        }

        .contact-icon {
          color: ${primaryLight};
          font-size: 20px;
          flex-shrink: 0;
        }

        .email-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .bottom-bar {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* TABLET RESPONSIVENESS */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 50px 30px;
          }
          
          .footer-grid > div:first-child {
             grid-column: span 2;
             max-width: 500px;
          }
        }

        /* MOBILE RESPONSIVENESS */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .footer-grid > div:first-child {
             grid-column: span 1;
             margin: 0 auto;
          }

          .footer-heading::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .quick-link-item, .contact-item {
            justify-content: center;
          }

          .contact-item {
            flex-direction: column;
            align-items: center;
          }

          .bottom-bar {
            flex-direction: column !important;
            text-align: center;
            gap: 25px;
          }
        }
      `}</style>

      <div className="footer-grid">
        {/* BRAND COLUMN */}
        <div>
          <h2
            style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}
          >
            Shivay Herbals<span style={{ color: primaryLight }}>.</span>
          </h2>
          <p
            style={{
              color: "rgba(240, 247, 238, 0.7)",
              lineHeight: "1.7",
              fontSize: "14px",
              marginBottom: "25px",
            }}
          >
            Experience the harmony of nature and science. Our premium herbal
            solutions are crafted for your peak vitality and long-term wellness.
          </p>
        </div>

        {/* QUICK LINKS COLUMN */}
        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <div style={{ marginTop: "10px" }}>
            {quickLinks.map((link) => (
              <Link key={link.name} to={link.href} className="quick-link-item">
                <IoArrowForwardOutline style={{ fontSize: "14px" }} />
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* SUPPORT & POLICY COLUMN */}
        <div>
          <h4 className="footer-heading">Support & Policy</h4>
          <div style={{ marginTop: "10px" }}>
            {policyLinks.map((link) => (
              <Link key={link.name} to={link.href} className="quick-link-item">
                <IoArrowForwardOutline style={{ fontSize: "14px" }} />
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CONTACT COLUMN */}
        <div>
          <h4 className="footer-heading">Contact Us</h4>
          <div style={{ marginTop: "10px" }}>
            <div className="contact-item">
              <IoLocationOutline className="contact-icon" />
              <span>
                341 Katewa Nagar New Sanganer Road <br />
                Sodala Jaipur - 302019
              </span>
            </div>
            <div className="contact-item">
              <IoCallOutline className="contact-icon" />
              <span>+91 80948 16007 / 77288 84825</span>
            </div>
            <div className="contact-item">
              <IoMailOutline className="contact-icon" />
              <div className="email-list">
                <span>shivayherbal1@gmail.com</span>
                <span>Vikas.shivay@hotmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bottom-bar">
        <p style={{ fontSize: "13px", color: "rgba(240, 247, 238, 0.5)" }}>
          © {year} Shivay Herbals & Healthcare. All Rights Reserved.
        </p>

        <div className="dev-credit" style={{ textAlign: "right" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: "10px 20px",
              borderRadius: "12px",
              border: `1px solid ${darkGreenAccent}`,
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 600 }}>
              Developed by{" "}
              <span style={{ color: primaryLight }}>BlackNova Tech</span>
            </div>
            <a
              href="mailto:contact.blacknovatech@gmail.com"
              style={{
                fontSize: "10px",
                fontFamily: "Poppins",
                color: "rgba(240, 247, 238, 0.6)",
                textDecoration: "none",
              }}
            >
              contact.blacknovatech@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
