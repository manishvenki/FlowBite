import { Request, Response } from 'express';
import {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  toggleCategoryStatusService,
} from '../services/category.service';
import { sendSuccess, sendError } from '../utils/response';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all } = req.query;
    const categories = await getAllCategoriesService(all === 'true');
    sendSuccess(res, 'Categories fetched successfully', categories);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch categories', null, 500);
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      sendError(res, 'Category name and image URL are required', null, 400);
      return;
    }

    const category = await createCategoryService(req.body);
    sendSuccess(res, 'Category created successfully', category, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create category', null, 400);
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const updated = await updateCategoryService(id, req.body);
    if (!updated) {
      sendError(res, 'Category not found', null, 404);
      return;
    }
    sendSuccess(res, 'Category updated successfully', updated);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update category', null, 400);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const deleted = await deleteCategoryService(id);
    if (!deleted) {
      sendError(res, 'Category not found', null, 404);
      return;
    }
    sendSuccess(res, 'Category deleted successfully', { id });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete category', null, 400);
  }
};

export const toggleCategoryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const cat = await toggleCategoryStatusService(id);
    if (!cat) {
      sendError(res, 'Category not found', null, 404);
      return;
    }
    sendSuccess(res, `Category is now ${cat.isActive ? 'active' : 'inactive'}`, cat);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to toggle category status', null, 400);
  }
};
