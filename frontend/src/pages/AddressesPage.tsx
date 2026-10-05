import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
  Building,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Address } from '../types/user';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';

export const AddressesPage: React.FC = () => {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Form State
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setLabel('Home');
    setStreet('');
    setCity('Bengaluru');
    setState('Karnataka');
    setZipCode('');
    setIsDefault(false);
    setEditingAddress(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setLabel(addr.label || 'Home');
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setZipCode(addr.pincode || addr.zipCode || '');
    setIsDefault(addr.isDefault);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      toastError('Please fill out all address fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingAddress && editingAddress._id) {
        await updateAddress(editingAddress._id, {
          label,
          street,
          city,
          state,
          zipCode,
          isDefault,
        });
        success('Address updated successfully');
      } else {
        await addAddress({
          label,
          street,
          city,
          state,
          zipCode,
          isDefault,
        });
        success('New delivery address added');
      }
      setModalOpen(false);
      resetForm();
    } catch (err: any) {
      toastError(err.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete);
      success('Address deleted successfully');
      setDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      success('Default address updated');
    } catch (err: any) {
      toastError(err.message || 'Failed to set default address');
    }
  };

  const addresses = user?.addresses || [];

  const getLabelIcon = (lbl: string) => {
    switch (lbl?.toLowerCase()) {
      case 'work':
      case 'office':
        return <Briefcase className="w-4 h-4 text-olive" />;
      case 'studio':
      case 'apartment':
        return <Building className="w-4 h-4 text-olive" />;
      default:
        return <Home className="w-4 h-4 text-olive" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Saved Addresses"
        subtitle="Manage your meal delivery destinations for smooth and rapid checkouts."
        showBack
        backTo="/profile"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Address
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <EmptyState
          title="No Delivery Addresses"
          description="You haven't saved any addresses yet. Add your home, work, or studio address for faster ordering."
          actionText="Add Delivery Address"
          onAction={handleOpenAdd}
          icon={<MapPin className="w-8 h-8 text-olive" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-5 rounded-2xl bg-[#FFFDF5] border transition-all duration-200 flex flex-col justify-between shadow-card ${
                addr.isDefault
                  ? 'border-olive ring-1 ring-olive/20'
                  : 'border-sand-border/80 hover:border-sand-border'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-sand/50">
                      {getLabelIcon(addr.label)}
                    </div>
                    <span className="font-serif-title font-bold text-base text-olive-dark">
                      {addr.label}
                    </span>
                  </div>

                  {addr.isDefault && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-olive-dark leading-relaxed">
                  {addr.street}
                </p>
                <p className="text-xs text-olive-dark/70 mt-0.5">
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-sand-border/60 flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => addr._id && handleSetDefault(addr._id)}
                    className="text-olive hover:text-olive-dark font-semibold transition-colors"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-olive-dark/40 font-medium">Default location</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 rounded-lg text-olive-dark/60 hover:text-olive hover:bg-sand/40 transition-colors"
                    title="Edit address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (addr._id) {
                        setAddressToDelete(addr._id);
                        setDeleteModalOpen(true);
                      }
                    }}
                    className="p-1.5 rounded-lg text-olive-dark/60 hover:text-terracotta hover:bg-[#FFF5F2] transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        description="Provide accurate street and postal information for dispatch."
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Label selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
              Address Label
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Work', 'Other'].map((lbl) => (
                <button
                  type="button"
                  key={lbl}
                  onClick={() => setLabel(lbl)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    label === lbl
                      ? 'bg-olive text-[#FFFDF5] border-olive'
                      : 'bg-[#FFFDF5] text-olive-dark border-sand-border hover:bg-sand/30'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Street Address / Area"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g. 12, 5th Main Road, Sector 4, HSR Layout"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bengaluru"
              required
            />
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Karnataka"
              required
            />
          </div>

          <Input
            label="PIN Code (6 digits)"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="e.g. 560102"
            maxLength={6}
            required
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefaultCheckbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-olive focus:ring-olive border-sand-border"
            />
            <label htmlFor="isDefaultCheckbox" className="text-xs text-olive-dark/80 font-medium cursor-pointer">
              Set as my default delivery address
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Address"
        description="Are you sure you want to remove this delivery address? This action cannot be reversed."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="terracotta" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
