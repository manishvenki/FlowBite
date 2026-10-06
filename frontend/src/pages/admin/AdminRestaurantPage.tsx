import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Store,
  Power,
  Save,
  Clock,
  Bike,
  Plus,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Restaurant } from '../../types/restaurant';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatters';

const BENGALURU_AREAS = [
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Whitefield',
  'Jayanagar',
  'JP Nagar',
  'Electronic City',
  'Marathahalli',
  'Bellandur',
  'BTM Layout',
  'Malleshwaram',
  'Rajajinagar',
  'Lavelle Road',
  'MG Road',
];

const SAMPLE_STORE_IMAGES = [
  {
    name: 'Biryani & Mughlai',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'South Indian & Dosa',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'North Indian Delights',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Café & Desserts',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  },
];

export const AdminRestaurantPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Indiranagar');
  const [phone, setPhone] = useState('+91 80 4123 4567');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [deliveryTime, setDeliveryTime] = useState('25-35 min');
  const [deliveryFee, setDeliveryFee] = useState('40');
  const [isOpen, setIsOpen] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // New Store Form Fields
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState(SAMPLE_STORE_IMAGES[0].url);
  const [newCuisine, setNewCuisine] = useState('North Indian, Biryani');
  const [newAddress, setNewAddress] = useState('');
  const [newArea, setNewArea] = useState('Indiranagar');
  const [newPhone, setNewPhone] = useState('+91 80 4123 8899');
  const [newEmail, setNewEmail] = useState('');
  const [newDeliveryTime, setNewDeliveryTime] = useState('25-35 min');
  const [newDeliveryFee, setNewDeliveryFee] = useState('40');
  const [newIsOpen, setNewIsOpen] = useState(true);
  const [newIsActive, setNewIsActive] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminRestaurants();
      setRestaurants(data);
      if (data.length > 0 && !selectedId) {
        populateForm(data[0]);
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (r: Restaurant) => {
    setSelectedId(r._id);
    setName(r.name);
    setDescription(r.description);
    setImage(r.image);
    setCuisine(r.cuisine);
    setAddress(r.address);
    setArea(r.area || 'Indiranagar');
    setPhone(r.phone || '+91 80 4123 4567');
    setEmail(r.email || '');
    setCity(r.city || 'Bengaluru');
    setState(r.state || 'Karnataka');
    setDeliveryTime(r.deliveryTime || '25-35 min');
    setDeliveryFee((r.deliveryFee || 40).toString());
    setIsOpen(r.isOpen !== undefined ? r.isOpen : true);
    setIsActive(r.isActive !== undefined ? r.isActive : true);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Check URL query parameters for ?new=true
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('new') === 'true') {
      setCreateModalOpen(true);
    }
  }, [location.search]);

  const handleSelect = (rId: string) => {
    const found = restaurants.find((r) => r._id === rId);
    if (found) {
      populateForm(found);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    try {
      setIsSaving(true);
      const updated = await adminService.updateRestaurant(selectedId, {
        name,
        description,
        image,
        cuisine,
        address,
        area,
        city,
        state,
        country: 'India',
        phone,
        email,
        deliveryTime,
        deliveryFee: parseFloat(deliveryFee) || 40,
        isOpen,
        isActive,
      });

      success(`"${name}" store details updated successfully`);
      setRestaurants((prev) => prev.map((r) => (r._id === selectedId ? updated : r)));
    } catch (err: any) {
      toastError(err.message || 'Failed to update restaurant');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickToggleOpen = async () => {
    if (!selectedId) return;
    try {
      const nextOpen = !isOpen;
      const updated = await adminService.updateRestaurant(selectedId, { isOpen: nextOpen });
      setIsOpen(nextOpen);
      success(`"${name}" is now ${nextOpen ? 'OPEN' : 'CLOSED'}`);
      setRestaurants((prev) => prev.map((r) => (r._id === selectedId ? updated : r)));
    } catch (err: any) {
      toastError(err.message || 'Failed to toggle kitchen status');
    }
  };

  const handleQuickToggleActive = async () => {
    if (!selectedId) return;
    try {
      const nextActive = !isActive;
      const updated = await adminService.updateRestaurant(selectedId, { isActive: nextActive });
      setIsActive(nextActive);
      success(`"${name}" is now ${nextActive ? 'ACTIVE' : 'INACTIVE (Deactivated)'}`);
      setRestaurants((prev) => prev.map((r) => (r._id === selectedId ? updated : r)));
    } catch (err: any) {
      toastError(err.message || 'Failed to toggle store activation');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) {
      toastError('Store name and address are required');
      return;
    }

    try {
      setIsCreating(true);
      const created = await adminService.createRestaurant({
        name: newName.trim(),
        description: newDescription.trim() || 'Authentic flavors crafted daily in Bengaluru.',
        image: newImage.trim() || SAMPLE_STORE_IMAGES[0].url,
        cuisine: newCuisine.trim() || 'Indian',
        address: newAddress.trim(),
        area: newArea,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        phone: newPhone.trim(),
        email: newEmail.trim() || undefined,
        deliveryTime: newDeliveryTime.trim() || '25-35 min',
        deliveryFee: parseFloat(newDeliveryFee) || 40,
        isOpen: newIsOpen,
        isActive: newIsActive,
      });

      success(`Store "${created.name}" created successfully in ${newArea}, Bengaluru!`);
      setCreateModalOpen(false);

      // Clean URL if opened via ?new=true
      if (location.search.includes('new=true')) {
        navigate('/admin/restaurant', { replace: true });
      }

      // Refresh and select the newly created store
      const updatedList = await adminService.getAdminRestaurants();
      setRestaurants(updatedList);
      populateForm(created);
    } catch (err: any) {
      toastError(err.message || 'Failed to create restaurant');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Store & Restaurant Management"
          subtitle="Loading culinary kitchen configuration and settings..."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <SkeletonLoader type="card" count={3} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <SkeletonLoader type="card" count={2} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Store & Restaurant Management"
        subtitle="Create new kitchens, configure operating hours, delivery fees, and Bengaluru locations."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            + Add Restaurant
          </Button>
        }
      />

      {/* Restaurant Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {restaurants.map((r) => (
          <button
            key={r._id}
            onClick={() => handleSelect(r._id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
              selectedId === r._id
                ? 'bg-olive text-[#FFFDF5] shadow-sm'
                : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/60 border border-sand-border/80'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                !r.isActive ? 'bg-zinc-400' : r.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span>{r.name}</span>
            {!r.isActive && (
              <span className="text-[9px] uppercase px-1 py-0.2 bg-zinc-200 text-zinc-700 rounded font-bold">
                Inactive
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sand-border/60">
              <div>
                <h3 className="font-serif-title font-bold text-lg text-olive-dark">
                  Store Information
                </h3>
                <p className="text-xs text-olive-dark/60">
                  Editing profile for {name || 'Selected Kitchen'}
                </p>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-2">
                {/* Active / Inactive Toggle */}
                <button
                  type="button"
                  onClick={handleQuickToggleActive}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200'
                  }`}
                  title="Click to toggle Active / Inactive store status"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isActive ? 'STORE ACTIVE' : 'STORE INACTIVE'}</span>
                </button>

                {/* Instant Open/Closed Toggle */}
                <button
                  type="button"
                  onClick={handleQuickToggleOpen}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                    isOpen
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                      : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                  title="Click to toggle Open / Closed kitchen status"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isOpen ? 'KITCHEN OPEN' : 'KITCHEN CLOSED'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <Input
                label="Kitchen Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
                  About & Culinary Philosophy
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-3 text-xs focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cuisine Tags"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g. South Indian, Biryani, Fresh"
                  required
                />

                <Input
                  label="Banner Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 80 4123 4567"
                  required
                />

                <Input
                  label="Email (Optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kitchen@biteflow.com"
                />
              </div>

              <Input
                label="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="142 100ft Road, Near Metro Station"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
                    Bengaluru Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-2.5 text-xs text-olive-dark font-medium focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
                  >
                    {BENGALURU_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <Input label="City" value={city} disabled />
                <Input label="State" value={state} disabled />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Estimated Delivery Time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="25-35 min"
                  required
                />

                <Input
                  label="Delivery Fee (₹ INR)"
                  type="number"
                  step="1"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="40"
                  required
                />
              </div>

              <div className="pt-4 border-t border-sand-border/60 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Store Details
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Live Customer Preview Card */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-bold text-olive-dark/60 uppercase tracking-wider block">
            Customer Preview
          </span>

          <Card className="overflow-hidden p-0">
            <div className="relative h-40 w-full overflow-hidden bg-sand/40">
              <img
                src={image || SAMPLE_STORE_IMAGES[0].url}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {!isActive && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-zinc-800 text-white">
                    Inactive
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-serif-title font-bold text-lg text-olive-dark leading-tight">
                  {name || 'Kitchen Name'}
                </h4>
                <span className="text-[11px] font-bold text-olive px-2 py-0.5 rounded-full bg-sand/60 shrink-0">
                  {area || 'Indiranagar'}
                </span>
              </div>

              <p className="text-xs text-olive-dark/70 font-medium">{cuisine}</p>
              <p className="text-[11px] text-olive-dark/60 line-clamp-2 leading-relaxed">
                {description}
              </p>

              <div className="pt-2 text-[11px] text-olive-dark/70 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-olive shrink-0" />
                  <span className="truncate">{address ? `${address}, ${area}, Bengaluru` : 'Bengaluru, Karnataka'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-olive shrink-0" />
                  <span>{phone || '+91 80 4123 4567'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-sand-border/60 flex justify-between text-xs text-olive-dark/80 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-olive" />
                  <span>{deliveryTime || '25-35 min'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-olive" />
                  <span>{formatCurrency(parseFloat(deliveryFee) || 40)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create New Store Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Store / Restaurant"
        description="Register a new kitchen on BiteFlow. It will immediately be available for menu assignment and customer ordering in Bengaluru."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <Input
            label="Store / Restaurant Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Royal Biryani Darbar"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
              Description & Highlights
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Traditional dum biryani and Mughlai specialties prepared fresh daily."
              className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-3 text-xs focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Cuisine Tags"
                value={newCuisine}
                onChange={(e) => setNewCuisine(e.target.value)}
                placeholder="e.g. Biryani, North Indian, Mughlai"
                required
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['South Indian', 'North Indian', 'Biryani', 'Café', 'Street Food', 'Desserts'].map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewCuisine(c)}
                      className="px-2 py-0.5 text-[10px] rounded-full bg-sand/60 text-olive-dark hover:bg-sand border border-sand-border/60"
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <Input
                label="Banner Image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SAMPLE_STORE_IMAGES.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setNewImage(img.url)}
                    className={`px-2 py-0.5 text-[10px] rounded-full transition-all ${
                      newImage === img.url
                        ? 'bg-olive text-white font-bold'
                        : 'bg-sand/60 text-olive-dark hover:bg-sand border border-sand-border/60'
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+91 80 4123 8899"
              required
            />

            <Input
              label="Contact Email (Optional)"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="store@biteflow.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Street Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="e.g. 84 12th Main Road, HAL 2nd Stage"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
                Bengaluru Locality / Area
              </label>
              <select
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl p-2.5 text-xs text-olive-dark font-medium focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
              >
                {BENGALURU_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="City" value="Bengaluru" disabled />
            <Input label="State" value="Karnataka" disabled />
            <Input label="Country" value="India" disabled />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Delivery Time"
              value={newDeliveryTime}
              onChange={(e) => setNewDeliveryTime(e.target.value)}
              placeholder="25-35 min"
              required
            />

            <Input
              label="Delivery Fee (₹ INR)"
              type="number"
              step="1"
              value={newDeliveryFee}
              onChange={(e) => setNewDeliveryFee(e.target.value)}
              placeholder="40"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-olive-dark cursor-pointer">
              <input
                type="checkbox"
                checked={newIsOpen}
                onChange={(e) => setNewIsOpen(e.target.checked)}
                className="w-4 h-4 text-olive rounded border-sand-border focus:ring-olive"
              />
              <span>Kitchen Open Now (Accepting Orders)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-olive-dark cursor-pointer">
              <input
                type="checkbox"
                checked={newIsActive}
                onChange={(e) => setNewIsActive(e.target.checked)}
                className="w-4 h-4 text-olive rounded border-sand-border focus:ring-olive"
              />
              <span>Active in Customer Catalog</span>
            </label>
          </div>

          <div className="pt-4 border-t border-sand-border/60 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating}
              icon={<Store className="w-4 h-4" />}
            >
              Create Store
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
