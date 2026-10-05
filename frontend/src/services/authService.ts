import api from './api';
import { User, Address } from '../types/user';

export interface RegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResponseData> {
    const res: any = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: LoginDTO): Promise<AuthResponseData> {
    const res: any = await api.post('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<{ user: User }> {
    const res: any = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(data: { name?: string; phone?: string }): Promise<User> {
    const res: any = await api.put('/users/profile', data);
    return res.data;
  },

  async addAddress(data: Omit<Address, '_id'>): Promise<Address[]> {
    const res: any = await api.post('/users/addresses', data);
    return res.data;
  },

  async updateAddress(addressId: string, data: Partial<Address>): Promise<Address[]> {
    const res: any = await api.put(`/users/addresses/${addressId}`, data);
    return res.data;
  },

  async deleteAddress(addressId: string): Promise<Address[]> {
    const res: any = await api.delete(`/users/addresses/${addressId}`);
    return res.data;
  },

  async setDefaultAddress(addressId: string): Promise<Address[]> {
    const res: any = await api.put(`/users/addresses/${addressId}/default`);
    return res.data;
  },
};
