import React, { useState, useEffect, useCallback } from 'react';
import { billingService } from '../../services/api.js'; 
import { toast } from 'react-toastify';
import { CreditCardIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon, BeakerIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

// Helper to get a user-friendly description and icon for the bill type
const getItemDetails = (type) => {
  switch (type) {
    case 'doc':
      return {
        description: 'Doctor Appointment',
        icon: <DocumentTextIcon className="h-6 w-6 text-blue-600" />,
      };
    case 'lab':
      return {
        description: 'Lab Test',
        icon: <BeakerIcon className="h-6 w-6 text-purple-600" />,
      };
    case 'med':
      return {
        description: 'Medicine Order',
        icon: <BuildingStorefrontIcon className="h-6 w-6 text-green-600" />,
      };
    default:
      return {
        description: 'Miscellaneous Charge',
        icon: <DocumentTextIcon className="h-6 w-6 text-gray-600" />,
      };
  }
};

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState({});
  const [patientId, setPatientId] = useState(null);

  // Fetch bills function
  const fetchBills = useCallback(async (pId) => {
    if (!pId) {
      setError('Could not find patient ID.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await billingService.getBillOrdersByPatientId(pId);
      // Sort bills to show pending items first
      const sortedBills = (response.data || []).sort((a, b) => {
        if (a.paymentStatus === 'pending' && b.paymentStatus !== 'pending') return -1;
        if (a.paymentStatus !== 'pending' && b.paymentStatus === 'pending') return 1;
        return new Date(b.billingDate) - new Date(a.billingDate);
      });
      setBills(sortedBills);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load billing information. Please try again later.');
      toast.error('Failed to load billing information.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to get patient ID and fetch initial data
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not logged in');
      }
      const userData = JSON.parse(userStr);
      const pId = userData.id || userData.P_ID;
      
      if (pId) {
        setPatientId(pId);
        fetchBills(pId);
      } else {
        throw new Error('Patient ID not found in user data');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error(err.message);
    }
  }, [fetchBills]);

  // Handle mock payment
  const handlePay = async (bill) => {
    const billId = bill.billId;
    setProcessingPayment(prev => ({ ...prev, [billId]: true }));
    
    // 1. Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      // 2. Call API to update status
      await billingService.updatePaymentStatus(billId, 'paid');
      
      // 3. Show success toast
      toast.success(`Payment for Bill #${billId} (₹${bill.price.toFixed(2)}) was successful!`);
      
      // 4. Refresh data from server (as requested)
      // We will refetch instead of full page reload for a smoother UX
      if (patientId) {
        fetchBills(patientId);
      }

    } catch (err) {
      console.error('Error processing payment:', err);
      toast.error('Payment failed. Please try again.');
    } finally {
      // 5. Stop processing indicator
      setProcessingPayment(prev => ({ ...prev, [billId]: false }));
    }
  };

  // Calculate total pending amount
  const totalPending = bills
    .filter(bill => bill.paymentStatus === 'pending')
    .reduce((sum, bill) => sum + bill.price, 0);

  const totalPaid = bills
    .filter(bill => bill.paymentStatus === 'paid')
    .reduce((sum, bill) => sum + bill.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Billing</h1>
          <p className="text-gray-600 mt-1">Review your outstanding and paid bills.</p>
        </div>
        <div className="mt-4 md:mt-0 md:text-right">
          <p className="text-gray-500 text-sm">Total Pending</p>
          <p className="text-3xl font-bold text-red-600">₹{totalPending.toFixed(2)}</p>
          <p className="text-gray-500 text-sm mt-1">Total Paid: ₹{totalPaid.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="ml-4 text-gray-600">Loading bills...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 rounded-xl shadow-md border border-red-200 p-12 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bills.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">All Caught Up!</h2>
          <p className="text-gray-600 mt-2">You have no outstanding bills.</p>
        </div>
      )}

      {/* Bills List */}
      {!loading && !error && bills.length > 0 && (
        <div className="space-y-4">
          {bills.map((bill) => {
            const isPending = bill.paymentStatus === 'pending';
            const isProcessing = processingPayment[bill.billId];
            const { description, icon } = getItemDetails(bill.type);
            
            return (
              <div 
                key={bill.billId} 
                className={`rounded-xl shadow-md border overflow-hidden transition-all duration-300 ${
                  isPending ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* Left Side: Item Details */}
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                      isPending ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{description}</h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-3">
                        <span>Bill ID: <span className="font-medium">#{bill.billId}</span></span>
                        <span>Ref ID: <span className="font-medium">#{bill.itemId}</span></span>
                        <span>Date: <span className="font-medium">{new Date(bill.billingDate).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side: Price and Action */}
                  <div className="flex items-center justify-between md:justify-end md:space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className={`text-2xl font-bold ${
                        isPending ? 'text-red-600' : 'text-green-700'
                      }`}>
                        ₹{bill.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="w-40 text-right ml-4">
                      {isPending ? (
                        <button
                          onClick={() => handlePay(bill)}
                          disabled={isProcessing}
                          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all duration-200 ${
                            isProcessing 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-primary-600 hover:bg-primary-700'
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCardIcon className="h-5 w-5 mr-2" />
                              Pay Now
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-green-200 text-green-800 font-medium">
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Paid
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Billing;

