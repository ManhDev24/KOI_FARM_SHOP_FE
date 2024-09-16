import React from 'react'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <div className="navbar">
        <Navbar />
        <Footer/>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default DefaultLayout
