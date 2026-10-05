export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  address: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  isActive: boolean;
  phone?: string;
  email?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}
