import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import MessengerAndTopButton from "./MessengerVsMoveToTop/MessengerAndTopButton";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <div className="navbar sticky top-0 z-30 bg-white">
        <Navbar />
      </div>
      {children}
      <MessengerAndTopButton />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
