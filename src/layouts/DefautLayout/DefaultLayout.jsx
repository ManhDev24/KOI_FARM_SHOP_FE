import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import MessengerAndTopButton from "./MessengerVsMoveToTop/MessengerAndTopButton";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      {children}
      <MessengerAndTopButton />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
