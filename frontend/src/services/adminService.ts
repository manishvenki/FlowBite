import api from './api';
import { Food } from '../types/food';
import { Category } from '../types/category';
import { Restaurant } from '../types/restaurant';

export interface AdminDashboardData {
  kpi: {
    todayOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalCustomers: number;
  };
  recentOrders: any[];
  popularItems: Array<{ name: string; count: number; revenue: number }>;
  restaurants: Restaurant[];
  statusCounts: Record<string, number>;
  totalOrdersCount: number;
}

export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  addressesCount: number;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboardData> {
    const res: any = await api.get('/admin/dashboard');
    return res.data;
  },

  async getCustomers(): Promise<AdminCustomer[]> {
    const res: any = await api.get('/admin/customers');
    return res.data;
  },

  // Food Menu Management
  async getAdminFoods(): Promise<Food[]> {
    const res: any = await api.get('/foods?all=true');
    return res.data;
  },

  async createFood(data: Partial<Food>): Promise<Food> {
    const res: any = await api.post('/foods', data);
    return res.data;
  },

  async updateFood(id: string, data: Partial<Food>): Promise<Food> {
    const res: any = await api.put(`/foods/${id}`, data);
    return res.data;
  },

  async deleteFood(id: string): Promise<void> {
    await api.delete(`/foods/${id}`);
  },

  async toggleFoodAvailability(id: string): Promise<Food> {
    const res: any = await api.patch(`/foods/${id}/toggle`);
    return res.data;
  },

  // Category Management
  async getAdminCategories(): Promise<Category[]> {
    const res: any = await api.get('/categories?all=true');
    return res.data;
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res: any = await api.post('/categories', data);
    return res.data;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res: any = await api.put(`/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async toggleCategoryStatus(id: string): Promise<Category> {
    const res: any = await api.patch(`/categories/${id}/toggle`);
    return res.data;
  },

  // Restaurant Management
  async getAdminRestaurants(): Promise<Restaurant[]> {
    const res: any = await api.get('/restaurants?all=true');
    return res.data;
  },

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const res: any = await api.post('/restaurants', data);
    return res.data;
  },

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const res: any = await api.put(`/restaurants/${id}`, data);
    return res.data;
  },

  async toggleRestaurant(id: string, field: 'isOpen' | 'isActive'): Promise<Restaurant> {
    const res: any = await api.patch(`/restaurants/${id}/toggle`, { field });
    return res.data;
  },
};
