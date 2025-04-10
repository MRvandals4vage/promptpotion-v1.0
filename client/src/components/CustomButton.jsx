import React from 'react';

const CustomButton = ({ type = 'button', onClick, className = '', children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
