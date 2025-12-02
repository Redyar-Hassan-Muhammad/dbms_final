'use client';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    shipping_address: '',
    payment_method: 'credit_card'
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const customerData = localStorage.getItem('customer');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (customerData) {
      setCustomer(JSON.parse(customerData));
    }
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.PRODUCT_ID === item.productId);
      return total + (product ? product.PRICE * item.quantity : 0);
    }, 0);
  };

  // CheckoutPage.js - Update handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!customer) {
    alert('Please log in to complete your order');
    return;
  }

  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  try {
    const orderData = {
      customer_id: customer.CUSTOMER_ID || customer.customer_id,
      total_amount: getCartTotal(),
      items: cart.map(item => {
        const product = products.find(p => p.PRODUCT_ID === item.productId);
        return {
          product_id: item.productId,
          quantity: item.quantity,
          price: product ? product.PRICE : 0
        };
      }),
      shipping_address: formData.shipping_address,
      payment_method: formData.payment_method
    };

    // Get token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('customerToken');
    
    console.log('Sending order data:', orderData);

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    
    if (response.ok) {
      // Clear cart
      localStorage.removeItem('cart');
      // Redirect to success page
      window.location.href = `/order/success?orderId=${result.orderId}`;
    } else {
      alert(result.error || 'Order failed: ' + (result.details || 'Unknown error'));
      console.error('Order creation failed:', result);
    }
  } catch (error) {
    console.error('Order error:', error);
    alert('Failed to place order. Please try again.');
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to checkout</p>
        <a href="/login" className="btn-primary mt-4 inline-block">
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Shipping Address</label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Payment Method</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full">
                Place Order
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => {
                const product = products.find(p => p.PRODUCT_ID === item.productId);
                if (!product) return null;
                
                return (
                  <div key={item.productId} className="flex justify-between">
                    <span>{product.NAME} x {item.quantity}</span>
                    <span>${(product.PRICE * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}