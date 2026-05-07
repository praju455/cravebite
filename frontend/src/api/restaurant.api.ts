import { api } from './axiosInstance';
import { Restaurant, ApiResponse } from '../types';

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data } = await api.get<ApiResponse<Restaurant[]>>('/restaurants');
  return data.data;
};

export const getTopRestaurants = async (): Promise<Restaurant[]> => {
  const { data } = await api.get<ApiResponse<Restaurant[]>>('/restaurants/top');
  return data.data;
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
  const { data } = await api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
  return data.data;
};

export const getMenu = async (restaurantId: number): Promise<Record<string, any[]>> => {
  const { data } = await api.get<ApiResponse<Record<string, any[]>>>(`/menu/${restaurantId}`);
  return data.data;
};
