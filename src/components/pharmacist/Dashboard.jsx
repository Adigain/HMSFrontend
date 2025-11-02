// ...existing code...
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({
    lowStock: 0,
    pendingOrders: 0,
    completedOrders: 0,
    total: 0
  });
  const [pharmInfo, setPharmInfo] = useState({ name: '', role: 'Pharmacist', pharmacy: 'Main Pharmacy' });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentInventory, setRecentInventory] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        setPharmInfo({
          name: user.name || 'Pharmacist',
          role: user.role || 'Pharmacist',
          pharmacy: user.pharmacy || 'Main Pharmacy'
        });

        // TODO: replace below mock with API calls to your pharmacist service
        const inv = [
          { id: 'M101', name: 'Paracetamol 500mg', quantity: 3, reorderLevel: 5, note: 'Expiring soon', lastUpdatedBy: 'Admin' },
          { id: 'M102', name: 'Amoxicillin 250mg', quantity: 12, reorderLevel: 10 }
        ];
        const orders = [
          { id: 201, patientName: 'A. Khan', status: 'Pending', date: '2025-10-30' },
          { id: 202, patientName: 'S. Patel', status: 'Processing', date: '2025-10-29' }
        ];
        const completed = [
          { id: 150, patientName: 'R. Singh', status: 'Completed', date: '2025-10-25' }
        ];

        const lowStockCount = inv.filter(i => (i.quantity ?? 0) <= (i.reorderLevel ?? 5)).length;
        const pendingCount = orders.filter(o => (o.status || '').toLowerCase() === 'pending').length;
        const completedCount = completed.length;

        setCounts({ lowStock: lowStockCount, pendingOrders: pendingCount, completedOrders: completedCount, total: lowStockCount + pendingCount + completedCount });
        setRecentInventory(inv.slice(0, 3));
        setRecentOrders(orders.slice(0, 3));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleCardClick = (id) => {
    if (id === 'lowStock') navigate('/pharmacist/medicine_inventry');
    else if (id === 'pendingOrders') navigate('/pharmacist/medicine_order');
    else if (id === 'completedOrders') navigate('/pharmacist/medicine_order');
  };

  const cards = [
    { id: 'lowStock', title: 'Low Stock', count: counts.lowStock, icon: <ShoppingBagIcon className="h-8 w-8 text-yellow-500" />, color: 'bg-yellow-50 border-yellow-100', textColor: 'text-yellow-900' },
    { id: 'pendingOrders', title: 'Pending Orders', count: counts.pendingOrders, icon: <ShoppingCartIcon className="h-8 w-8 text-blue-500" />, color: 'bg-blue-50 border-blue-100', textColor: 'text-blue-900' },
    { id: 'completedOrders', title: 'Completed Orders', count: counts.completedOrders, icon: <CheckIcon className="h-8 w-8 text-green-500" />, color: 'bg-green-50 border-green-100', textColor: 'text-green-900' }
  ];

  const quickActions = [
    { title: 'Medicine Inventory', icon: <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />, path: '/pharmacist/medicine_inventry', description: 'View and manage stock' },
    { title: 'Medicine Orders', icon: <DocumentTextIcon className="h-6 w-6 text-green-500" />, path: '/pharmacist/medicine_order', description: 'Process and fulfill orders' },
    { title: 'My Profile', icon: <UserIcon className="h-6 w-6 text-purple-500" />, path: '/pharmacist/profile', description: 'Update your details' }
  ];

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-md mb-8 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center"><HomeIcon className="h-7 w-7 mr-2" /> Welcome, {pharmInfo.name.split(' ')[0]}</h1>
            <p className="mt-1 text-indigo-100">{pharmInfo.role} • {pharmInfo.pharmacy}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-1 text-white font-medium">Keep medicines flowing!</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 mb-6"><p>{error}</p></div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {cards.map(card => (
              <div key={card.id} onClick={() => handleCardClick(card.id)} className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 ${card.color} hover:shadow-xl`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className={`text-5xl font-bold ${card.textColor}`}>{card.count}</p>
                  </div>
                  <div className="p-2">{card.icon}</div>
                </div>
                <div className="mt-6 flex items-center text-gray-700">
                  <span className="text-sm">View details</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action, idx) => (
                  <Link key={idx} to={action.path} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 transition-colors">
                    <div className="p-3 rounded-full bg-gray-100 mb-2">{action.icon}</div>
                    <h3 className="text-sm font-medium text-gray-900 text-center">{action.title}</h3>
                    <p className="text-xs text-gray-500 text-center mt-1 hidden sm:block">{action.description}</p>
                  </Link>
                ))}
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                  <div className="p-3 rounded-full bg-gray-100 mb-2"><CalendarDaysIcon className="h-6 w-6" /></div>
                  <h3 className="text-sm font-medium text-center">Schedule Delivery</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link to="/pharmacist/medicine_order" className="text-sm text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">No recent orders.</div>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.id} className="flex p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <ShoppingCartIcon className="h-6 w-6 text-indigo-500" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                          <span className="text-xs text-gray-500">Req: {order.date || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">Patient: {order.patientName || 'N/A'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Inventory Changes</h2>
              <Link to="/pharmacist/medicine_inventry" className="text-sm text-indigo-600 hover:text-indigo-700">View All</Link>
            </div>
            <div className="space-y-4">
              {recentInventory.length === 0 ? (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">No recent inventory items.</div>
              ) : (
                recentInventory.map(item => (
                  <div key={item.id} className="flex flex-col md:flex-row border-l-4 border-indigo-400 bg-indigo-50/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center mr-4">
                      <div className="bg-indigo-100 p-2 rounded-full mb-2"><ShoppingBagIcon className="h-8 w-8 text-indigo-600" /></div>
                      <span className="text-xs text-gray-400 font-mono">#{item.id}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-2">
                        <div>
                          <span className="font-semibold text-gray-900 text-base">{item.name}</span>
                          <span className="ml-2 text-xs text-gray-400">Qty: {item.quantity ?? 'N/A'}</span>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">Reorder: {item.reorderLevel ?? 'N/A'}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium line-clamp-2">{item.note || ''}</p>
                        {item.lastUpdatedBy && <p className="text-xs text-gray-400 mt-1">Updated by {item.lastUpdatedBy}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
// ...existing code...