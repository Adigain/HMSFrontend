import React, { useState } from "react";
import { ShoppingCartIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const MedicineOrders = ({ orders = [] }) => {
  const [orderList, setOrderList] = useState(
    orders.length
      ? orders
      : [
          {
            id: 201,
            patientName: "A. Khan",
            status: "Pending",
            date: "2025-10-30",
            medicines: [
              { name: "Paracetamol 500mg", qty: 2, price: 10 },
              { name: "Amoxicillin 250mg", qty: 1, price: 25 },
            ],
          },
          {
            id: 202,
            patientName: "S. Patel",
            status: "Processing",
            date: "2025-10-29",
            medicines: [
              { name: "Cetirizine 10mg", qty: 1, price: 15 },
              { name: "Vitamin C 500mg", qty: 1, price: 12 },
            ],
          },
        ]
  );

  const statusClass = (s) => {
    const st = (s || "").toLowerCase();
    if (st === "pending") return "bg-yellow-100 text-yellow-800";
    if (st === "processing") return "bg-blue-100 text-blue-800";
    if (st === "completed") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleProcess = (id) => {
    setOrderList((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          if (o.status === "Pending") return { ...o, status: "Processing" };
          if (o.status === "Processing") return { ...o, status: "Completed" };
        }
        return o;
      })
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Medicine Orders</h1>
        <a
          href="/pharmacist/medicine_inventory"
          className="text-sm text-indigo-600 hover:underline"
        >
          Go to Inventory
        </a>
      </div>

      {orderList.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg">
          🎉 No orders available
        </div>
      ) : (
        <div className="space-y-4">
          {orderList.map((o) => (
            <div
              key={o.id}
              className={`border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition ${
                o.status === "Completed" ? "opacity-95" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100">
                    <ShoppingCartIcon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Order #{o.id} • {o.patientName}
                    </div>
                    <div className="text-xs text-gray-400">
                      Requested: {o.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusClass(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>

                  {o.status !== "Completed" ? (
                    <button
                      onClick={() => handleProcess(o.id)}
                      className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                      {o.status === "Pending" ? "Process" : "Complete"}
                    </button>
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Medicine Details */}
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Medicines Required:
                </h2>
                <ul className="text-sm text-gray-700 border rounded-lg divide-y divide-gray-100">
                  {o.medicines.map((m, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center px-3 py-2"
                    >
                      <div>
                        <span className="font-medium">{m.name}</span>{" "}
                        <span className="text-gray-400 text-xs">
                          (Qty: {m.qty})
                        </span>
                      </div>
                      <div className="text-gray-600 font-medium">
                        ₹{m.price * m.qty}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Total */}
                <div className="text-right mt-2 text-sm text-gray-700">
                  <span className="font-medium">
                    Total: ₹
                    {o.medicines.reduce(
                      (sum, m) => sum + m.price * m.qty,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineOrders;
