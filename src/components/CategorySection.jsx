import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CategorySection = () => {
  const colors = {
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    textGray: "#4b5563",
  };

  const scrollRef = useRef(null);

  // Updated categories with Ayurvedic/Herbal focus - UI remains identical
  const categories = [
    {
      name: "HERBAL OILS",
      img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "AYURVEDIC TEA",
      img: "https://images.unsplash.com/photo-1544787210-2827443cb69b?auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "ESSENTIALS",
      img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "IMMUNITY",
      img: "https://images.unsplash.com/photo-1584017947486-d2fb6061386d?auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "HEALTH BALMS",
      img: "https://images.unsplash.com/photo-1601049676093-d446f6630f9a?auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "SKIN CARE",
      img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "ORGANIC SEEDS",
      img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=300&h=300",
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const moveDistance = clientWidth * 0.4;
      const scrollTo =
        direction === "left"
          ? scrollLeft - moveDistance
          : scrollLeft + moveDistance;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="category-section">
      <div className="container">
        {/* Header with Navigation */}
        <div className="header-flex">
          <div className="text-side">
            <span className="subtitle">OUR COLLECTIONS</span>
            <h2 className="title">Shop By Categories</h2>
            <div className="underline"></div>
          </div>

          <div className="nav-controls">
            <button className="nav-btn" onClick={() => scroll("left")}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-btn active" onClick={() => scroll("right")}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="slider-wrapper" ref={scrollRef}>
          {categories.map((cat, i) => (
            <motion.div key={i} className="cat-item" whileHover={{ y: -4 }}>
              <div className="image-circle">
                <img src={cat.img} alt={cat.name} />
              </div>
              <h3 className="cat-name">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-section {
          padding: 60px 0;
          background: #ffffff;
          font-family: "Poppins", sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .subtitle {
          color: ${colors.primaryLight};
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 6px;
        }

        .title {
          color: ${colors.moreDarkGreen};
          font-size: 30px;
          font-weight: 800;
          margin: 0 0 10px 0;
        }

        .underline {
          width: 50px;
          height: 4px;
          background: ${colors.primaryLight};
          border-radius: 2px;
        }

        .nav-controls {
          display: flex;
          gap: 10px;
        }

        .nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .nav-btn:hover {
          background: ${colors.primaryLight};
          color: #fff;
          border-color: ${colors.primaryLight};
        }

        /* Slider Wrapper */
        .slider-wrapper {
          display: flex;
          gap: 32px;
          overflow-x: auto;
          padding: 10px 5px;
          scroll-behavior: smooth;
          scrollbar-width: none;
        }

        .slider-wrapper::-webkit-scrollbar {
          display: none;
        }

        .cat-item {
          min-width: 135px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
        }

        .image-circle {
          width: 130px;
          height: 130px;
          margin-bottom: 12px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.03);
          transition: 0.3s ease;
        }

        .image-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-item:hover .image-circle {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(94, 151, 48, 0.15);
        }

        .cat-name {
          font-size: 13px;
          font-weight: 700;
          color: ${colors.textGray};
          margin: 0;
          width: 100%;
          text-align: center;
        }

        @media (max-width: 640px) {
          .category-section {
            padding: 40px 0;
          }

          .header-flex {
            margin-bottom: 25px;
            align-items: center;
          }

          .title {
            font-size: 24px;
          }

          .nav-btn {
            width: 34px;
            height: 34px;
          }

          .slider-wrapper {
            gap: 15px;
          }

          .cat-item {
            min-width: 90px;
          }

          .image-circle {
            width: 85px;
            height: 85px;
            margin-bottom: 8px;
          }

          .cat-name {
            font-size: 12px;
            letter-spacing: 0.2px;
          }
        }
      `}</style>
    </section>
  );
};

export default CategorySection;
