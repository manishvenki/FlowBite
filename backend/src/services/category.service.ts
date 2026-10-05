import { Category, ICategory } from '../models/Category';

export const getAllCategoriesService = async (includeInactive: boolean = false): Promise<ICategory[]> => {
  const query = includeInactive ? {} : { isActive: true };
  return await Category.find(query).sort({ name: 1 });
};

export const createCategoryService = async (
  categoryData: Partial<ICategory>
): Promise<ICategory> => {
  return await Category.create(categoryData);
};

export const updateCategoryService = async (
  id: string,
  categoryData: Partial<ICategory>
): Promise<ICategory | null> => {
  return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};

export const deleteCategoryService = async (id: string): Promise<boolean> => {
  const result = await Category.findByIdAndDelete(id);
  return !!result;
};

export const toggleCategoryStatusService = async (id: string): Promise<ICategory | null> => {
  const cat = await Category.findById(id);
  if (!cat) return null;
  cat.isActive = !cat.isActive;
  await cat.save();
  return cat;
};
