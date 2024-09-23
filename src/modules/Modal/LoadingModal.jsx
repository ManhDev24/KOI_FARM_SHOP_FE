// LoadingModal.js
import React from 'react';
import './loadingModal.css';

const LoadingModal = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content ">
        <div className="flex justify-center"> <img src="./img/loading.png" alt="" className='loader' /></div>
        <h3>Loading...</h3>
      </div>
    </div>
  );
};

export default LoadingModal;
