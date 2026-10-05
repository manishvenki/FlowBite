import api from './api';
import { Food } from '../types/food';

export interface FoodFilterParams {
  restaurantId?: string;
  categoryId?: string;
  search?: string;
  isVeg?: boolean;
  limit?: number;
}

export const foodService = {
  async getFoods(params?: FoodFilterParams): Promise<Food[]> {
    const res: any = await api.get('/foods', { params });
    return res.data;
  },

  async getFoodById(id: string): Promise<Food> {
    const res: any = await api.get(`/foods/${id}`);
    return res.data;
  },
};
