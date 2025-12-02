import { executeQuery } from '../../../../db/oracle';

export async function GET() {
  try {
    const result = await executeQuery(`
      SELECT o.*, c.fullname as customer_name 
      FROM orders o 
      JOIN customer c ON o.customer_id = c.customer_id 
      ORDER BY o.order_date DESC 
      FETCH FIRST 10 ROWS ONLY
    `);

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