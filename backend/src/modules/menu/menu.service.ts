import { pool } from '../../config/db';
import { redisClient } from '../../config/redis';

export class MenuService {
  static async getMenuByRestaurant(restaurantId: number) {
    const cacheKey = `menu:\${restaurantId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const result = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = TRUE', [restaurantId]);
    
    // Group by category
    const menuByCategory = result.rows.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    await redisClient.setEx(cacheKey, 600, JSON.stringify(menuByCategory)); // cache for 10 min
    return menuByCategory;
  }
}
