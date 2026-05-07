import { Request, Response } from 'express';
import { RestaurantService } from './restaurant.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

export class RestaurantController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const restaurants = await RestaurantService.getAllRestaurants();
    res.json(new ApiResponse(200, restaurants));
  });

  static getTop = asyncHandler(async (req: Request, res: Response) => {
    const restaurants = await RestaurantService.getTopRestaurants();
    res.json(new ApiResponse(200, restaurants));
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const restaurant = await RestaurantService.getRestaurantById(parseInt(req.params.id));
    res.json(new ApiResponse(200, restaurant));
  });

  static getReviews = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await RestaurantService.getRestaurantReviews(parseInt(req.params.id));
    res.json(new ApiResponse(200, reviews));
  });
}
