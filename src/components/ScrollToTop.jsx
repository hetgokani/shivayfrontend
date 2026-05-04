import React, { useState, useEffect } from "react";
import { IoIosLeaf } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setIsVisible(scrolled > 400);

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollRotation = (scrolled / scrollHeight) * 360;
        setRotation(scrollRotation);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "20px",
            zIndex: 2147483647,
            backgroundColor: "#144e16",
            color: "#ffffff",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "2px solid #5e9730",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
          aria-label="Scroll to top"
        >
          <motion.div
            style={{
              rotate: rotation,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IoIosLeaf
              size={28}
              style={{
                filter: "drop-shadow(0 0 1px rgba(255,255,255,0.6))",
                display: "block",
              }}
            />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
