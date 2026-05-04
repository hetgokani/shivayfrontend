import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MessageCircle,
  Phone,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  MapPin,
} from "lucide-react";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "Product Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const colors = {
    natureGreen: "#366e28",
    leafLight: "#5e9730",
    deepForest: "#144e16",
    bgSoft: "#f4f7f2",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (formData.phone.length < 10)
      newErrors.phone = "Enter a valid 10-digit number";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const message = `*New Inquiry from Shivay Herbals*
  
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Reason:* ${formData.reason}
*Message:* ${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918094816007?text=${encodedMessage}`, "_blank");
  };

  return (
    <section className="contact-section">
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>

      <div className="container">
        <div className="layout">
          {/* LEFT: TEXT CONTENT */}
          <motion.div
            className="text-side"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="status-badge">
              <Sparkles size={14} /> <span>Premium Support</span>
            </div>
            <h1 className="heading">
              We’d Love to <br />
              <span className="accent">Hear From You.</span>
            </h1>
            <p className="desc">
              Whether you have a question about our organic blends, need help
              with an order, or just want to say hi—we're here.
            </p>

            <div className="info-links">
              <div className="link-item">
                <span className="label">Registered Office</span>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#333",
                    fontWeight: "600",
                    lineHeight: "1.5",
                  }}
                >
                  341 Katewa Nagar New Sanganer Road <br /> Sodala Jaipur -
                  302019
                </p>
              </div>
              <div className="link-item">
                <span className="label">Official Support Emails</span>
                <a href="mailto:shivayherbal1@gmail.com">
                  shivayherbal1@gmail.com
                </a>
                <a href="mailto:vikas.shivay@hotmail.com">
                  vikas.shivay@hotmail.com
                </a>
              </div>
              <div className="link-item">
                <span className="label">Direct Line</span>
                <a
                  href="tel:+918094816007"
                  style={{ fontWeight: "700", color: colors.natureGreen }}
                >
                  +91 8094816007
                </a>
                <a
                  href="tel:+917728884825"
                  style={{ fontWeight: "700", color: colors.natureGreen }}
                >
                  +91 7728884825
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: FORM */}
          <motion.div
            className="form-wrapper"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="white-card">
              <form onSubmit={handleWhatsAppSubmit}>
                <div className="field">
                  <label>Full Name</label>
                  <div className="input-box">
                    <User size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      placeholder="Enter your name"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label style={{ color: errors.email ? "#e53e3e" : "" }}>
                      Email Address
                    </label>
                    <div
                      className="input-box"
                      style={{ borderColor: errors.email ? "#e53e3e" : "" }}
                    >
                      <Mail size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="hello@you.com"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label style={{ color: errors.phone ? "#e53e3e" : "" }}>
                      WhatsApp No.
                    </label>
                    <div
                      className="input-box"
                      style={{ borderColor: errors.phone ? "#e53e3e" : "" }}
                    >
                      <Phone size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder="10-digit number"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label>Inquiry Type</label>
                  <div className="input-box">
                    <ShoppingBag size={18} />
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                    >
                      <option>Product Question</option>
                      <option>Order Tracking</option>
                      <option>Returns/Refunds</option>
                      <option>Bulk/Gifting</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Message</label>
                  <div className="input-box align-top">
                    <MessageCircle size={18} style={{ marginTop: "4px" }} />
                    <textarea
                      name="message"
                      value={formData.message}
                      rows="3"
                      placeholder="Tell us more..."
                      required
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="whatsapp-btn"
                >
                  <div className="btn-content">
                    <WhatsAppIcon />
                    <span>Chat with Us on WhatsApp</span>
                  </div>
                  <div className="btn-arrow">
                    <ArrowRight size={20} />
                  </div>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap");

        .contact-section {
          padding: 160px 0 100px;
          background: ${colors.bgSoft};
          font-family: "Poppins", sans-serif;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
        }
        .circle-1 { width: 400px; height: 400px; background: rgba(94, 151, 48, 0.1); top: -100px; right: -50px; }
        .circle-2 { width: 300px; height: 300px; background: rgba(54, 110, 40, 0.08); bottom: -50px; left: -50px; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 30px; position: relative; z-index: 1; }
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: ${colors.leafLight};
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .heading { font-size: 56px; font-weight: 800; color: ${colors.deepForest}; line-height: 1.1; margin-bottom: 25px; }
        .accent { color: ${colors.leafLight}; }
        .desc { font-size: 18px; color: #555; line-height: 1.7; margin-bottom: 40px; max-width: 480px; }

        .info-links { display: flex; flex-direction: column; gap: 25px; }
        .link-item .label { display: block; font-size: 12px; font-weight: 700; color: #999; text-transform: uppercase; margin-bottom: 8px; }
        .link-item a { font-size: 17px; font-weight: 600; color: #333; text-decoration: none; transition: 0.3s; display: block; margin-bottom: 5px; }
        .link-item a:hover { color: ${colors.leafLight}; text-decoration: underline; }

        .white-card {
          background: #ffffff;
          padding: 50px;
          border-radius: 60px;
          box-shadow: 0 40px 100px -20px rgba(20, 78, 22, 0.15);
        }

        .field { margin-bottom: 20px; }
        .field label { display: block; font-size: 13px; font-weight: 700; color: ${colors.deepForest}; margin-bottom: 8px; margin-left: 5px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8faf7;
          border: 1px solid #edf2ec;
          padding: 14px 20px;
          border-radius: 20px;
          transition: 0.3s;
        }
        .input-box:focus-within { background: #fff; border-color: ${colors.leafLight}; box-shadow: 0 0 0 4px rgba(94, 151, 48, 0.1); }
        .input-box input, .input-box select, .input-box textarea { border: none; background: transparent; width: 100%; outline: none; font-family: "Poppins", sans-serif; font-size: 14px; color: #333; }
        .align-top { align-items: flex-start; }

        .whatsapp-btn {
          width: 100%;
          height: 64px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          border: none;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(37, 211, 102, 0.4);
          margin-top: 10px;
        }
        .btn-content { display: flex; align-items: center; gap: 12px; }
        .btn-content span { font-weight: 700; font-size: 15px; }
        .btn-arrow { background: rgba(255, 255, 255, 0.2); height: 48px; width: 48px; display: flex; align-items: center; justify-content: center; borderRadius: 15px; }

        @media (max-width: 1024px) {
          .layout { grid-template-columns: 1fr; gap: 60px; }
          .heading { font-size: 42px; text-align: center; }
          .text-side { display: flex; flex-direction: column; align-items: center; text-align: center; }
        }
        @media (max-width: 600px) {
          .contact-section { padding: 120px 0 60px; }
          .white-card { padding: 30px 20px; border-radius: 40px; }
          .field-row { grid-template-columns: 1fr; }
          .heading { font-size: 34px; }
        }
      `}</style>
    </section>
  );
};

export default Contact;
