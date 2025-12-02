'use client';
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in';
    toast.textContent = 'Removed from cart';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.PRODUCT_ID === item.productId);
      return total + (product ? product.PRICE * item.quantity : 0);
    }, 0);
  };

  const getProductDetails = (productId) => {
    return products.find(p => p.PRODUCT_ID === productId);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </a>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="text-gray-600">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="card text-center max-w-md mx-auto">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <a href="/" className="btn-primary inline-block">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {cart.map((item) => {
                    const product = getProductDetails(item.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={item.productId} className="flex items-center p-4 border rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{product.NAME}</h3>
                          <p className="text-gray-600 text-sm">${product.PRICE} each</p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border rounded-l hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 h-8 flex items-center justify-center border-t border-b text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border rounded-r hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ${(product.PRICE * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="mt-2 text-red-500 hover:text-red-700 flex items-center justify-end w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="card sticky top-8">
                <h3 className="text-lg font-semibold mb-6 pb-4 border-b">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-lg font-semibold pt-4 border-t">
                  <span>Total</span>
                  <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                </div>
                
                <div className="mt-8 space-y-3">
                  <a 
                    href="/checkout" 
                    className="btn-primary w-full text-center py-3"
                  >
                    Proceed to Checkout
                  </a>
                  
                  <a 
                    href="/" 
                    className="block w-full text-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </a>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-2">Secure checkout</p>
                  <div className="flex space-x-2">
                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}