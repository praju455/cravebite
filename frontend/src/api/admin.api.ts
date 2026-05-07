import { adminApi } from './axiosInstance';
import { ApiResponse } from '../types';

export const getDashboardStats = async (): Promise<any> => {
  const [kpiRes, revRes, statusRes, itemsRes] = await Promise.all([
    adminApi.get<ApiResponse<any>>('/stats/dashboard'),
    adminApi.get<ApiResponse<any>>('/stats/revenue'),
    adminApi.get<ApiResponse<any>>('/stats/orders-today'),
    adminApi.get<ApiResponse<any>>('/stats/popular-items'),
  ]);

  const formattedRev = revRes.data.data.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: parseFloat(d.revenue),
  }));

  const formattedStatus = statusRes.data.data.map((d: any) => ({
    name: d.status,
    value: parseInt(d.count),
  }));

  return {
    kpi: kpiRes.data.data,
    revenueData: formattedRev,
    orderStatusData: formattedStatus,
    topItems: itemsRes.data.data,
  };
};
