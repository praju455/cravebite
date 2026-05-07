import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

// In-memory OTP store: { email -> { otp, expiresAt } }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

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
    if (result.rows.length === 0) throw new ApiError(401, 'Invalid credentials');
    const user = result.rows[0];
    if (!user.password) throw new ApiError(401, 'Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');
    const token = jwt.sign({ id: user.user_id, isAdmin: user.is_admin }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    return {
      user: { id: user.user_id, name: user.name, email: user.email, isAdmin: user.is_admin },
      token,
    };
  }

  static async adminLogin(data: any) {
    const { email, password } = data;
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_admin = TRUE', [email]);
    if (result.rows.length === 0) throw new ApiError(403, 'Access denied. Not an admin account.');
    const user = result.rows[0];
    if (!user.password) throw new ApiError(401, 'Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');
    const token = jwt.sign({ id: user.user_id, isAdmin: true }, env.JWT_SECRET, { expiresIn: '8h' });
    return {
      admin: { id: user.user_id, name: user.name, email: user.email },
      token,
    };
  }

  static async sendOtp(email: string) {
    const result = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) throw new ApiError(404, 'No account found with this email');

    const otp = generateOtp();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
    console.log(`[OTP] ${email} → ${otp}`); // In production, send via SMS/email
    return { message: 'OTP sent successfully', otp }; // Return OTP for demo
  }

  static async verifyOtp(email: string, otp: string) {
    const record = otpStore.get(email);
    if (!record) throw new ApiError(400, 'No OTP requested for this email');
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      throw new ApiError(400, 'OTP has expired. Please request a new one');
    }
    if (record.otp !== otp) throw new ApiError(400, 'Invalid OTP');

    otpStore.delete(email);

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    const token = jwt.sign({ id: user.user_id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

    return {
      user: { id: user.user_id, name: user.name, email: user.email },
      token,
    };
  }
}
