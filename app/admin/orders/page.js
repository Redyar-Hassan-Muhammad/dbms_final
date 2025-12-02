'use client';
import { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="card">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.ORDER_ID} className="border-b">
                  <td className="p-2">{order.ORDER_ID}</td>
                  <td className="p-2">{order.CUSTOMER_NAME}</td>
                  <td className="p-2">${order.TOTAL_AMOUNT}</td>
                  <td className="p-2">
                    {new Date(order.ORDER_DATE).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <select
                      value={order.STATUS}
                      onChange={(e) => updateOrderStatus(order.ORDER_ID, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <a 
                      href={`/admin/orders/${order.ORDER_ID}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </a>
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