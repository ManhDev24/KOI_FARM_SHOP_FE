import React from 'react'
import Banner from '../../layouts/DefautLayout/Banner/Banner';
import Introduction from '../../layouts/DefautLayout/Introduction/Introduction';
import Categories from '../../layouts/DefautLayout/Categories/Categories';
import Knowledge from '../../layouts/DefautLayout/Knowledge/Knowledge';



const HomePage = () => {
  return (
    <>
      <div>
        <Banner />        
        <Introduction />
        <Categories/>
        <Knowledge />
      </div>
    </>
  );

}

export default HomePage
