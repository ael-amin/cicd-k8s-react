import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

const Stock = () => {
  const navigate = useNavigate();
  const { items, updateItem, deleteItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const categories = ['All', 'Software', 'Hardware', 'Printers'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = filteredItems.filter(item => item.quantity <= 10);
  const regularItems = filteredItems.filter(item => item.quantity > 10);

  const handleQuantityChange = async (itemId, newQuantity) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      await updateItem({
        ...item,
        quantity: parseInt(newQuantity)
      });
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.item) {
      try {
        await deleteItem(deleteModal.item.id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
    setDeleteModal({ isOpen: false, item: null });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    if (quantity <= 10) return { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', class: 'bg-green-100 text-green-800' };
  };

  const ItemTable = ({ items, title, showWarning = false }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          {showWarning && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">({items.length} items)</span>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          {showWarning ? 'No low stock items - inventory levels are healthy!' : 'No items in this category'}
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (MAD)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const status = getStockStatus(item.quantity);
              return (
                <tr key={item.id} className={showWarning ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-[#012D5A] focus:border-transparent"
                        onBlur={() => setEditingItem(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingItem(null)}
                        autoFocus
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingItem(item.id)} 
                        className="cursor-pointer hover:text-[#012D5A] hover:underline"
                        title="Click to edit quantity"
                      >
                        {item.quantity}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingItem(item.id)}
                        className="text-[#012D5A] hover:text-[#023e7d] transition-colors"
                        title="Edit quantity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
        <Button onClick={() => navigate('/add-product')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012D5A] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012D5A] focus:border-transparent"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {lowStockItems.length > 0 && (
        <ItemTable 
          items={lowStockItems} 
          title="⚠️ Low Stock Items (≤10 units)" 
          showWarning={true}
        />
      )}

      <ItemTable 
        items={regularItems} 
        title="Regular Stock Items"
      />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-gray-900 font-medium">
                Are you sure you want to delete "{deleteModal.item?.name}"?
              </p>
              <p className="text-gray-600 text-sm">
                This action cannot be undone and will permanently remove this product from your inventory.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, item: null })}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stock;