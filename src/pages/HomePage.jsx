import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";

import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />

      <AboutSection />
      <Footer />
    </>
  );
};

export default HomePage;
