import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

export class AuthService {
  static async registerUser(data: any) {
    const { name, email, password, phone, address } = data;

    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new ApiError(400, 'Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, phone, address',
      [name, email, hashedPassword, phone, address]
    );

    return result.rows[0];
  }

  static async loginUser(data: any) {
    const { email, password } = data;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const user = result.rows[0];
    
    // Fallback if password column is null (e.g. users from old dummy data without passwords)
    if (!user.password) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign({ id: user.user_id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

    return {
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
