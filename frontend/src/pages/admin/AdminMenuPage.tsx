import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  UtensilsCrossed,
  RefreshCw,
  Power,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { restaurantService } from '../../services/restaurantService';
import { categoryService } from '../../services/categoryService';
import { Food } from '../../types/food';
import { Category } from '../../types/category';
import { Restaurant } from '../../types/restaurant';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatters';
import { getFoodImage, DEFAULT_FOOD_FALLBACK } from '../../utils/foodImage';

export const AdminMenuPage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  // Modal form states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fData, cData, rData] = await Promise.all([
        adminService.getAdminFoods(),
        categoryService.getCategories(),
        adminService.getAdminRestaurants(),
      ]);
      setFoods(fData);
      setCategories(cData);
      setRestaurants(rData);
    } catch (err: any) {
      toastError(err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId(categories[0]?._id || '');
    setRestaurantId(restaurants[0]?._id || '');
    setImage('');
    setIsVeg(false);
    setIsAvailable(true);
    setEditingFood(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    if (categories.length > 0) setCategoryId(categories[0]._id);
    if (restaurants.length > 0) setRestaurantId(restaurants[0]._id);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (f: Food) => {
    setEditingFood(f);
    setName(f.name);
    setDescription(f.description);
    setPrice(f.price.toString());
    setCategoryId(typeof f.categoryId === 'object' ? (f.categoryId as any)._id : f.categoryId);
    setRestaurantId(typeof f.restaurantId === 'object' ? (f.restaurantId as any)._id : f.restaurantId);
    setImage(f.image);
    setIsVeg(f.isVeg);
    setIsAvailable(f.isAvailable);
    setFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId || !restaurantId || !image) {
      toastError('Please fill out all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId as any,
        restaurantId: restaurantId as any,
        image,
        isVeg,
        isAvailable,
      };

      if (editingFood) {
        await adminService.updateFood(editingFood._id, payload);
        success(`"${name}" updated successfully`);
      } else {
        await adminService.createFood(payload);
        success(`"${name}" created in menu`);
      }

      setFormModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to save food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!foodToDelete) return;
    try {
      await adminService.deleteFood(foodToDelete._id);
      success(`"${foodToDelete.name}" deleted from menu`);
      setDeleteModalOpen(false);
      setFoodToDelete(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete food item');
    }
  };

  const handleToggle = async (food: Food) => {
    try {
      const updated = await adminService.toggleFoodAvailability(food._id);
      success(`"${food.name}" is now ${updated.isAvailable ? 'available' : 'unavailable'}`);
      setFoods((prev) => prev.map((f) => (f._id === food._id ? updated : f)));
    } catch (err: any) {
      toastError(err.message || 'Failed to toggle availability');
    }
  };

  const filteredFoods = foods.filter((f) => {
    const matchesSearch =
      !searchTerm ||
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());

    const catId = typeof f.categoryId === 'object' ? (f.categoryId as any)?._id : f.categoryId;
    const matchesCat = selectedCat === 'ALL' || catId === selectedCat;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Menu Management"
        subtitle="Manage food items, pricing, category tags, and instant stock availability."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Food Item
          </Button>
        }
      />

      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCat === 'ALL'
                ? 'bg-olive text-[#FFFDF5] shadow-sm'
                : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/60 border border-sand-border/80'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCat(c._id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCat === c._id
                  ? 'bg-olive text-[#FFFDF5] shadow-sm'
                  : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/60 border border-sand-border/80'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu dishes..."
            className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl py-2 pl-3 pr-8 text-xs focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
          />
          <Search className="w-3.5 h-3.5 text-olive-dark/50 absolute right-3 top-3" />
        </div>
      </div>

      {/* Food Items Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" />
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="p-8 text-center text-xs text-olive-dark/60">
            No food items found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-border text-olive-dark/70 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Kitchen</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/50">
                {filteredFoods.map((f: any) => {
                  const catName = typeof f.categoryId === 'object' ? f.categoryId?.name : 'Category';
                  const restName = typeof f.restaurantId === 'object' ? f.restaurantId?.name : 'Kitchen';

                  return (
                    <tr key={f._id} className="hover:bg-sand/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getFoodImage(f)}
                            alt={f.name}
                            className="w-10 h-10 rounded-lg object-cover border border-sand-border shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_FOOD_FALLBACK;
                            }}
                          />
                          <div>
                            <span className="font-semibold text-olive-dark block">
                              {f.name}
                            </span>
                            <span className="text-[10px] text-olive-dark/60 line-clamp-1 max-w-[200px]">
                              {f.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-olive-dark/80">{restName}</td>
                      <td className="py-3 px-4 text-olive-dark/80">{catName}</td>
                      <td className="py-3 px-4 font-bold text-olive-dark">
                        {formatCurrency(f.price)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={f.isVeg ? 'veg' : 'nonveg'} size="sm">
                          {f.isVeg ? 'Veg' : 'Non-Veg'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggle(f)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                            f.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                              : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                          title="Click to toggle availability"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              f.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                          <span>{f.isAvailable ? 'Available' : 'Sold Out'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 rounded-lg text-olive-dark/60 hover:text-olive hover:bg-sand/40 transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setFoodToDelete(f);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-olive-dark/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create / Edit Food Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingFood ? 'Edit Food Item' : 'Create Food Item'}
        description="Configure recipe name, pricing, category, and diet indicators"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Dish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Truffle Forest Mushroom Flatbread"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh ingredients, cooking style, and culinary notes..."
              rows={2}
              className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-3 text-xs focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Price (₹ INR)"
              type="number"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="249"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
                Kitchen
              </label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-2.5 text-xs text-olive-dark focus:ring-2 focus:ring-olive/20 outline-none"
                required
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-2.5 text-xs text-olive-dark focus:ring-2 focus:ring-olive/20 outline-none"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Image URL (Unsplash or web photo)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <div className="flex items-center gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-olive-dark">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="rounded text-olive focus:ring-olive"
              />
              <span>Vegetarian Dish</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-olive-dark">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded text-olive focus:ring-olive"
              />
              <span>Available In Stock</span>
            </label>
          </div>

          <div className="pt-3 border-t border-sand-border/60 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingFood ? 'Save Changes' : 'Create Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Food Item"
        description={`Are you sure you want to permanently delete "${foodToDelete?.name}" from the store catalog?`}
      >
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Keep Item
          </Button>
          <Button variant="terracotta" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
