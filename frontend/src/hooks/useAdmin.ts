import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/admin.api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });
};
