import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { labtechService } from '../../services/api';
import { toast } from 'react-toastify';

const LabReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLabReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [allReports, searchQuery]);

  const fetchLabReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem('user');
      const userData = JSON.parse(userStr);
      const labtechId = userData.id;

      const response = await labtechService.getCompletedLabReports(labtechId);
      setAllReports(response.data || []);
      setFilteredReports(response.data || []);
      
    } catch (err) {
      console.error('Error fetching lab reports:', err);
      setError('Failed to load completed lab reports.');
      toast.error('Failed to load completed lab reports. Showing mock data.');
      // Fallback to mock data
      setAllReports([
        { id: 201, patientId: 125, patientName: 'Robert Brown', testName: 'Thyroid Function Test', dateCompleted: '2025-10-23', reportUrl: '#', resultSummary: 'T3 and T4 levels are normal.' },
        { id: 202, patientId: 127, patientName: 'Chris Evans', testName: 'Lipid Panel', dateCompleted: '2025-10-22', reportUrl: '#', resultSummary: 'Elevated LDL cholesterol.' },
        { id: 203, patientId: 128, patientName: 'Jessica Alba', testName: 'Liver Function Test', dateCompleted: '2025-10-20', reportUrl: '#', resultSummary: 'Results are within normal limits.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = allReports.filter(report => {
      const query = searchQuery.toLowerCase();
      return (
        (report.patientName || '').toLowerCase().includes(query) ||
        (report.testName || '').toLowerCase().includes(query) ||
        (report.resultSummary || '').toLowerCase().includes(query)
      );
    });
    setFilteredReports(filtered);
  };

  const handleDownload = (report) => {
    toast.success(`Downloading report #${report.id}... (Simulation)`);
    // In a real app, this would trigger a file download or open the reportUrl
  };

  const handleDelete = (reportId) => {
    if (window.confirm(`Are you sure you want to delete report #${reportId}? (Simulation)`)) {
      setAllReports(prev => prev.filter(r => r.id !== reportId));
      toast.success(`Report #${reportId} deleted successfully. (Simulation)`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Completed Lab Reports</h1>
        <button 
          onClick={() => toast.info('Opening upload form... (Simulation)')}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          Upload New Report
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by patient, test name, or summary..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchLabReports}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 w-full md:w-auto transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Refresh List
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">Loading reports...</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No completed reports found matching your criteria.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start flex-wrap gap-4">
                {/* Report Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                    {report.testName} Report
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Patient: {report.patientName} • Report ID: #{report.id}</p>
                </div>
                {/* Date */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-green-700">Completed</span>
                  <p className="text-xs text-gray-500 mt-1">Date: {report.dateCompleted}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex flex-col gap-4">
                  {/* Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Result Summary:</h4>
                    <p className="text-sm text-gray-700 italic">{report.resultSummary || 'No summary provided.'}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => handleDownload(report)}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-md"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Download
                    </button>
                    <button
                      onClick={() => toast.info(`Opening edit form for #${report.id}... (Simulation)`)}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Delete
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
          <button className="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600">1</button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><ChevronRightIcon className="h-5 w-5" /></button>
        </nav>
      </div>
    </div>
  );
};

export default LabReports;