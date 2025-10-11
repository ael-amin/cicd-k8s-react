import React from 'react';

const StockIndicator = ({ quantity, total = 100 }) => {
  const percentage = (quantity / total) * 100;
  
  const getBarColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (quantity === 0) return 'Out of Stock';
    if (percentage <= 20) return 'Low Stock';
    if (percentage <= 50) return 'Medium Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{quantity} available</span>
        <span>{getStatusText()}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StockIndicator;