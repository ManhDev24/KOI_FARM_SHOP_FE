import React, { lazy, Suspense } from "react";
import Banner from "../../layouts/DefautLayout/Banner/Banner";
import Introduction from "../../layouts/DefautLayout/Introduction/Introduction";
import Categories from "../../layouts/DefautLayout/Categories/Categories";
import LoadingModal from "../../modules/Modal/LoadingModal";
const Knowledge = lazy(() =>
  import("../../layouts/DefautLayout/Knowledge/Knowledge")
);

const HomePage = () => {
  return (
    <>
      <div>
        <Banner />
        <Introduction />
        <Categories />
        <Suspense fallback={<LoadingModal isLoading={true} />}>
          <Knowledge />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
