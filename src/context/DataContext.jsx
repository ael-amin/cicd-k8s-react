import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const STORAGE_KEYS = {
  ITEMS: 'um6p_items',
  DEMANDES: 'um6p_demandes',
  NOTIFS: 'um6p_notifications',
};

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [demandes, setDemandes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEMANDES);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('um6p_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('um6p_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMANDES, JSON.stringify(demandes));
  }, [demandes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const addItem = async (newItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setItems(prev => [...prev, { ...newItem, id: Date.now() }]);
        toast.success('Item added successfully');
        resolve();
      }, 1000);
    });
  };

  const updateItem = async (updatedItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setItems(prev =>
          prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
        toast.success('Item updated successfully');
        resolve();
      }, 500);
    });
  };

  const deleteItem = async (itemId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully');
        resolve();
      }, 500);
    });
  };

  const addDemande = async (newDemande) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demandeWithDetails = {
          ...newDemande,
          id: Date.now(),
          status: 'pending',
          date: new Date().toISOString(),
          userId: newDemande.userId || 'user@um6p.ma'
        };
        setDemandes(prev => [...prev, demandeWithDetails]);

        setNotifications(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'admin',
            message: `${demandeWithDetails.userId} a soumis une demande.`,
            link: '/admin',
            timestamp: new Date().toISOString(),
            read: false
          }
        ]);

        toast.success('Purchase request submitted successfully');
        resolve();
      }, 1000);
    });
  };

  const updateDemandeStatus = async (demandeId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDemandes(prev =>
          prev.map(demande =>
            demande.id === demandeId ? { ...demande, status } : demande
          )
        );

        const demande = demandes.find(d => d.id === demandeId);
        if (status === 'accepted' && demande) {
          setItems(prev =>
            prev.map(item =>
              item.id === demande.itemId
                ? { ...item, quantity: Math.max(item.quantity - demande.quantity, 0) }
                : item
            )
          );
        }

        // 🔔 User notification
        if (demande) {
          const item = items.find(i => i.id === demande.itemId);
          setNotifications(prev => [
            ...prev,
            {
              id: Date.now(),
              type: 'user',
              userId: demande.userId,
              message: `Your request for ${item?.name || 'item'} was ${status}.`,
              link: '/history',
              timestamp: new Date().toISOString(),
              read: false
            }
          ]);
        }

        toast.success(`Request ${status} successfully`);
        resolve();
      }, 500);
    });
  };

  const getMetrics = () => {
    const totalDemandes = demandes.length;
    const accepted = demandes.filter(d => d.status === 'accepted').length;
    const rejected = demandes.filter(d => d.status === 'rejected').length;
    const pending = demandes.filter(d => d.status === 'pending').length;

    const itemRequests = demandes.reduce((acc, demande) => {
      acc[demande.itemId] = (acc[demande.itemId] || 0) + 1;
      return acc;
    }, {});

    const mostRequestedItemId = Object.entries(itemRequests)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    const mostRequestedItem = items.find(item => item.id === parseInt(mostRequestedItemId));
    const lowStockItems = items.filter(item => item.quantity <= 10);

    return {
      totalDemandes,
      accepted,
      rejected,
      pending,
      mostRequestedItem,
      lowStockItems
    };
  };
    const markAsRead = (notifId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notifId ? { ...n, read: true } : n
    ));
  };

  const value = {
    items,
    demandes,
    notifications,
    addItem,
    updateItem,
    deleteItem,
    addDemande,
    updateDemandeStatus,
    getMetrics,
    markAsRead
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const defaultItems = [
  {
    id: 1,
    name: 'ChatGPT Enterprise',
    category: 'Software',
    price: 20000,
    quantity: 50,
    description: 'Enterprise license for ChatGPT API access',
    configOptions: { support: true, warranty: true }
  },
  {
    id: 2,
    name: 'Dell XPS 15',
    category: 'Hardware',
    price: 15000,
    quantity: 25,
    description: 'High-performance laptop for developers',
    configOptions: { ram: true, storage: true, gpu: true, warranty: true }
  },
  {
    id: 3,
    name: 'HP LaserJet Pro',
    category: 'Printers',
    price: 5000,
    quantity: 15,
    description: 'Professional grade laser printer',
    configOptions: { warranty: true, support: true }
  }
];
