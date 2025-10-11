import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings,
  History,
  PlusCircle 
} from 'lucide-react';

export const NAVIGATION_CONFIG = {
  // Routes accessible to all authenticated users
  user: [
    {
      id: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'demande',
      path: '/demande',
      label: 'Submit Request',
      icon: ShoppingCart,
      roleRequired: 'user'  // Only show for regular users
    },
    {
      id: 'history',
      path: '/history',
      label: 'Request History',
      icon: History
    }
  ],
  
  // Additional routes only for admin users
  admin: [
    {
      id: 'admin',
      path: '/admin',
      label: 'Requests Dashboard',
      icon: Settings
    },
    {
      id: 'stock',
      path: '/stock',
      label: 'Stock Management',
      icon: Package
    },
    {
      id: 'add-product',
      path: '/add-product',
      label: 'Add Product',
      icon: PlusCircle
    }
  ]
};