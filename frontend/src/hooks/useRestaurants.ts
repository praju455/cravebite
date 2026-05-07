import { useQuery } from '@tanstack/react-query';
import { getRestaurants, getTopRestaurants, getRestaurantById } from '../api/restaurant.api';

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
