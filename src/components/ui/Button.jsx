import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "font-medium rounded-lg text-sm px-5 py-3 focus:outline-none transition-all duration-200 ease-in-out";
  
  const variantStyles = {
    primary: "bg-[#012D5A] hover:bg-[#023e7d] text-white shadow-sm",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  const widthStyles = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;