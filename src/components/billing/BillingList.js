import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingService } from '../../services/api';
import Navbar from '../shared/Navbar';

const BillingList = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        setLoading(true);
        const response = await billingService.getBillings();
        setBillings(response.data);
      } catch (err) {
        setError('Failed to fetch billing data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBillings();
  }, []);
  
  const handlePaymentUpdate = async (id, currentPayment, amount) => {
    try {
      // Simple payment modal - in real app you'd have a proper payment form
      const payment = window.prompt(
        `Current Payment: $${currentPayment || 0}\nTotal Bill: $${amount}\nEnter payment amount:`,
        currentPayment || 0
      );
      
      if (payment === null) return; // User canceled
      
      const paymentAmount = parseFloat(payment);
      if (isNaN(paymentAmount) || paymentAmount < 0) {
        alert('Please enter a valid payment amount');
        return;
      }
      
      // Update payment
      await billingService.updateBilling(id, { payment: paymentAmount });
      
      // Update UI
      setBillings(prevBillings => 
        prevBillings.map(billing => 
          billing.id === id 
            ? { 
                ...billing, 
                payment: paymentAmount,
                status: paymentAmount >= billing.amount ? 'paid' : 'pending'
              } 
            : billing
        )
      );
      
      setUpdateSuccess('Payment updated successfully!');
      
      // Clear success message after a delay
      setTimeout(() => {
        setUpdateSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Payment update failed:', err);
      setError('Failed to update payment. Please try again.');
      
      // Clear error message after a delay
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  // Calculate dashboard stats
  const totalBillings = billings.length;
  const pendingBillings = billings.filter(bill => bill.status === 'pending').length;
  const paidBillings = billings.filter(bill => bill.status === 'paid').length;
  const totalRevenue = billings.reduce((total, bill) => total + parseFloat(bill.payment || 0), 0);
  const totalOutstanding = billings.reduce((total, bill) => {
    const amount = parseFloat(bill.amount || 0);
    const payment = parseFloat(bill.payment || 0);
    return total + Math.max(0, amount - payment);
  }, 0);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Billing Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {updateSuccess}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Billings</h3>
                <p className="text-2xl font-bold">{totalBillings}</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                <p className="text-2xl font-bold">{pendingBillings}</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-gray-500 text-sm font-medium">Paid</h3>
                <p className="text-2xl font-bold">{paidBillings}</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-gray-500 text-sm font-medium">Outstanding</h3>
                <p className="text-2xl font-bold">${totalOutstanding.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Billing List */}
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-bold mb-4">All Billings</h2>
              
              {billings.length === 0 ? (
                <p>No billing records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Patient</th>
                        <th className="px-4 py-2 text-left">Bill Amount</th>
                        <th className="px-4 py-2 text-left">Payment Made</th>
                        <th className="px-4 py-2 text-left">Outstanding</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billings.map(billing => {
                        const amount = parseFloat(billing.amount || 0);
                        const payment = parseFloat(billing.payment || 0);
                        const outstanding = Math.max(0, amount - payment);
                        
                        return (
                          <tr key={billing.id} className="border-b">
                            <td className="px-4 py-2">
                              {billing.patientChart 
                                ? `${billing.patientChart.first_name} ${billing.patientChart.last_name}` 
                                : `Patient #${billing.patient_id}`}
                            </td>
                            <td className="px-4 py-2">${amount.toFixed(2)}</td>
                            <td className="px-4 py-2">${payment.toFixed(2)}</td>
                            <td className="px-4 py-2">${outstanding.toFixed(2)}</td>
                            <td className="px-4 py-2">
                              <span 
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  billing.status === 'paid' 
                                    ? 'bg-green-100 text-green-800' 
                                    : billing.status === 'overdue'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {billing.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <button 
                                onClick={() => handlePaymentUpdate(billing.id, billing.payment, billing.amount)}
                                className={`${
                                  billing.status === 'paid' 
                                    ? 'bg-gray-500 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-700'
                                } text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline`}
                                disabled={billing.status === 'paid'}
                              >
                                {billing.status === 'paid' ? 'Paid' : 'Update Payment'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingList;