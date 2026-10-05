import { Restaurant } from './restaurant';
import { User, Address } from './user';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg?: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string | User;
  restaurantId: string | Restaurant;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  deliveryAddress: {
    label?: string;
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    area?: string;
    street: string;
    city: string;
    state: string;
    pincode?: string;
    zipCode?: string;
    country?: string;
  };
  paymentStatus: PaymentStatus;
  paymentMethod: 'DEMO_PAYMENT';
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  restaurantId: string;
  items: Array<{
    foodId: string;
    quantity: number;
  }>;
  deliveryAddress: {
    label?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  transactionId?: string;
}
