import { pool } from '../../config/db';
import { redisClient } from '../../config/redis';

export class MenuService {
  static async getMenuByRestaurant(restaurantId: number) {
    const cacheKey = `menu:${restaurantId}`;
    
    // Try Redis cache only if connected
    if (redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) return JSON.parse(cached.toString());
      } catch (err) {
        // Continue without cache if Redis fails
      }
    }

    const result = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = TRUE', [restaurantId]);
    
    // Group by category
    const menuByCategory = result.rows.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    // Cache only if Redis is connected
    if (redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify(menuByCategory));
      } catch (err) {
        // Continue without caching if Redis fails
      }
    }
    
    return menuByCategory;
  }
}
