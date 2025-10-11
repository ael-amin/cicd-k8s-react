import React from 'react';

const Input = ({
  label,
  id,
  error,
  className = '',
  rightElement,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`
            w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none
            transition-colors duration-200
            ${rightElement ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#012D5A]'}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;