import { Food, IFood } from '../models/Food';

export interface FoodFilter {
  restaurantId?: string;
  categoryId?: string;
  search?: string;
  isVeg?: boolean;
  limit?: number;
  all?: boolean; // if true, include unavailable items (for admin)
}

export const getAllFoodsService = async (filter: FoodFilter = {}): Promise<IFood[]> => {
  const query: any = {};

  if (!filter.all) {
    query.isAvailable = true;
  }

  if (filter.restaurantId) {
    query.restaurantId = filter.restaurantId;
  }

  if (filter.categoryId) {
    query.categoryId = filter.categoryId;
  }

  if (typeof filter.isVeg === 'boolean') {
    query.isVeg = filter.isVeg;
  }

  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
    ];
  }

  let dbQuery = Food.find(query)
    .sort({ createdAt: -1 })
    .populate('restaurantId', 'name image rating deliveryTime')
    .populate('categoryId', 'name');

  if (filter.limit) {
    dbQuery = dbQuery.limit(filter.limit);
  }

  return await dbQuery.exec();
};

export const getFoodByIdService = async (id: string): Promise<IFood | null> => {
  return await Food.findById(id).populate('restaurantId').populate('categoryId');
};

export const createFoodService = async (foodData: Partial<IFood>): Promise<IFood> => {
  return await Food.create(foodData);
};

export const updateFoodService = async (
  id: string,
  foodData: Partial<IFood>
): Promise<IFood | null> => {
  return await Food.findByIdAndUpdate(id, foodData, { new: true })
    .populate('restaurantId', 'name image')
    .populate('categoryId', 'name');
};

export const deleteFoodService = async (id: string): Promise<boolean> => {
  const result = await Food.findByIdAndDelete(id);
  return !!result;
};

export const toggleFoodAvailabilityService = async (id: string): Promise<IFood | null> => {
  const food = await Food.findById(id);
  if (!food) return null;
  food.isAvailable = !food.isAvailable;
  await food.save();
  return food;
};
