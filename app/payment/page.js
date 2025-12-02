'use client';
import { useState } from 'react';

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    card_number: '',
    expiry_date: '',
    cvv: '',
    card_holder: '',
    amount: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Payment processing logic would go here
    alert('Payment functionality would be integrated with payment gateway');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Make a Payment</h1>
      
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Card Holder Name</label>
            <input
              type="text"
              name="card_holder"
              value={formData.card_holder}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              name="card_number"
              value={formData.card_number}
              onChange={handleChange}
              className="form-input"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="form-input"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="form-input"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Process Payment
          </button>
        </form>
      </div>
    </div>
  );
}