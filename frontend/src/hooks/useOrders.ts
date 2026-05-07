import { useQuery } from '@tanstack/react-query';
import { trackOrder, getUserOrders } from '../api/order.api';

export const useOrderTracking = (id: number) => {
  return useQuery({
    queryKey: ['orderTracking', id],
    queryFn: () => trackOrder(id),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds for live tracking simulation
  });
};

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ['orderHistory'],
    queryFn: getUserOrders,
  });
};
