import { Router, Request, Response } from 'express';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { authenticate } from '../../middleware/auth';
import { ApiError } from '../../utils/ApiError';

export class OrderService {
  static async placeOrder(userId: number, restaurantId: number, items: any[]) {
    const result = await pool.query('CALL place_order($1, $2, $3, null)', [userId, restaurantId, JSON.stringify(items)]);
    return result.rows[0].p_order_id;
  }

  static async getUserOrders(userId: number) {
    const result = await pool.query('SELECT * FROM order_summary_view WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = $1) ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  static async assignDelivery(orderId: number) {
    await pool.query('CALL assign_delivery($1)', [orderId]);
  }

  static async trackOrder(orderId: number) {
    const orderResult = await pool.query('SELECT * FROM order_summary_view WHERE order_id = $1', [orderId]);
    const deliveryResult = await pool.query(`
      SELECT d.*, a.name as agent_name, a.phone as agent_phone, a.vehicle, a.rating 
      FROM deliveries d 
      LEFT JOIN delivery_agents a ON d.agent_id = a.agent_id 
      WHERE d.order_id = $1`, [orderId]);
      
    if (orderResult.rows.length === 0) throw new ApiError(404, 'Order not found');
    
    return {
      order: orderResult.rows[0],
      delivery: deliveryResult.rows[0] || null
    };
  }
}

export class OrderController {
  static placeOrder = asyncHandler(async (req: Request, res: Response) => {
    const { restaurant_id, items } = req.body;
    const order_id = await OrderService.placeOrder(req.user.user_id, restaurant_id, items);
    
    // Auto-assign delivery for simulation
    try {
        await OrderService.assignDelivery(order_id);
    } catch(e) {
        console.error("Delivery assignment failed, order still placed.", e);
    }
    
    res.status(201).json(new ApiResponse(201, { order_id }, 'Order placed successfully'));
  });

  static getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderService.getUserOrders(req.user.user_id);
    res.json(new ApiResponse(200, orders));
  });

  static trackOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);
    const tracking = await OrderService.trackOrder(orderId);
    res.json(new ApiResponse(200, tracking));
  });
}

const router = Router();
router.use(authenticate); // Protect all order routes
router.post('/', OrderController.placeOrder);
router.get('/history', OrderController.getUserOrders);
router.get('/:id/track', OrderController.trackOrder);

export default router;
