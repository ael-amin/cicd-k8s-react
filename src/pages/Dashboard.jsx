import React, { useState } from 'react';
import { ShoppingBag, Monitor, Printer, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import ItemCard from '../components/product/ItemCard';

const CategorySection = ({ title, items, icon: Icon }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-2">
      <Icon className="h-6 w-6 text-[#012D5A]" />
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const { items } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = {
    Software: filteredItems.filter(item => item.category === 'Software'),
    Hardware: filteredItems.filter(item => item.category === 'Hardware'),
    Printers: filteredItems.filter(item => item.category === 'Printers')
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
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
          <option value="All">All Categories</option>
          <option value="Software">Software</option>
          <option value="Hardware">Hardware</option>
          <option value="Printers">Printers</option>
        </select>
      </div>

      <div className="space-y-12">
        {Object.entries(categories).map(([category, items]) => items.length > 0 && (
          <CategorySection
            key={category}
            title={`${category}`}
            items={items}
            icon={
              category === 'Software' ? ShoppingBag :
              category === 'Hardware' ? Monitor : Printer
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;