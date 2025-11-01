import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  BeakerIcon,
  UserIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { labtechService } from '../../services/api';
import { toast } from 'react-toastify';

const LabTests = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchLabTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [allTests, searchQuery, selectedStatus]);

  const fetchLabTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem('user');
      const userData = JSON.parse(userStr);
      const labtechId = userData.id;

      const response = await labtechService.getLabTestsByLabtech(labtechId);
      setAllTests(response.data || []);
      setFilteredTests(response.data || []);
      
    } catch (err) {
      console.error('Error fetching lab tests:', err);
      setError('Failed to load lab tests.');
      toast.error('Failed to load lab tests. Showing mock data.');
      // Fallback to mock data to show functionality
      setAllTests([
        { id: 101, patientId: 123, patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', status: 'Pending', date: '2025-10-25', priority: 'High' },
        { id: 102, patientId: 124, patientName: 'Jane Smith', testName: 'Blood Glucose Test', status: 'In Progress', date: '2025-10-24', priority: 'Medium' },
        { id: 105, patientId: 129, patientName: 'Mike Johnson', testName: 'Comprehensive Metabolic Panel', status: 'Pending', date: '2025-10-26', priority: 'High' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = allTests.filter(test => {
      const matchesSearch = 
        (test.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.testName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        selectedStatus === 'all' || 
        (test.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
    setFilteredTests(filtered);
  };

  const handleUpdateStatus = async (testId, newStatus) => {
    setUpdatingId(testId);
    try {
      // Use mock update service
      await labtechService.updateLabTestStatus(testId, newStatus);
      
      // Update local state
      let updatedTests;
      if (newStatus === 'Completed') {
        // Remove from this list
        updatedTests = allTests.filter(t => t.id !== testId);
      } else {
        // Update status in list
        updatedTests = allTests.map(test => 
          test.id === testId ? { ...test, status: newStatus } : test
        );
      }

      setAllTests(updatedTests);
      toast.success(`Test #${testId} status updated to ${newStatus}`);
      
    } catch (err) {
      console.error('Error updating test status:', err);
      toast.error('Failed to update test status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending & In-Progress Lab Tests</h1>
        <button
            onClick={() => toast.info('Opening new test request form... (Simulation)')}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
        >
            <DocumentTextIcon className="h-5 w-5" />
            New Test Request
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or test name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-auto appearance-none bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in progress">In-Progress</option>
          </select>
          <button 
            onClick={fetchLabTests}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 w-full md:w-auto transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Refresh List
          </button>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">Loading tests...</div>
        ) : filteredTests.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
            <BeakerIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No active tests found matching your criteria.</p>
          </div>
        ) : (
          filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start flex-wrap gap-4">
                {/* Test Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BeakerIcon className="h-6 w-6 text-teal-600" />
                    {test.testName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Test ID: #{test.id} • Requested: {test.date}</p>
                </div>
                {/* Status */}
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(test.status)}`}>
                    {test.status}
                  </span>
                  <span className={`mt-1 text-xs font-medium text-red-600`}>Priority: {test.priority || 'Normal'}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Patient Info */}
                  <div className="flex items-center col-span-1">
                    <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">Patient: {test.patientName}</span>
                  </div>
                  {/* Actions */}
                  <div className="flex space-x-2 md:justify-end col-span-2">
                    {test.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(test.id, 'In Progress')}
                        disabled={updatingId === test.id}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-md disabled:opacity-50"
                      >
                        {updatingId === test.id ? 'Starting...' : <><ArrowRightIcon className="h-4 w-4 mr-1" /> Start Test</>}
                      </button>
                    )}
                    {test.status === 'In Progress' && (
                      <button
                        onClick={() => handleUpdateStatus(test.id, 'Completed')}
                        disabled={updatingId === test.id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors shadow-md disabled:opacity-50"
                      >
                        {updatingId === test.id ? 'Finishing...' : <><CheckCircleIcon className="h-4 w-4 mr-1" /> Complete</>}
                      </button>
                    )}
                     <button
                        onClick={() => toast.info(`Viewing test details for #${test.id}... (Simulation)`)}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination Placeholder */}
      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><ChevronLeftIcon className="h-5 w-5" /></button>
          <button className="relative inline-flex items-center px-4 py-2 border border-teal-500 bg-teal-50 text-sm font-medium text-teal-600">1</button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><ChevronRightIcon className="h-5 w-5" /></button>
        </nav>
      </div>
    </div>
  );
};

export default LabTests;