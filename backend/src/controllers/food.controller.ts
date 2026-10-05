import { Request, Response } from 'express';
import {
  getAllFoodsService,
  getFoodByIdService,
  createFoodService,
  updateFoodService,
  deleteFoodService,
  toggleFoodAvailabilityService,
} from '../services/food.service';
import { sendSuccess, sendError } from '../utils/response';

export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, categoryId, search, isVeg, limit, all } = req.query;

    const foods = await getAllFoodsService({
      restaurantId: typeof restaurantId === 'string' ? restaurantId : undefined,
      categoryId: typeof categoryId === 'string' ? categoryId : undefined,
      search: typeof search === 'string' ? search : undefined,
      isVeg: isVeg !== undefined ? isVeg === 'true' : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      all: all === 'true',
    });

    sendSuccess(res, 'Food items fetched successfully', foods);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch foods', null, 500);
  }
};

export const getFoodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const food = await getFoodByIdService(id);
    if (!food) {
      sendError(res, 'Food item not found', null, 404);
      return;
    }
    sendSuccess(res, 'Food item fetched successfully', food);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch food item', null, 500);
  }
};

export const createFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, restaurantId, categoryId, image, isVeg } = req.body;
    if (!name || !price || !restaurantId || !categoryId || !image) {
      sendError(res, 'Please provide name, price, restaurantId, categoryId, and image', null, 400);
      return;
    }

    const food = await createFoodService(req.body);
    sendSuccess(res, 'Food item created successfully', food, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create food item', null, 400);
  }
};

export const updateFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const updated = await updateFoodService(id, req.body);
    if (!updated) {
      sendError(res, 'Food item not found', null, 404);
      return;
    }
    sendSuccess(res, 'Food item updated successfully', updated);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update food item', null, 400);
  }
};

export const deleteFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const deleted = await deleteFoodService(id);
    if (!deleted) {
      sendError(res, 'Food item not found', null, 404);
      return;
    }
    sendSuccess(res, 'Food item deleted successfully', { id });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete food item', null, 400);
  }
};

export const toggleFoodAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const food = await toggleFoodAvailabilityService(id);
    if (!food) {
      sendError(res, 'Food item not found', null, 404);
      return;
    }
    sendSuccess(res, `Availability updated to ${food.isAvailable ? 'available' : 'unavailable'}`, food);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to toggle availability', null, 400);
  }
};
