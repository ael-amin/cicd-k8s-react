import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import StockIndicator from './StockIndicator';
import ProductConfigurator from './ProductConfigurator';

const ItemCard = ({ item }) => {
  const { addDemande } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfigurator, setShowConfigurator] = useState(false);

  const handleRequest = () => {
    if (item.quantity === 0) {
      toast.error('This item is out of stock');
      return;
    }
    setShowConfigurator(true);
  };

  const handleConfigSubmit = async (config) => {
    setLoading(true);
    try {
      await addDemande(config);
      setShowConfigurator(false);
      toast.success('Demande envoyée avec succès ' + item.name);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Échec de l\'envoi de la demande ' + item.name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
        <p className="text-gray-600">{item.description}</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Base Price: {item.price.toLocaleString()} MAD</span>
          </div>

          <StockIndicator quantity={item.quantity} />
          
          {user.role === 'user' && (
            <button
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                item.quantity === 0 || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#012D5A] text-white hover:bg-[#023e7d]'
              }`}
              onClick={handleRequest}
              disabled={item.quantity === 0 || loading}
            >
              {loading
                ? 'Processing...'
                : item.quantity === 0
                ? 'Out of Stock'
                : 'Configure & Request'}
            </button>
          )}
        </div>
      </div>

      {showConfigurator && (
        <ProductConfigurator
          item={item}
          onClose={() => setShowConfigurator(false)}
          onSubmit={handleConfigSubmit}
        />
      )}
    </>
  );
};

export default ItemCard