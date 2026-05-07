import { Router, Request, Response } from 'express';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { authenticate, adminOnly } from '../../middleware/auth';

export class AdminController {
  static getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const totalOrdersResult = await pool.query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE");
    const revenueResult = await pool.query("SELECT SUM(total_amount) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status = 'Delivered'");
    const activeDeliveriesResult = await pool.query("SELECT COUNT(*) FROM orders WHERE status IN ('Confirmed', 'Preparing', 'Out for Delivery')");
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const recentOrders = await pool.query("SELECT * FROM order_summary_view ORDER BY created_at DESC LIMIT 5");

    res.json(new ApiResponse(200, {
      totalOrdersToday: parseInt(totalOrdersResult.rows[0].count) || 0,
      revenueToday: parseFloat(revenueResult.rows[0].sum) || 0,
      activeDeliveries: parseInt(activeDeliveriesResult.rows[0].count) || 0,
      totalUsers: parseInt(usersResult.rows[0].count) || 0,
      recentOrders: recentOrders.rows
    }));
  });

  static getPopularItems = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM popular_items_view');
    res.json(new ApiResponse(200, result.rows));
  });

  static getRevenueStats = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query(`
      SELECT DATE(created_at) as date, SUM(total_amount) as revenue 
      FROM orders 
      WHERE status = 'Delivered' 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC 
      LIMIT 7
    `);
    res.json(new ApiResponse(200, result.rows));
  });

  static getOrdersToday = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      WHERE DATE(created_at) = CURRENT_DATE 
      GROUP BY status
    `);
    res.json(new ApiResponse(200, result.rows));
  });
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query(
      `SELECT user_id, name, email, phone, address, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(new ApiResponse(200, result.rows));
  });

  static getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query(
      `SELECT * FROM order_summary_view ORDER BY created_at DESC LIMIT 50`
    );
    res.json(new ApiResponse(200, result.rows));
  });
}

const router = Router();

// All admin stats routes require authentication + admin role
router.use(authenticate, adminOnly);

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/popular-items', AdminController.getPopularItems);
router.get('/revenue', AdminController.getRevenueStats);
router.get('/orders-today', AdminController.getOrdersToday);
router.get('/users', AdminController.getAllUsers);
router.get('/orders', AdminController.getAllOrders);

export default router;
