import api from './api';
import { Category } from '../types/category';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res: any = await api.get('/categories');
    return res.data;
  },
};
