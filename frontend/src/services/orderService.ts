import api from './api';
import { Order, CreateOrderPayload, OrderStatus } from '../types/order';

export const orderService = {
  async createOrder(data: CreateOrderPayload): Promise<Order> {
    const res: any = await api.post('/orders', data);
    return res.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res: any = await api.get('/orders');
    return res.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res: any = await api.get(`/orders/${id}`);
    return res.data;
  },

  async getAllOrders(status?: string): Promise<Order[]> {
    const res: any = await api.get('/orders/all', {
      params: status && status !== 'ALL' ? { status } : undefined,
    });
    return res.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res: any = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },
};
