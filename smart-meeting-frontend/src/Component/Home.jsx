import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import CoreFeatures from "./CoreFeatures";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <div id="hero">
        <Hero />
      </div>

      <div id="about">
        <AboutUs />
      </div>

      <div id="features">
        <CoreFeatures />
      </div>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
