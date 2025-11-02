import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const MedicineInventory = ({ items = [] }) => {
  // Initial inventory (fallback sample)
  const initial = items.length
    ? items
    : [
        { id: 'M101', name: 'Paracetamol 500mg', quantity: 3, price: 10, reorderLevel: 5 },
        { id: 'M102', name: 'Amoxicillin 250mg', quantity: 12, price: 25, reorderLevel: 10 },
      ];

  // Local state for inventory, reorder inputs and messages
  const [inventory, setInventory] = useState(initial);
  const [reorderAmounts, setReorderAmounts] = useState(() =>
    initial.reduce((acc, it) => ({ ...acc, [it.id]: '' }), {})
  );
  const [messages, setMessages] = useState({}); // { [id]: 'Success!' }

  const handleReorderChange = (id, value) => {
    // allow only digits
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setReorderAmounts(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleAddStock = (id) => {
    const raw = reorderAmounts[id];
    const amount = parseInt(raw, 10);

    if (!raw || isNaN(amount) || amount <= 0) {
      setMessages(prev => ({ ...prev, [id]: 'Enter a valid positive number' }));
      clearMessageAfter(id, 2500);
      return;
    }

    setInventory(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
    );

    setReorderAmounts(prev => ({ ...prev, [id]: '' }));
    setMessages(prev => ({ ...prev, [id]: `Added ${amount} unit${amount > 1 ? 's' : ''} to stock` }));
    clearMessageAfter(id, 2500);
  };

  const clearMessageAfter = (id, ms = 2000) => {
    setTimeout(() => {
      setMessages(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, ms);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Medicine Inventory</h1>
        <Link to="/pharmacist/medicine_order" className="text-sm text-indigo-600 hover:underline">
          View Orders
        </Link>
      </div>

      <div className="grid gap-4">
        {inventory.map(item => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100">
                <ShoppingBagIcon className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">ID: {item.id}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Reorder level: <span className="font-medium text-gray-700">{item.reorderLevel}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              {/* Quantity */}
              <div className="text-sm text-gray-700 text-right">
                <div className="text-sm">Quantity</div>
                <div className="text-lg font-semibold">{item.quantity}</div>
              </div>

              {/* Price per unit (kept separate) */}
              <div className="text-sm text-gray-700 text-right">
                <div className="text-sm">Price / unit</div>
                <div className="text-lg font-semibold">₹{item.price}</div>
              </div>

              {/* Reorder input and button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={reorderAmounts[item.id] ?? ''}
                  onChange={(e) => handleReorderChange(item.id, e.target.value)}
                  placeholder="Qty to add"
                  className="w-28 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  onClick={() => handleAddStock(item.id)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Add Stock
                </button>
              </div>
            </div>

            {/* message area (mobile below, desktop inline) */}
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {messages[item.id] && (
                <div className="text-xs text-gray-600">{messages[item.id]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineInventory;
