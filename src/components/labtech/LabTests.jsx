import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BeakerIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const LabTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTest, setNewTest] = useState({ testName: "", testFee: "" });
  const [editTestId, setEditTestId] = useState(null);
  const [editTest, setEditTest] = useState({ testName: "", testFee: "" });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/labtests");
      setTests(res.data || []);
    } catch (err) {
      console.error("Failed to load lab tests:", err);
      toast.error("Failed to fetch lab tests.");
    } finally {
      setLoading(false);
    }
  };

  const addTest = async () => {
    if (!newTest.testName || !newTest.testFee) {
      toast.warning("Please fill in both fields.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/labtests", newTest);
      toast.success("New lab test added!");
      setNewTest({ testName: "", testFee: "" });
      setTests([...tests, res.data]);
    } catch (err) {
      console.error("Error adding lab test:", err);
      toast.error("Failed to add lab test.");
    }
  };

  const updateTest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/labtests/${id}`,
        editTest
      );
      toast.success("Test updated successfully!");
      setEditTestId(null);
      setTests(
        tests.map((t) => (t.testId === id ? res.data : t))
      );
    } catch (err) {
      console.error("Error updating test:", err);
      toast.error("Failed to update test.");
    }
  };

  const deleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/labtests/${id}`);
      setTests(tests.filter((t) => t.testId !== id));
      toast.success("Test deleted successfully!");
    } catch (err) {
      console.error("Error deleting test:", err);
      toast.error("Failed to delete test.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-700 mb-8 flex items-center gap-2">
        <BeakerIcon className="h-8 w-8 text-teal-600" /> Manage Lab Tests
      </h1>

      {/* Add New Test */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5 text-teal-600" /> Add New Test
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Test Name"
            value={newTest.testName}
            onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="number"
            placeholder="Test Fee"
            value={newTest.testFee}
            onChange={(e) => setNewTest({ ...newTest, testFee: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={addTest}
            className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition"
          >
            Add Test
          </button>
        </div>
      </div>

      {/* All Tests List */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">All Available Tests</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : tests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tests found. Add one above.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600 border-b">
                <th className="p-3">Test ID</th>
                <th className="p-3">Test Name</th>
                <th className="p-3">Test Fee (₹)</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.testId} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{t.testId}</td>
                  <td className="p-3">
                    {editTestId === t.testId ? (
                      <input
                        type="text"
                        value={editTest.testName}
                        onChange={(e) =>
                          setEditTest({ ...editTest, testName: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      t.testName
                    )}
                  </td>
                  <td className="p-3">
                    {editTestId === t.testId ? (
                      <input
                        type="number"
                        value={editTest.testFee}
                        onChange={(e) =>
                          setEditTest({ ...editTest, testFee: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      `₹${t.testFee}`
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {editTestId === t.testId ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => updateTest(t.testId)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckIcon className="h-4 w-4" /> Save
                        </button>
                        <button
                          onClick={() => setEditTestId(null)}
                          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 flex items-center gap-1"
                        >
                          <XMarkIcon className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditTestId(t.testId);
                            setEditTest({
                              testName: t.testName,
                              testFee: t.testFee,
                            });
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                        >
                          <PencilSquareIcon className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => deleteTest(t.testId)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                        >
                          <TrashIcon className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LabTests;
