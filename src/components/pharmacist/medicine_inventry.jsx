// export default MedicineInventory;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBagIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080/api/medicine";

const MedicineInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newMed, setNewMed] = useState({ medName: "", medQuantity: "", medPrice: "" });
  const [updateQty, setUpdateQty] = useState({});

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get(BASE_URL);
      setInventory(data);
      setUpdateQty(data.reduce((acc, m) => ({ ...acc, [m.medId]: "" }), {}));
    } catch (error) {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const changeQtyInput = (id, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      setUpdateQty((prev) => ({ ...prev, [id]: value }));
    }
  };

  const updateStock = async (id, type) => {
    const amount = parseInt(updateQty[id]);
    if (!amount || amount <= 0) {
      return toast.error("Enter valid quantity");
    }

    try {
      const endpoint = `${BASE_URL}/${id}/${type}?amount=${amount}`;
      await axios.patch(endpoint);
      toast.success(`${type === "increase" ? "Added" : "Removed"} ${amount}`);
      fetchInventory();
    } catch {
      toast.error("Stock update failed");
    }
  };

  const addMedicine = async () => {
    const { medName, medQuantity, medPrice } = newMed;
    if (!medName || !medQuantity || !medPrice) {
      return toast.error("Fill all fields");
    }

    try {
      await axios.post(BASE_URL, {
        medName,
        medQuantity: parseInt(medQuantity),
        medPrice: parseFloat(medPrice),
      });

      toast.success("Medicine added");
      setNewMed({ medName: "", medQuantity: "", medPrice: "" });
      fetchInventory();
    } catch {
      toast.error("Failed to add medicine");
    }
  };

  const filteredInventory = inventory.filter((m) =>
    m.medName.toLowerCase().includes(search.toLowerCase())
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

      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Medicine Inventory</h1>

      {/* Search + Add Medicine Section */}
      <div className="mb-8 flex flex-col gap-4">

        {/* Search Bar */}
        <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3">
          <input
            type="text"
            placeholder="🔍 Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        {/* Add Medicine Form */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">➕ Add New Medicine</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Medicine Name"
              value={newMed.medName}
              onChange={(e) => setNewMed({ ...newMed, medName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
            <input
              type="number"
              placeholder="Qty"
              value={newMed.medQuantity}
              onChange={(e) => setNewMed({ ...newMed, medQuantity: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newMed.medPrice}
              onChange={(e) => setNewMed({ ...newMed, medPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />

            <button
              onClick={addMedicine}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="grid gap-4">
        {filteredInventory.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No medicines found</div>
        ) : (
          filteredInventory.map((m) => (
            <div
              key={m.medId}
              className="flex flex-col sm:flex-row justify-between p-4 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gray-100">
                  <ShoppingBagIcon className="h-6 w-6 text-indigo-500" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">{m.medName}</h2>
                  <p className="text-xs text-gray-500">ID: {m.medId}</p>

                  <p className={`text-sm font-medium mt-1 ${
                    m.medQuantity <= 5 ? "text-red-600 font-bold" : "text-gray-700"
                  }`}>
                    Quantity: {m.medQuantity}
                  </p>
                  <p className="text-sm text-gray-700">₹{m.medPrice}</p>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 flex items-center gap-2">
                <input
                  type="text"
                  value={updateQty[m.medId] || ""}
                  onChange={(e) => changeQtyInput(m.medId, e.target.value)}
                  placeholder="Qty"
                  className="px-3 py-2 w-20 rounded border text-sm"
                />

                <button
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                  onClick={() => updateStock(m.medId, "increase")}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>

                <button
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  onClick={() => updateStock(m.medId, "decrease")}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicineInventory;