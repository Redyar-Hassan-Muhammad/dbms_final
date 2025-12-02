import { executeQuery } from '../../../db/oracle';

export async function POST(request) {
  try {
    const { order_id, amount, payment_method } = await request.json();
    
    const result = await executeQuery(
      `INSERT INTO payment (order_id, amount, payment_method) 
       VALUES (:1, :2, :3)`,
      [order_id, amount, payment_method]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    let query = `
      SELECT p.*, o.customer_id 
      FROM payment p 
      JOIN orders o ON p.order_id = o.order_id
    `;
    let params = [];

    if (orderId) {
      query += ' WHERE p.order_id = :1';
      params = [orderId];
    }

    query += ' ORDER BY p.payment_date DESC';

    const result = await executeQuery(query, params);
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}