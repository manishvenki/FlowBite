import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types/category';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const AdminCategoriesPage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminCategories();
      setCategories(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setImage('');
    setIsActive(true);
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setImage(c.image);
    setIsActive(c.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      toastError('Please provide category name and image URL');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, { name, image, isActive });
        success(`"${name}" updated successfully`);
      } else {
        await adminService.createCategory({ name, image, isActive });
        success(`"${name}" created`);
      }
      setModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toastError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await adminService.deleteCategory(categoryToDelete._id);
      success(`"${categoryToDelete.name}" deleted`);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete category');
    }
  };

  const handleToggle = async (c: Category) => {
    try {
      const updated = await adminService.toggleCategoryStatus(c._id);
      success(`"${c.name}" is now ${updated.isActive ? 'Active' : 'Disabled'}`);
      setCategories((prev) => prev.map((item) => (item._id === c._id ? updated : item)));
    } catch (err: any) {
      toastError(err.message || 'Failed to toggle category');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Category Management"
        subtitle="Organize culinary collections, cuisine pills, and category visibility."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Category
          </Button>
        }
      />

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <SkeletonLoader type="card" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map((c) => (
            <Card
              key={c._id}
              className={`p-4 transition-all flex flex-col justify-between ${
                !c.isActive ? 'opacity-60 bg-sand/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-16 h-16 rounded-xl object-cover border border-sand-border shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-serif-title font-bold text-base text-olive-dark">
                    {c.name}
                  </h4>
                  <Badge variant={c.isActive ? 'olive' : 'neutral'} size="sm">
                    {c.isActive ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-sand-border/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggle(c)}
                  className={`font-semibold transition-colors flex items-center gap-1 ${
                    c.isActive
                      ? 'text-olive hover:text-rose-600'
                      : 'text-olive-dark/60 hover:text-emerald-700'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{c.isActive ? 'Disable' : 'Enable'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-olive-dark/60 hover:text-olive hover:bg-sand/40"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(c);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-olive-dark/60 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        description="Provide cuisine category name and header photo"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Artisanal Sourdough & Breads"
            required
          />

          <Input
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-olive-dark">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-olive focus:ring-olive"
            />
            <span>Enable in Customer Navigation</span>
          </label>

          <div className="pt-3 border-t border-sand-border/60 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
        description={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
      >
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Keep Category
          </Button>
          <Button variant="terracotta" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
