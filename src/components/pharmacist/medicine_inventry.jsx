// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const MedicineInventory = ({ items = [] }) => {
  // If you have an API, load items in useEffect; here keep simple and show structure
  const sample = items.length ? items : [
    { id: 'M101', name: 'Paracetamol 500mg', quantity: 3, reorderLevel: 5 },
    { id: 'M102', name: 'Amoxicillin 250mg', quantity: 12, reorderLevel: 10 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Medicine Inventory</h1>
        <Link to="/pharmacist/medicine_order" className="text-sm text-indigo-600 hover:underline">View Orders</Link>
      </div>
      <div className="grid gap-4">
        {sample.map(item => (
          <div key={item.id} className="flex items-center p-4 border rounded-lg bg-white">
            <div className="p-3 rounded-full bg-gray-100 mr-4"><ShoppingBagIcon className="h-6 w-6 text-indigo-500" /></div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">ID: {item.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{item.quantity}</div>
                  <div className="text-xs text-gray-400">Reorder: {item.reorderLevel}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineInventory;
// ...existing code...