import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addItem } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Software',
    price: '',
    quantity: '',
    description: '',
    configurations: {
      ram: false,
      storage: false,
      gpu: false,
      warranty: false,
      support: false,
      license: false,
      resolution: false,
      paperType: false
    }
  });

  const categoryConfigs = {
    Software: ['support', 'warranty', 'license'],
    Hardware: ['ram', 'storage', 'gpu', 'warranty'],
    Printers: ['warranty', 'support', 'resolution', 'paperType']
  };

  const configLabels = {
    ram: 'RAM Options (8GB, 16GB, 32GB)',
    storage: 'Storage Options (512GB, 1TB, 2TB)',
    gpu: 'GPU Option',
    warranty: 'Extended Warranty',
    support: 'Premium Support',
    license: 'License Type (Individual, Team, Enterprise)',
    resolution: 'Print Resolution (300dpi, 600dpi, 1200dpi)',
    paperType: 'Paper Type Support (A4, A3, Legal)'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.price || !formData.quantity || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      const selectedConfigs = Object.entries(formData.configurations)
        .filter(([key, value]) => value)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {});

      await addItem({
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        configOptions: selectedConfigs
      });

      toast.success('Product added successfully');
      navigate('/stock');
    } catch (error) {
      toast.error(error.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('config_')) {
      const configName = name.replace('config_', '');
      setFormData(prev => ({
        ...prev,
        configurations: {
          ...prev.configurations,
          [configName]: checked
        }
      }));
    } else if (name === 'category') {
      // Reset configurations when category changes
      const newConfigs = {};
      Object.keys(formData.configurations).forEach(key => {
        newConfigs[key] = false;
      });
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        configurations: newConfigs
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const availableConfigs = categoryConfigs[formData.category] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/stock')}
        >
          Back to Stock
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter product name"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
            required
          >
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Printers">Printers</option>
          </select>
        </div>

        <Input
          label="Base Price (MAD)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          placeholder="Enter base price"
        />

        <Input
          label="Initial Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
          placeholder="Enter initial quantity"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
            required
            placeholder="Enter product description"
          ></textarea>
        </div>

        {availableConfigs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Configuration Options for {formData.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableConfigs.map(configKey => (
                <label key={configKey} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name={`config_${configKey}`}
                    checked={formData.configurations[configKey]}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#012D5A] focus:ring-[#012D5A] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{configLabels[configKey]}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/stock')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;