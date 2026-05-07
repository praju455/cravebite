import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/admin.api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // auto-refresh every 30 seconds
    staleTime: 15000,       // consider data stale after 15s
  });
};
