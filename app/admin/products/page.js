'use client';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
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

  const deleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <a href="/admin/products/add" className="btn-primary">
          Add New Product
        </a>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Stock</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.PRODUCT_ID} className="border-b">
                <td className="p-2">{product.PRODUCT_ID}</td>
                <td className="p-2">{product.NAME}</td>
                <td className="p-2">${product.PRICE}</td>
                <td className="p-2">{product.STOCK}</td>
                <td className="p-2">
                  <a 
                    href={`/admin/products/edit/${product.PRODUCT_ID}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => deleteProduct(product.PRODUCT_ID)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}