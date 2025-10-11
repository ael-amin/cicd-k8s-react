import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StockIndicator from '../components/product/StockIndicator';

const Demande = () => {
  const { items, addDemande } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const [formData, setFormData] = useState({
    itemId: '',
    itemName: '',
    quantity: 1,
    urgency: 'normal',
    justification: '',
    configuration: {}
  });

  const handleItemSelect = (itemId) => {
    const selectedItem = items.find(item => item.id === itemId);
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        configuration: {}
      }));
      setSuggestions([]);
    }
  };

  const updateSuggestions = (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const matchedItems = items
      .filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 3);

    setSuggestions(matchedItems);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'itemName') {
      updateSuggestions(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.itemName || !formData.justification) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      const selectedItem = items.find(item => item.id === formData.itemId);
      if (selectedItem && formData.quantity > selectedItem.quantity) {
        throw new Error('Requested quantity exceeds available stock');
      }

      await addDemande({
        ...formData,
        userId: user.email,
        status: 'pending',
        date: new Date().toISOString()
      });

      toast.success('Purchase request submitted successfully');
      setFormData({
        itemId: '',
        itemName: '',
        quantity: 1,
        urgency: 'normal',
        justification: '',
        configuration: {}
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = items.find(item => item.id === formData.itemId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Purchase Request</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
              placeholder="Search or enter item name"
            />
            
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map(item => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleItemSelect(item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.price.toLocaleString()} MAD
                      </span>
                    </div>
                    {item.quantity === 0 && (
                      <span className="mt-1 inline-block px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedItem && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">{selectedItem.name}</h3>
              <span className="text-sm font-medium text-gray-900">
                {selectedItem.price.toLocaleString()} MAD
              </span>
            </div>
            <p className="text-sm text-gray-600">{selectedItem.description}</p>
            <StockIndicator quantity={selectedItem.quantity} />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max={selectedItem?.quantity || 999}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Urgency Level
          </label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Justification
          </label>
          <textarea
            name="justification"
            value={formData.justification}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
            placeholder="Please explain why you need this item..."
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
};

export default Demande;