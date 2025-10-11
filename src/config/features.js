// Feature flags configuration
export const FEATURES = {
  HISTORY: true,
  METRICS: true,
  STOCK_MANAGEMENT: true,
  ADD_PRODUCT: true
};

// Role-based access configuration
export const ROLE_ACCESS = {
  user: {
    routes: ['/dashboard', '/demande', '/history', '/stock'],
    features: ['HISTORY', 'STOCK_MANAGEMENT']
  },
  admin: {
    routes: ['/dashboard', '/demande', '/history', '/stock', '/admin', '/add-product'],
    features: ['HISTORY', 'METRICS', 'STOCK_MANAGEMENT', 'ADD_PRODUCT']
  }
};

// Navigation configuration
export const NAVIGATION_CONFIG = {
  user: [
    {
      id: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      feature: null // Always visible
    },
    {
      id: 'demande',
      path: '/demande',
      label: 'Purchase Requests',
      icon: 'ShoppingCart',
      feature: null
    },
    {
      id: 'history',
      path: '/history',
      label: 'Purchase History',
      icon: 'History',
      feature: 'HISTORY'
    },
    {
      id: 'stock',
      path: '/stock',
      label: 'Stock Management',
      icon: 'Package',
      feature: 'STOCK_MANAGEMENT'
    }
  ],
  admin: [
    {
      id: 'admin',
      path: '/admin',
      label: 'Admin Panel',
      icon: 'Settings',
      feature: null
    },
    {
      id: 'add-product',
      path: '/add-product',
      label: 'Add Product',
      icon: 'PlusCircle',
      feature: 'ADD_PRODUCT'
    }
  ]
};

// Form field configurations
export const FORM_CONFIGS = {
  addProduct: {
    fields: [
      {
        name: 'name',
        label: 'Product Name',
        type: 'text',
        required: true
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: ['Software', 'Hardware', 'Printers'],
        required: true
      },
      {
        name: 'price',
        label: 'Price (MAD)',
        type: 'number',
        required: true,
        min: 0,
        step: 0.01
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
        min: 0
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },
  demande: {
    fields: [
      {
        name: 'itemName',
        label: 'Item Name',
        type: 'text',
        required: true
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
        min: 1
      },
      {
        name: 'urgency',
        label: 'Urgency Level',
        type: 'select',
        options: ['low', 'normal', 'high', 'urgent'],
        required: true
      },
      {
        name: 'justification',
        label: 'Justification',
        type: 'textarea',
        required: true,
        rows: 4
      }
    ]
  }
};