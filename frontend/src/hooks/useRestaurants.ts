import { useQuery } from '@tanstack/react-query';
import { getRestaurants, getTopRestaurants, getRestaurantById, getMenu } from '../api/restaurant.api';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  });
};

export const useTopRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants', 'top'],
    queryFn: getTopRestaurants,
  });
};

export const useRestaurant = (id: number) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id),
    enabled: !!id,
  });
};

export const useMenu = (restaurantId: number) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => getMenu(restaurantId),
    enabled: !!restaurantId,
  });
};
