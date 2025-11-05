import React, { useEffect, useState } from "react";
import { ShoppingCartIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/medicine-orders";

const MedicineOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(BASE_URL);
      console.log("Fetched orders:", data);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to load medicine orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (order) => {
    let nextStatus =
      order.status.toLowerCase() === "pending"
        ? "Processing"
        : order.status.toLowerCase() === "processing"
        ? "Completed"
        : "Completed";

    try {
      await axios.put(`${BASE_URL}/${order.orId}/status?status=${nextStatus}`);
      toast.success(`Order #${order.orId} marked ${nextStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusClass = (s) => {
    const st = (s || "").toLowerCase();
    if (st === "pending") return "bg-yellow-100 text-yellow-800";
    if (st === "processing") return "bg-blue-100 text-blue-800";
    if (st === "completed") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const pendingOrders = orders.filter(
    (o) => o.status?.toLowerCase() !== "completed"
  );
  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "completed"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin h-10 w-10 border-t-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Medicine Orders</h1>
        <Link to="/pharmacist/medicine_inventry" className="text-sm text-indigo-600 hover:underline">
          Go to Inventory
        </Link>
      </div>

      {/* Pending Orders */}
      <h2 className="text-xl font-bold text-gray-700 mb-4">🟡 Pending / Processing Orders</h2>
      {pendingOrders.length === 0 ? (
        <div className="text-gray-500 mb-6">No pending orders 🎉</div>
      ) : (
        <div className="space-y-4 mb-10">
          {pendingOrders.map((o) => (
            <div key={o.orId} className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100">
                    <ShoppingCartIcon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Order #{o.orId} • Patient ID: {o.pId}
                    </div>
                    <div className="text-xs text-gray-400">
                      Date: {o.orderDate?.split("T")[0]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass(o.status)}`}>
                    {o.status}
                  </span>

                  <button
                    onClick={() => updateStatus(o)}
                    className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    {o.status.toLowerCase() === "pending" ? "Process" : "Complete"}
                  </button>
                </div>
              </div>

              {o.items?.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-sm font-semibold text-gray-700 mb-2">Medicines:</h2>
                  <ul className="text-sm text-gray-700 border rounded-lg divide-y divide-gray-100">
                    {o.items.map((m, i) => (
                      <li key={i} className="flex justify-between items-center px-3 py-2">
                        <span>Med ID: {m.medId} (Qty: {m.quantity})</span>
                        <span className="text-gray-600 font-medium">
                          ₹{m.pricePerItem * m.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed Orders */}
      <h2 className="text-xl font-bold text-gray-700 mb-4">✅ Completed Orders</h2>
      {completedOrders.length === 0 ? (
        <div className="text-gray-500">No completed orders.</div>
      ) : (
        <div className="space-y-4">
          {completedOrders.map((o) => (
            <div key={o.orId} className="border rounded-xl p-5 bg-white shadow-sm opacity-90">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">Order #{o.orId}</p>
                  <p className="text-xs text-gray-500">Patient ID: {o.pId}</p>
                </div>
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineOrders;