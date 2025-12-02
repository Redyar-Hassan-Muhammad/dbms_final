'use client';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      setCustomer(JSON.parse(customerData));
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!customer) return <div className="p-8">Please log in to view your profile.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer Profile</h1>
      
      <div className="card max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Full Name:</label>
            <p className="mt-1">{customer.FULLNAME}</p>
          </div>
          <div>
            <label className="font-semibold">Email:</label>
            <p className="mt-1">{customer.EMAIL}</p>
          </div>
          <div>
            <label className="font-semibold">Phone:</label>
            <p className="mt-1">{customer.PHONE || 'Not provided'}</p>
          </div>
          <div>
            <label className="font-semibold">Member Since:</label>
            <p className="mt-1">{new Date(customer.CREATED_DATE).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <a href="/cart" className="btn-primary mr-3">
            View Cart
          </a>
          <a href="/payment/history" className="btn-secondary">
            Payment History
          </a>
        </div>
      </div>
    </div>
  );
}