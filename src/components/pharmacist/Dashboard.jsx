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
import axios from "axios";
import { toast } from "react-toastify";

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

  const BASE_URL = "http://localhost:8080/api/medicine-orders";

  const fetchOrders = async () => {
    const { data } = await axios.get(BASE_URL);
    return data;
  };

  const updateOrderStatus = async (id, status) => {
    await axios.put(`${BASE_URL}/${id}/status?status=${status}`);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ set pharmacist info from local storage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        setPharmInfo({
          name: user.name || 'Pharmacist',
          role: user.role || 'Pharmacist',
          pharmacy: user.pharmacy || 'Main Pharmacy'
        });

        // ✅ Fetch orders from backend
        const orders = await fetchOrders();
        const pendingOrders = orders.filter(o => (o.status || "").toLowerCase() === "pending");
        const completedOrders = orders.filter(o => (o.status || "").toLowerCase() === "completed");

        setCounts({
          lowStock: 0,
          pendingOrders: pendingOrders.length,
          completedOrders: completedOrders.length,
          total: orders.length
        });

        setRecentOrders(orders.slice(-5).reverse()); // last 5 orders

      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleCardClick = (id) => {
    if (id === 'lowStock') navigate('/pharmacist/medicine_inventry');
    else navigate('/pharmacist/medicine_order');
  };

  const cards = [
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
      {/* ✅ Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-md mb-8 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center"><HomeIcon className="h-7 w-7 mr-2" /> Welcome, {pharmInfo.name.split(' ')[0]}</h1>
            <p className="mt-1 text-indigo-100">{pharmInfo.role} • {pharmInfo.pharmacy}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100">{new Date().toLocaleDateString()}</p>
            <p className="mt-1 text-white font-medium">Keep medicines flowing!</p>
          </div>
        </div>
      </div>

      {/* ✅ Loading / Error */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* ✅ Cards */}
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
              </div>
            ))}
          </div>

          {/* ✅ Pending Orders */}
          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>

            {recentOrders.filter(o => (o.status || "").toLowerCase() !== "completed").length === 0 ? (
              <p className="text-gray-500 text-center">No pending orders 🎉</p>
            ) : (
              recentOrders
                .filter(o => (o.status || "").toLowerCase() !== "completed")
                .map(order => (
                  <div key={order.orId} className="border p-4 rounded-lg mb-3 flex justify-between items-center">

                    <div>
                      <p className="font-medium text-gray-800">Order #{order.orId}</p>
                      <p className="text-sm text-gray-600">Patient ID: {order.pId}</p>
                      <p className="text-xs text-gray-500">
                        Date: {order.orderDate ? order.orderDate.split("T")[0] : "N/A"}
                      </p>
                    </div>

                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      onClick={async () => {
                        try {
                          await updateOrderStatus(order.orId, "Completed");
                          toast.success(`Order #${order.orId} Completed ✅`);
                          window.location.reload();
                        } catch {
                          toast.error("Status update failed");
                        }
                      }}
                    >
                      Mark Completed ✅
                    </button>
                  </div>
                ))
            )}
          </div>

          {/* ✅ Recent Orders */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                    <div key={order.orId} className="flex p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <ShoppingCartIcon className="h-6 w-6 text-indigo-500" />
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">Order #{order.orId}</p>
                          <span className="text-xs text-gray-500">
                            {order.orderDate ? order.orderDate.split("T")[0] : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">Patient ID: {order.pId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ✅ Inventory Placeholder */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Inventory Section</h2>
                <Link to="/pharmacist/medicine_inventry" className="text-sm text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                Inventory will display from backend soon...
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;