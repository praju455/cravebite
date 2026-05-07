import { api } from './axiosInstance';
import { ApiResponse } from '../types';

export const getDashboardStats = async (): Promise<any> => {
  const { data } = await api.get<ApiResponse<any>>('/stats/dashboard');
  return data.data;
};
