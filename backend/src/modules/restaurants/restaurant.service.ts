import { pool } from '../../config/db';
import { redisClient } from '../../config/redis';
import { ApiError } from '../../utils/ApiError';

export class RestaurantService {
  static async getAllRestaurants() {
    const cached = await redisClient.get('restaurants:all');
    if (cached) return JSON.parse(cached);

    const result = await pool.query('SELECT * FROM restaurants');
    await redisClient.setEx('restaurants:all', 300, JSON.stringify(result.rows)); // cache for 5 min
    return result.rows;
  }

  static async getTopRestaurants() {
    const cached = await redisClient.get('restaurants:top');
    if (cached) return JSON.parse(cached);

    const result = await pool.query('SELECT * FROM top_restaurants_view LIMIT 10');
    await redisClient.setEx('restaurants:top', 600, JSON.stringify(result.rows)); // cache for 10 min
    return result.rows;
  }

  static async getRestaurantById(id: number) {
    const result = await pool.query('SELECT * FROM restaurants WHERE restaurant_id = $1', [id]);
    if (result.rows.length === 0) throw new ApiError(404, 'Restaurant not found');
    return result.rows[0];
  }

  static async getRestaurantReviews(id: number) {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.user_id 
      WHERE r.restaurant_id = $1 
      ORDER BY r.created_at DESC`, [id]);
    return result.rows;
  }
}
