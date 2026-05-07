import { Router } from 'express';
import { RestaurantController } from './restaurant.controller';
import { apiLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter);
router.get('/', RestaurantController.getAll);
router.get('/top', RestaurantController.getTop);
router.get('/:id', RestaurantController.getById);
router.get('/:id/reviews', RestaurantController.getReviews);

export default router;
