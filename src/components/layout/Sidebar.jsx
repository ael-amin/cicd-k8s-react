import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_CONFIG } from '../../config/navigation';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'user';

  const navItems = [
    ...NAVIGATION_CONFIG.user.filter(item => !item.roleRequired || item.roleRequired === role),
    ...(role === 'admin' ? NAVIGATION_CONFIG.admin : [])
  ];

  const filteredNavItems = navItems.filter(item => {
    // hide only for admin
    if (role === 'admin' && item.label === 'Request History') return false;
    return true;
  }).map(item => ({
    ...item,
    label: item.label === 'Admin Panel' ? 'Requests Dashboard' : item.label
  }));

  return (
    <>
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${isOpen ? 'opacity-100 z-40' : 'opacity-0 -z-10'}`} onClick={() => setIsOpen(false)} />

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#012D5A] transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2 text-white">
            <Building2 className="h-8 w-8" />
            <span className="text-xl font-semibold">UM6P Portal</span>
          </div>
          <button className="lg:hidden text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.id} to={item.path} className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm rounded-lg ${
                  isActive ? 'bg-[#023e7d] text-white' : 'text-gray-100 hover:bg-[#023e7d]/50'
                }`
              }>
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
