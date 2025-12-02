import { executeQuery } from '../../../../db/oracle';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, price, stock, category_id } = await request.json();
    
    await executeQuery(
      `UPDATE product SET name = :1, description = :2, price = :3, 
       stock = :4, category_id = :5 WHERE product_id = :6`,
      [name, description, price, stock, category_id, id]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await executeQuery('DELETE FROM product WHERE product_id = :1', [id]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}