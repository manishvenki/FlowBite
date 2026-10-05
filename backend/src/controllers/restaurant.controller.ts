import { Request, Response } from 'express';
import {
  getAllRestaurantsService,
  getRestaurantByIdService,
  createRestaurantService,
  updateRestaurantService,
  toggleRestaurantStatusService,
} from '../services/restaurant.service';
import { sendSuccess, sendError } from '../utils/response';

export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, cuisine, isOpen, all } = req.query;
    const filter = {
      search: typeof search === 'string' ? search : undefined,
      cuisine: typeof cuisine === 'string' ? cuisine : undefined,
      isOpen: isOpen !== undefined ? isOpen === 'true' : undefined,
      all: all === 'true',
    };

    const restaurants = await getAllRestaurantsService(filter);
    sendSuccess(res, 'Restaurants fetched successfully', restaurants);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch restaurants', null, 500);
  }
};

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const data = await getRestaurantByIdService(id);
    sendSuccess(res, 'Restaurant details fetched successfully', data);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch restaurant', null, 404);
  }
};

export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, cuisine, image, address } = req.body;
    if (!name || !description || !cuisine || !image || !address) {
      sendError(res, 'Name, description, cuisine, image, and address are required', null, 400);
      return;
    }

    const restaurant = await createRestaurantService(req.body);
    sendSuccess(res, 'Restaurant created successfully', restaurant, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create restaurant', null, 400);
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const updated = await updateRestaurantService(id, req.body);
    if (!updated) {
      sendError(res, 'Restaurant not found', null, 404);
      return;
    }
    sendSuccess(res, 'Restaurant updated successfully', updated);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update restaurant', null, 400);
  }
};

export const toggleRestaurantStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const field = req.body.field === 'isActive' ? 'isActive' : 'isOpen';
    const updated = await toggleRestaurantStatusService(id, field);
    if (!updated) {
      sendError(res, 'Restaurant not found', null, 404);
      return;
    }
    sendSuccess(res, `Restaurant ${field} updated successfully`, updated);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to toggle restaurant status', null, 400);
  }
};
