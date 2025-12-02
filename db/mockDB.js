// Mock database for development
const mockProducts = [
  {
    PRODUCT_ID: 1,
    NAME: 'MacBook Pro 16"',
    DESCRIPTION: 'Apple MacBook Pro 16-inch with M2 Pro chip',
    PRICE: 2399.99,
    STOCK: 25,
    CATEGORY_ID: 1,
    CATEGORY_NAME: 'Electronics',
    CREATED_DATE: new Date().toISOString()
  },
  {
    PRODUCT_ID: 2,
    NAME: 'iPhone 15 Pro',
    DESCRIPTION: 'Latest Apple iPhone with advanced camera',
    PRICE: 1199.99,
    STOCK: 50,
    CATEGORY_ID: 1,
    CATEGORY_NAME: 'Electronics',
    CREATED_DATE: new Date().toISOString()
  },
  {
    PRODUCT_ID: 3,
    NAME: 'Cotton T-Shirt',
    DESCRIPTION: 'Premium cotton t-shirt, various colors',
    PRICE: 24.99,
    STOCK: 100,
    CATEGORY_ID: 2,
    CATEGORY_NAME: 'Clothing',
    CREATED_DATE: new Date().toISOString()
  },
  {
    PRODUCT_ID: 4,
    NAME: 'JavaScript Book',
    DESCRIPTION: 'Learn JavaScript programming',
    PRICE: 49.99,
    STOCK: 30,
    CATEGORY_ID: 3,
    CATEGORY_NAME: 'Books',
    CREATED_DATE: new Date().toISOString()
  },
  {
    PRODUCT_ID: 5,
    NAME: 'Gaming Chair',
    DESCRIPTION: 'Ergonomic gaming chair with lumbar support',
    PRICE: 299.99,
    STOCK: 15,
    CATEGORY_ID: 4,
    CATEGORY_NAME: 'Home & Garden',
    CREATED_DATE: new Date().toISOString()
  }
];

const mockCategories = [
  { CATEGORY_ID: 1, NAME: 'Electronics' },
  { CATEGORY_ID: 2, NAME: 'Clothing' },
  { CATEGORY_ID: 3, NAME: 'Books' },
  { CATEGORY_ID: 4, NAME: 'Home & Garden' }
];

let productIdCounter = 6;
let categoryIdCounter = 5;

const mockDb = {
  async executeQuery(query, params = []) {
    console.log('🔧 Mock DB - Query:', query.substring(0, 100) + '...');
    console.log('🔧 Mock DB - Params:', params);
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      // Handle SELECT queries
      if (query.includes('SELECT')) {
        if (query.includes('FROM product') && query.includes('category')) {
          const productsWithCategory = mockProducts.map(product => {
            const category = mockCategories.find(cat => cat.CATEGORY_ID === product.CATEGORY_ID);
            return {
              ...product,
              CATEGORY_NAME: category ? category.NAME : 'Unknown'
            };
          });
          return { rows: productsWithCategory };
        }
        
        if (query.includes('FROM product')) {
          return { rows: mockProducts };
        }
        
        if (query.includes('FROM category')) {
          return { rows: mockCategories };
        }
        
        if (query.includes('FROM customer')) {
          return { rows: [] }; // Empty for now
        }
        
        if (query.includes('COUNT(*)')) {
          if (query.includes('product')) {
            return { rows: [{ COUNT: mockProducts.length }] };
          }
          if (query.includes('customer')) {
            return { rows: [{ COUNT: 3 }] };
          }
          if (query.includes('orders')) {
            return { rows: [{ COUNT: 5 }] };
          }
        }
        
        // Default empty result
        return { rows: [] };
      }
      
      // Handle INSERT queries
      if (query.includes('INSERT INTO')) {
        if (query.includes('product')) {
          const newProduct = {
            PRODUCT_ID: productIdCounter++,
            NAME: params[0],
            DESCRIPTION: params[1],
            PRICE: parseFloat(params[2]),
            STOCK: parseInt(params[3]),
            CATEGORY_ID: parseInt(params[4]),
            CREATED_DATE: new Date().toISOString()
          };
          mockProducts.push(newProduct);
          return { rows: [], outBinds: [[newProduct.PRODUCT_ID]] };
        }
        
        if (query.includes('category')) {
          const newCategory = {
            CATEGORY_ID: categoryIdCounter++,
            NAME: params[0]
          };
          mockCategories.push(newCategory);
          return { rows: [] };
        }
      }
      
      // Handle UPDATE queries
      if (query.includes('UPDATE product')) {
        const productId = parseInt(params[params.length - 1]);
        const productIndex = mockProducts.findIndex(p => p.PRODUCT_ID === productId);
        
        if (productIndex !== -1) {
          mockProducts[productIndex] = {
            ...mockProducts[productIndex],
            NAME: params[0],
            DESCRIPTION: params[1],
            PRICE: parseFloat(params[2]),
            STOCK: parseInt(params[3]),
            CATEGORY_ID: parseInt(params[4])
          };
        }
        return { rows: [] };
      }
      
      // Handle DELETE queries
      if (query.includes('DELETE FROM product')) {
        const productId = parseInt(params[0]);
        const productIndex = mockProducts.findIndex(p => p.PRODUCT_ID === productId);
        
        if (productIndex !== -1) {
          mockProducts.splice(productIndex, 1);
        }
        return { rows: [] };
      }
      
      // Default response for other queries
      return { rows: [] };
      
    } catch (error) {
      console.error('Mock DB Error:', error);
      throw error;
    }
  },
  
  async testConnection() {
    console.log('✅ Mock database connection successful');
    return true;
  }
};

module.exports = mockDb;