export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Restaurant {
  restaurant_id: number;
  name: string;
  cuisine_type: string;
  city: string;
  rating: string;
  delivery_time_mins: number;
  is_open: boolean;
  image_url: string;
}

export interface MenuItem {
  item_id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  is_veg: boolean;
  is_available: boolean;
  image_url: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  order_id: number;
  created_at: string;
  total_amount: string;
  status: 'Placed' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  user_name?: string;
  restaurant_name?: string;
  payment_method?: string;
  payment_status?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
