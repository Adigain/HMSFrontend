// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const MedicineOrders = ({ orders = [] }) => {
  const sample = orders.length ? orders : [
    { id: 201, patientName: 'A. Khan', status: 'Pending', date: '2025-10-30' },
    { id: 202, patientName: 'S. Patel', status: 'Processing', date: '2025-10-29' }
  ];

  const statusClass = (s) => {
    const st = (s || '').toLowerCase();
    if (st === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (st === 'processing') return 'bg-blue-100 text-blue-800';
    if (st === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Medicine Orders</h1>
        <Link to="/pharmacist/medicine_inventry" className="text-sm text-indigo-600 hover:underline">Inventory</Link>
      </div>
      <div className="space-y-4">
        {sample.map(o => (
          <div key={o.id} className="flex items-center border rounded-lg p-4 bg-white">
            <div className="p-3 rounded-full bg-gray-100 mr-4"><ShoppingCartIcon className="h-6 w-6 text-indigo-500" /></div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Order #{o.id} • {o.patientName}</div>
                  <div className="text-xs text-gray-400">Requested: {o.date}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass(o.status)}`}>{o.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineOrders;
// ...existing code...