import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Papa from 'papaparse';

const History = () => {
  const { demandes, items } = useData();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter demandes based on user role
  const userDemandes = user.role === 'admin' 
    ? demandes 
    : demandes.filter(demande => demande.userId === user.email);

  // Apply status filter
  const filteredDemandes = statusFilter === 'All' 
    ? userDemandes 
    : userDemandes.filter(d => d.status === statusFilter);

  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'accepted':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
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

  const getItemName = (itemId) => {
    return items.find(item => item.id === itemId)?.name || 'Unknown Item';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportCSV = () => {
    const data = filteredDemandes.map(demande => {
      const item = items.find(i => i.id === demande.itemId);
      return {
        id: demande.id,
        user_email: demande.userId,
        item_name: item?.name || 'Unknown Item',
        quantity: demande.quantity,
        urgency: demande.urgency || 'normal',
        status: demande.status,
        date: new Date(demande.date).toLocaleDateString(),
        configuration: JSON.stringify(demande.configuration || {}),
        total_price: demande.totalPrice?.toLocaleString() || 'N/A'
      };
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = user.role === 'admin' 
      ? `all_purchase_history_${new Date().toISOString().split('T')[0]}.csv`
      : `my_purchase_history_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusCounts = {
    total: userDemandes.length,
    accepted: userDemandes.filter(d => d.status === 'accepted').length,
    pending: userDemandes.filter(d => d.status === 'pending').length,
    rejected: userDemandes.filter(d => d.status === 'rejected').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'admin' ? 'All Purchase History' : 'My Purchase History'}
        </h1>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <Filter className="h-5 w-5 text-gray-500" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012D5A] focus:border-transparent"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <span className="text-sm text-gray-500">
          Showing {filteredDemandes.length} of {userDemandes.length} requests
        </span>
      </div>

      {filteredDemandes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No purchase requests found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {user.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Configuration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDemandes.map((demande) => (
                <tr key={demande.id} className="hover:bg-gray-50">
                  {user.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {demande.userId}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getItemName(demande.itemId)}
                    </div>
                    {demande.totalPrice && (
                      <div className="text-sm text-gray-500">
                        {demande.totalPrice.toLocaleString()} MAD
                      </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(demande.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClass(demande.status)}>
                      {demande.status.charAt(0).toUpperCase() + demande.status.slice(1)}
                    </span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;