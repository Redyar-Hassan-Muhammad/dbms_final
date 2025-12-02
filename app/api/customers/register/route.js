import { executeQuery } from '../../../../db/oracle';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { fullname, email, phone, password } = await request.json();
    
    // Check if email already exists
    const existingUser = await executeQuery(
      'SELECT * FROM customer WHERE email = :1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new customer
    const result = await executeQuery(
      `INSERT INTO customer (fullname, email, phone, password) 
       VALUES (:1, :2, :3, :4)`,
      [fullname, email, phone, hashedPassword]
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