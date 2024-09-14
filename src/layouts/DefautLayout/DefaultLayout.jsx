import React from 'react'
import Navbar from './Navbar/Navbar'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  )
}

export default DefaultLayout
