import { executeQuery } from '../../../../db/oracle';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Find customer by email
    const result = await executeQuery(
      'SELECT * FROM customer WHERE email = :1',
      [email]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
      });
    }

    const customer = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer.PASSWORD);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
      });
    }

    // Create token
    const token = jwt.sign(
      { customerId: customer.CUSTOMER_ID, email: customer.EMAIL },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from customer data
    const { PASSWORD, ...customerWithoutPassword } = customer;

    return new Response(JSON.stringify({
      token,
      customer: customerWithoutPassword
    }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}