import { Router, Request, Response } from 'express';
import { MenuService } from './menu.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { apiLimiter } from '../../middleware/rateLimiter';

export class MenuController {
  static getMenu = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurant_id);
    const menu = await MenuService.getMenuByRestaurant(restaurantId);
    res.json(new ApiResponse(200, menu));
  });
}

const router = Router();
router.use(apiLimiter);
router.get('/:restaurant_id', MenuController.getMenu);

export default router;
