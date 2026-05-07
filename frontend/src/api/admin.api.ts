import { api } from './axiosInstance';
import { ApiResponse } from '../types';

export const getDashboardStats = async (): Promise<any> => {
  const [kpiRes, revRes, statusRes, itemsRes] = await Promise.all([
    api.get<ApiResponse<any>>('/stats/dashboard'),
    api.get<ApiResponse<any>>('/stats/revenue'),
    api.get<ApiResponse<any>>('/stats/orders-today'),
    api.get<ApiResponse<any>>('/stats/popular-items')
  ]);

  // Format revenue dates
  const formattedRev = revRes.data.data.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: parseFloat(d.revenue)
  }));

  // Format status data for pie chart
  const formattedStatus = statusRes.data.data.map((d: any) => ({
    name: d.status,
    value: parseInt(d.count)
  }));

  return {
    kpi: kpiRes.data.data,
    revenueData: formattedRev,
    orderStatusData: formattedStatus,
    topItems: itemsRes.data.data
  };
};
