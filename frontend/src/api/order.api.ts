import { api } from './axiosInstance';
import { Order, ApiResponse } from '../types';

export const trackOrder = async (id: number): Promise<any> => {
  const { data } = await api.get<ApiResponse<any>>(`/orders/\${id}/track`);
  return data.data;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<ApiResponse<Order[]>>('/orders/history');
  return data.data;
};
