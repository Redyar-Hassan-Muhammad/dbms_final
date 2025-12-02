'use client';
import { useState, useEffect } from 'react';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const customerObj = JSON.parse(customerData);
      setCustomer(customerObj);
      fetchPaymentHistory(customerObj.CUSTOMER_ID);
    }
  }, []);

  const fetchPaymentHistory = async (customerId) => {
    try {
      const response = await fetch(`/api/payments/customer/${customerId}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!customer) return <div className="p-8">Please log in to view payment history.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      
      <div className="card">
        {payments.length === 0 ? (
          <p>No payment history found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Payment ID</th>
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Method</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.PAYMENT_ID} className="border-b">
                  <td className="p-2">{payment.PAYMENT_ID}</td>
                  <td className="p-2">{payment.ORDER_ID}</td>
                  <td className="p-2">${payment.AMOUNT}</td>
                  <td className="p-2">{payment.PAYMENT_METHOD}</td>
                  <td className="p-2">
                    {new Date(payment.PAYMENT_DATE).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded ${
                      payment.STATUS === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.STATUS}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}