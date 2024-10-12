import React, { useEffect } from "react";
import Banner from "../../layouts/DefautLayout/Banner/Banner";
import Introduction from "../../layouts/DefautLayout/Introduction/Introduction";
import Categories from "../../layouts/DefautLayout/Categories/Categories";
import Knowledge from "../../layouts/DefautLayout/Knowledge/Knowledge";
import { getLocalStorage } from "../../utils/LocalStorage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
 
  return (
    <>
      <div>
        <Banner />
        <Introduction />
        <Categories />
        <Knowledge />
      </div>
    </>
  );
};

export default HomePage;
