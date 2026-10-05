import api from './api';
import { Restaurant } from '../types/restaurant';
import { Food } from '../types/food';

export interface RestaurantFilterParams {
  search?: string;
  cuisine?: string;
  isOpen?: boolean;
  all?: boolean;
}

export const restaurantService = {
  async getRestaurants(params?: RestaurantFilterParams): Promise<Restaurant[]> {
    const res: any = await api.get('/restaurants', { params });
    return res.data;
  },

  async getRestaurantById(id: string): Promise<{ restaurant: Restaurant; foods: Food[] }> {
    const res: any = await api.get(`/restaurants/${id}`);
    return res.data;
  },
};
