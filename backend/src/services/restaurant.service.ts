import { Restaurant, IRestaurant } from '../models/Restaurant';
import { Food } from '../models/Food';

export interface RestaurantFilter {
  search?: string;
  cuisine?: string;
  isOpen?: boolean;
  all?: boolean;
}

export const getAllRestaurantsService = async (
  filter: RestaurantFilter = {}
): Promise<IRestaurant[]> => {
  const query: any = {};
  if (!filter.all) {
    query.isActive = true;
  }

  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { cuisine: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
      { area: { $regex: filter.search, $options: 'i' } },
    ];
  }

  if (filter.cuisine && filter.cuisine !== 'All') {
    query.cuisine = { $regex: filter.cuisine, $options: 'i' };
  }

  if (typeof filter.isOpen === 'boolean') {
    query.isOpen = filter.isOpen;
  }

  return await Restaurant.find(query).sort({ rating: -1, createdAt: -1 });
};

export const getRestaurantByIdService = async (
  id: string
): Promise<{ restaurant: IRestaurant; foods: any[] }> => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant || !restaurant.isActive) {
    throw new Error('Restaurant not found');
  }

  const foods = await Food.find({ restaurantId: id, isAvailable: true }).populate('categoryId');

  return { restaurant, foods };
};

export const createRestaurantService = async (
  restaurantData: Partial<IRestaurant>
): Promise<IRestaurant> => {
  return await Restaurant.create(restaurantData);
};

export const updateRestaurantService = async (
  id: string,
  restaurantData: Partial<IRestaurant>
): Promise<IRestaurant | null> => {
  return await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true });
};

export const toggleRestaurantStatusService = async (
  id: string,
  field: 'isOpen' | 'isActive' = 'isOpen'
): Promise<IRestaurant | null> => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) return null;
  if (field === 'isOpen') {
    restaurant.isOpen = !restaurant.isOpen;
  } else {
    restaurant.isActive = !restaurant.isActive;
  }
  return await restaurant.save();
};
