import { Food } from './food';

export interface CartItem {
  food: Food;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  deliveryFee: number;
}

export interface CartTotals {
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  grandTotal: number;
  itemCount: number;
}
