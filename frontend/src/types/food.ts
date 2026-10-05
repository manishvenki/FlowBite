import { Category } from './category';
import { Restaurant } from './restaurant';

export interface Food {
  _id: string;
  restaurantId: string | Restaurant;
  categoryId: string | Category;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
