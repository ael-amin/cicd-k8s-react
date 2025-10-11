import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const ProductConfigurator = ({ item, onClose, onSubmit }) => {
  const [config, setConfig] = useState({});
  const [quantity, setQuantity] = useState(1);

  const getBasePrice = () => item.price;

  const getConfigPrice = () => {
    let additionalCost = 0;
    
    // Calculate costs based on selected configurations
    if (item.category === 'Hardware') {
      additionalCost += config.ram === '16GB' ? 1000 : config.ram === '32GB' ? 2000 : 0;
      additionalCost += config.storage === '1TB' ? 1500 : config.storage === '2TB' ? 3000 : 0;
      additionalCost += config.gpu ? 5000 : 0;
    }

    return (getBasePrice() + additionalCost) * quantity;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      itemId: item.id,
      quantity,
      configuration: config,
      totalPrice: getConfigPrice(),
      urgency: 'normal'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {item.category === 'Hardware' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">RAM</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={config.ram || '8GB'}
                  onChange={(e) => setConfig({ ...config, ram: e.target.value })}
                >
                  <option value="8GB">8GB (+0 MAD)</option>
                  <option value="16GB">16GB (+1000 MAD)</option>
                  <option value="32GB">32GB (+2000 MAD)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Storage</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={config.storage || '512GB'}
                  onChange={(e) => setConfig({ ...config, storage: e.target.value })}
                >
                  <option value="512GB">512GB SSD (+0 MAD)</option>
                  <option value="1TB">1TB SSD (+1500 MAD)</option>
                  <option value="2TB">2TB SSD (+3000 MAD)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="gpu"
                  checked={config.gpu || false}
                  onChange={(e) => setConfig({ ...config, gpu: e.target.checked })}
                  className="h-4 w-4 text-[#012D5A] focus:ring-[#012D5A] border-gray-300 rounded"
                />
                <label htmlFor="gpu" className="text-sm font-medium text-gray-700">
                  Add Dedicated GPU (+5000 MAD)
                </label>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              max={item.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Price:</span>
              <span>{getConfigPrice().toLocaleString()} MAD</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={quantity < 1 || quantity > item.quantity}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductConfigurator;