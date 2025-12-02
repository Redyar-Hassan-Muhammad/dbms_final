import { executeQuery } from '../../../db/oracle';

export async function GET() {
  try {
    const result = await executeQuery(`
      SELECT p.*, c.name as category_name 
      FROM product p 
      LEFT JOIN category c ON p.category_id = c.category_id
      ORDER BY p.product_id
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

export async function POST(request) {
  try {
    const { name, description, price, stock, category_id } = await request.json();
    
    const result = await executeQuery(
      `INSERT INTO product (name, description, price, stock, category_id) 
       VALUES (:1, :2, :3, :4, :5)`,
      [name, description, price, stock, category_id]
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