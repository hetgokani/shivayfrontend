import React from "react";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Award, Truck } from "lucide-react";

const FeaturesSection = () => {
  const colors = {
    darkGreen: "#366e28",
    primaryLight: "#5e9730",
    moreDarkGreen: "#144e16",
    iconBg: "rgba(94, 151, 48, 0.12)",
    sectionBg: "#f9fbf8",
    borderColor: "#d1e2c9",
  };

  const features = [
    {
      icon: <Leaf size={32} />,
      title: "100% NATURAL",
      desc: "Made with pure herbal ingredients for your safety.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "SAFE & EFFECTIVE",
      desc: "Scientifically formulated to give you results.",
    },
    {
      icon: <Award size={32} />,
      title: "TRUSTED QUALITY",
      desc: "Trusted by thousands for a healthier lifestyle.",
    },
    {
      icon: <Truck size={32} />,
      title: "FAST DELIVERY",
      desc: "Quick and secure delivery right to your door.",
    },
  ];

  return (
    <section className="features-section">
      <div className="wave-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#366e28"
            fillOpacity="1"
            d="M0,192L60,202.7C120,213,240,235,360,213.3C480,192,600,128,720,101.3C840,75,960,85,1080,112C1200,139,1320,181,1380,202.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="container">
        <div className="section-header">
          <span className="subtitle">OUR PROMISE</span>
          <h2 className="title">Why Choose Us</h2>
          <div className="underline"></div>
        </div>

        <div className="grid-layout">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="icon-wrapper">{item.icon}</div>

              <div className="text-box">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features-section {
          padding-bottom: 60px;
          background: ${colors.sectionBg};
          font-family: "Poppins", sans-serif;
          position: relative;
        }

        .wave-container {
          width: 100%;
          height: 180px;
          overflow: hidden;
          line-height: 0;
          margin-bottom: 20px;
        }

        .wave-container svg {
          width: 100%;
          height: 100%;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .subtitle {
          color: ${colors.primaryLight};
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 8px;
        }

        .title {
          color: ${colors.moreDarkGreen};
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .underline {
          width: 70px;
          height: 4px;
          background: ${colors.primaryLight};
          margin: 0 auto;
          border-radius: 2px;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .feature-card {
          position: relative;
          background: transparent; /* Changed from #ffffff to match screenshot */
          border: none; /* BORDER REMOVED */
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start; /* Left aligned icon/text like screenshot */
          text-align: left;
          transition: none; /* HOVER REMOVED */
        }

        .icon-wrapper {
          width: 70px;
          height: 70px;
          background: ${colors.iconBg};
          color: ${colors.primaryLight};
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .text-box h3 {
          font-size: 17px;
          font-weight: 700;
          color: ${colors.moreDarkGreen};
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .text-box p {
          font-size: 15px;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
          .title {
            font-size: 34px;
          }
        }

        @media (max-width: 640px) {
          .grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .feature-card {
            padding: 15px 10px;
          }
          .title {
            font-size: 28px;
          }
          .text-box h3 {
            font-size: 14px;
          }
          .text-box p {
            font-size: 12px;
          }
          .icon-wrapper {
            width: 60px;
            height: 60px;
          }
          .wave-container {
            height: 100px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
