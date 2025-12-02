const { testConnection, executeQuery } = require('./db/oracle');

async function testDatabase() {
  console.log('🧪 Testing Oracle Database Connection...\n');
  
  // Test basic connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('❌ Cannot connect to Oracle database');
    return;
  }

  try {
    // Test if tables exist and have data
    console.log('📊 Checking database tables...');
    
    const tables = ['category', 'product', 'customer'];
    
    for (const table of tables) {
      try {
        const result = await executeQuery(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].COUNT} records`);
      } catch (error) {
        console.log(`❌ ${table}: Table not found - run queries.sql first`);
      }
    }

    // Test sample data retrieval
    console.log('\n📦 Testing product data...');
    const products = await executeQuery(`
      SELECT p.*, c.name as category_name 
      FROM product p 
      LEFT JOIN category c ON p.category_id = c.category_id
      ORDER BY p.product_id
    `);
    
    console.log(`Found ${products.rows.length} products:`);
    products.rows.forEach(product => {
      console.log(`   - ${product.NAME} (${product.CATEGORY_NAME}): $${product.PRICE}`);
    });

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDatabase();