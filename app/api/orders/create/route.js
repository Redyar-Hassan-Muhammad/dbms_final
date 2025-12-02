// app/api/orders/create/route.js
const { executeQuery } = require('../../../../db/oracle');

export const dynamic = 'force-dynamic';

async function POST(request) {
  try {
    const { customer_id, total_amount, items, shipping_address, payment_method } = await request.json();
    
    console.log('📦 Creating order for customer:', customer_id);
    console.log('💰 Total amount:', total_amount);
    console.log('📋 Items count:', items?.length);

    // Validate input
    if (!customer_id || !total_amount || !items || items.length === 0 || !payment_method) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: { 
            customer_id: !!customer_id,
            total_amount: !!total_amount,
            items_count: items?.length,
            payment_method: !!payment_method
          }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Create order
    console.log('Step 1: Creating order...');
    const orderResult = await executeQuery(
      `INSERT INTO orders (customer_id, total_amount, shipping_address, status) 
       VALUES (:1, :2, :3, 'PENDING')`,
      [customer_id, total_amount, shipping_address || '']
    );

    // 2. Get the last inserted order_id
    console.log('Step 2: Getting order ID...');
    const orderIdResult = await executeQuery(
      'SELECT order_id FROM (SELECT order_id FROM orders ORDER BY order_id DESC) WHERE ROWNUM = 1'
    );
    
    if (!orderIdResult.rows || orderIdResult.rows.length === 0) {
      throw new Error('Failed to retrieve order ID');
    }
    
    const orderId = orderIdResult.rows[0].ORDER_ID;
    console.log('✅ Order ID created:', orderId);

    // 3. Insert order items
    console.log('Step 3: Inserting order items...');
    for (const item of items) {
      console.log('Processing item:', item);
      
      // Insert order item
      await executeQuery(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES (:1, :2, :3, :4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      console.log(`Updating stock for product ${item.product_id}`);
      const updateResult = await executeQuery(
        'UPDATE product SET stock = stock - :1 WHERE product_id = :2',
        [item.quantity, item.product_id]
      );
      
      if (updateResult.rowsAffected === 0) {
        console.warn(`⚠️ No stock updated for product ${item.product_id}`);
      }
    }

    // 4. Create payment record
    console.log('Step 4: Creating payment record...');
    await executeQuery(
      `INSERT INTO payment (order_id, amount, payment_method, status) 
       VALUES (:1, :2, :3, 'COMPLETED')`,
      [orderId, total_amount, payment_method]
    );

    // 5. Update order status
    console.log('Step 5: Updating order status...');
    await executeQuery(
      "UPDATE orders SET status = 'PROCESSING' WHERE order_id = :1",
      [orderId]
    );

    console.log('✅ Order completed successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: orderId,
        message: 'Order created successfully'
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Order creation error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to create order';
    if (error.message.includes('ORA-02291')) {
      errorMessage = 'Invalid customer or product ID. Please check your data.';
    } else if (error.message.includes('ORA-00001')) {
      errorMessage = 'Duplicate order detected.';
    } else if (error.message.includes('ORA-01400')) {
      errorMessage = 'Missing required data.';
    } else if (error.message.includes('ORA-12899')) {
      errorMessage = 'Data too long for column.';
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

module.exports = { POST };