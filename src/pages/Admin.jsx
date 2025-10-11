import React, { useState } from 'react';
import { Package, ShoppingCart, Settings, TrendingUp, Download, User, Filter, AlertTriangle, TrendingDown, Ban, XCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Papa from 'papaparse';

const MetricsCard = ({ title, value, icon: Icon, color = 'text-[#012D5A]', alert = false }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${alert ? 'border-red-500' : 'border-[#012D5A]'}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
      </div>
      <div className="relative">
        <Icon className={`h-10 w-10 ${color}`} />
        {alert && value > 0 && (
          <AlertTriangle className="h-4 w-4 text-red-500 absolute -top-1 -right-1" />
        )}
      </div>
    </div>
  </div>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedUser, setSelectedUser] = useState('All');
  const { demandes, items, updateDemandeStatus, getMetrics, updateItem } = useData();
  const metrics = getMetrics();

  // Get unique users for filtering
  const uniqueUsers = ['All', ...new Set(demandes.map(d => d.userId))];

  // Filter demandes by selected user
  const filteredDemandes = selectedUser === 'All' 
    ? demandes 
    : demandes.filter(d => d.userId === selectedUser);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (demandeId, status) => {
    const demande = demandes.find(d => d.id === demandeId);
    if (demande && status === 'accepted') {
      // Auto stock deduction when accepting request
      const item = items.find(i => i.id === demande.itemId);
      if (item) {
        const newQuantity = Math.max(0, item.quantity - demande.quantity);
        await updateItem({
          ...item,
          quantity: newQuantity
        });
      }
    }
    await updateDemandeStatus(demandeId, status);
  };

  const handleExportCSV = (userEmail = null) => {
    const dataToExport = userEmail 
      ? demandes.filter(d => d.userId === userEmail)
      : demandes;

    const data = dataToExport.map(demande => {
      const item = items.find(i => i.id === demande.itemId);
      return {
        id: demande.id,
        user_email: demande.userId,
        item_name: item?.name || 'Unknown Item',
        quantity: demande.quantity,
        configuration: JSON.stringify(demande.configuration || {}),
        status: demande.status,
        urgency: demande.urgency || 'normal',
        date: new Date(demande.date).toLocaleDateString(),
        total_price: demande.totalPrice?.toLocaleString() || 'N/A'
      };
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = userEmail 
      ? `requests_${userEmail.replace('@', '_')}_${new Date().toISOString().split('T')[0]}.csv`
      : `all_requests_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupedByUser = demandes.reduce((acc, demande) => {
    if (!acc[demande.userId]) {
      acc[demande.userId] = [];
    }
    acc[demande.userId].push(demande);
    return acc;
  }, {});

  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Requests Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Requests"
          value={metrics.totalDemandes}
          icon={ShoppingCart}
        />
        <MetricsCard
          title="Accepted Requests"
          value={metrics.accepted}
          icon={TrendingUp}
          color="text-green-600"
        />
        <MetricsCard
          title="Pending Requests"
          value={metrics.pending}
          icon={Package}
          color="text-yellow-600"
        />
        <MetricsCard
          title="Rejected Requests"
          value={metrics.rejected}
          icon={XCircle}
          color="text-red-600"
        />
        {/* <MetricsCard
          title="Most Requested Item"
          value={metrics.mostRequestedItem?.name || 'N/A'}
          icon={Settings}
          color="text-purple-600"
          alert={!metrics.mostRequestedItem}
        />
        <MetricsCard
          title="Low Stock Items"
          value={metrics.lowStockItems.length}
          icon={AlertTriangle}
          color="text-red-600"
          alert={metrics.lowStockItems.length > 0}
        />
        <MetricsCard
          title="Total Items"
          value={items.length}
          icon={Package}
          color="text-blue-600"
        />
        <MetricsCard
          title="Total Users"
          value={uniqueUsers.length - 1} // Exclude "All" option
          icon={User}
          color="text-gray-600"
        /> */}
      </div>


      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-[#012D5A] text-[#012D5A]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Purchase Requests</span>
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'stock'
              ? 'border-[#012D5A] text-[#012D5A]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('stock')}
        >
          <AlertTriangle className="h-5 w-5" />
          <span>Low Stock Items</span>
          {metrics.lowStockItems.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
              {metrics.lowStockItems.length}
            </span>
          )}
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-[#012D5A] text-[#012D5A]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          <User className="h-5 w-5" />
          <span>User History</span>
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012D5A] focus:border-transparent"
              >
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>
                    {user === 'All' ? 'All Users' : user}
                  </option>
                ))}
              </select>
            </div>
            {/* {selectedUser !== 'All' && (
              <Button
                onClick={() => handleExportCSV(selectedUser)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV for {selectedUser}</span>
              </Button>
            )} */}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Configuration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
<tbody className="bg-white divide-y divide-gray-200">
  {filteredDemandes.map((demande) => {
    const item = items.find(i => i.id === demande.itemId);
    return (
      <tr key={demande.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {demande.userId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{item?.name}</div>
          <div className="text-sm text-gray-500">{new Date(demande.date).toLocaleDateString()}</div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {demande.configuration && Object.keys(demande.configuration).length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(demande.configuration).map(([key, value]) => (
                <li key={key} className="text-xs">{`${key}: ${value}`}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400">Standard</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {demande.quantity}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyBadgeClass(demande.urgency)}`}>
            {demande.urgency || 'normal'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(demande.status)}`}>
            {demande.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
          {demande.status === 'pending' && (
            <div className="flex space-x-2 mb-1">
              <button
                onClick={() => handleStatusUpdate(demande.id, 'accepted')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs font-medium"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(demande.id, 'rejected')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs font-medium"
              >
                Reject
              </button>
            </div>
          )}

                  {/* ✅ Export CSV for this user */}
                  <button
                    onClick={() => handleExportCSV(demande.userId)}
                    className="inline-flex items-center text-blue-600 hover:underline text-xs mt-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
    
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Low Stock Items</span>
          </h2>
          <div className="space-y-4">
            {metrics.lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No low stock items - all inventory levels are healthy!</p>
              </div>
            ) : (
              metrics.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-sm text-red-600 font-medium">Only {item.quantity} units remaining</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      Low Stock
                    </span>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {Object.entries(groupedByUser).map(([userId, userDemandes]) => (
            <div key={userId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-[#012D5A]" />
                  <h3 className="text-lg font-semibold text-gray-900">{userId}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {userDemandes.length} requests
                  </span>
                </div>
                {/* <Button
                  onClick={() => handleExportCSV(userId)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button> */}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {userDemandes.filter(d => d.status === 'accepted').length}
                  </div>
                  <div className="text-sm text-green-600">Accepted</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {userDemandes.filter(d => d.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {userDemandes.filter(d => d.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-600">Rejected</div>
                </div>
              </div>

              <div className="space-y-2">
                {userDemandes.slice(0, 3).map(demande => {
                  const item = items.find(i => i.id === demande.itemId);
                  return (
                    <div key={demande.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item?.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          Qty: {demande.quantity}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                       <span className="text-sm text-gray-500">
                        {new Date(demande.date).toLocaleString()}
                      </span>

                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(demande.status)}`}>
                          {demande.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {userDemandes.length > 3 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    ... and {userDemandes.length - 3} more requests
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;