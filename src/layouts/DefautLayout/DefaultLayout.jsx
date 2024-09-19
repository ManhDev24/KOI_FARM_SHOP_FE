import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default DefaultLayout;
