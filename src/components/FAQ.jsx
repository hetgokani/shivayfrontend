import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Leaf, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Brand Colors
  const darkGreen = "#366e28";
  const primaryLight = "#5e9730";
  const moreDarkGreen = "#144e16";
  const offWhite = "#F0F7EE";

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // FIXED URL: Removed the 's' to match app.use("/api/faq", faqRoutes)
        const response = await axios.get(
          "https://shivaybackend.onrender.com/api/faq/all",
        );

        console.log("Data received:", response.data);

        // This filter handles both Boolean (true) and String ("ACTIVE")
        const activeFaqs = response.data.filter((item) => {
          // If isActive is explicitly false, hide it. Otherwise, show it.
          return item.isActive !== false && item.status !== "Inactive";
        });

        // Sort by order number
        const sortedData = activeFaqs.sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );

        setFaqs(sortedData);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px", color: darkGreen }}>
        Loading...
      </div>
    );

  return (
    <section
      className="faq-main-container"
      style={{
        backgroundColor: offWhite,
        marginTop: "80px",
        padding: "100px 6%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Leaf
        size={400}
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          color: darkGreen,
          opacity: 0.03,
          transform: "rotate(-15deg)",
        }}
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(54, 110, 40, 0.1)",
              padding: "8px 20px",
              borderRadius: "50px",
              color: darkGreen,
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              marginBottom: "20px",
            }}
          >
            <HelpCircle size={16} /> FAQ
          </motion.div>

          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              color: moreDarkGreen,
              fontWeight: 800,
              lineHeight: 1.2,
              margin: "0 0 20px 0",
            }}
          >
            Got Questions? We Have <br />
            <span style={{ color: primaryLight, fontStyle: "italic" }}>
              Natural Answers
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No active FAQs found.
            </p>
          ) : (
            faqs.map((faq, index) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background:
                    activeIndex === index
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)",
                  borderRadius: "24px",
                  border: `1px solid ${activeIndex === index ? primaryLight : "rgba(54, 110, 40, 0.1)"}`,
                  boxShadow:
                    activeIndex === index
                      ? "0 20px 40px -10px rgba(54, 110, 40, 0.15)"
                      : "none",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                  style={{
                    width: "100%",
                    padding: "28px 35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(17px, 2vw, 20px)",
                      fontWeight: 700,
                      color: activeIndex === index ? darkGreen : moreDarkGreen,
                    }}
                  >
                    {faq.question}
                  </span>
                  <div
                    style={{
                      minWidth: "40px",
                      height: "40px",
                      borderRadius: "14px",
                      backgroundColor:
                        activeIndex === index
                          ? darkGreen
                          : "rgba(54, 110, 40, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: activeIndex === index ? "#fff" : darkGreen,
                    }}
                  >
                    {activeIndex === index ? (
                      <Minus size={22} />
                    ) : (
                      <Plus size={22} />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div
                        style={{
                          padding: "0 35px 35px 35px",
                          color: "#555",
                          fontSize: "16px",
                          lineHeight: "1.8",
                        }}
                      >
                        <div
                          style={{
                            paddingTop: "20px",
                            borderTop: "1px solid #f0f0f0",
                          }}
                        >
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
