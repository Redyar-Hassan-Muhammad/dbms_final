import { executeQuery } from '../../../../../db/oracle';

export async function GET(request, { params }) {
  try {
    const { customerId } = params;
    
    const result = await executeQuery(
      `SELECT p.* 
       FROM payment p 
       JOIN orders o ON p.order_id = o.order_id 
       WHERE o.customer_id = :1 
       ORDER BY p.payment_date DESC`,
      [customerId]
    );

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