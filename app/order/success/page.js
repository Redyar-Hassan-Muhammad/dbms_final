'use client';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your order ID is: <strong>{orderId}</strong>
          </p>
          <p className="text-gray-600 mb-6">
            You will receive an email confirmation shortly.
          </p>
          <div className="space-y-3">
            <a href="/customer/profile" className="btn-primary block">
              View Order History
            </a>
            <a href="/" className="btn-secondary block">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}