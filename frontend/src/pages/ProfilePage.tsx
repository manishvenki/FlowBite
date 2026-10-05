import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateProfile({ name, phone });
      success('Profile details updated successfully');
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  if (!user) return null;

  const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, delivery addresses, and account preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-2xl p-6 shadow-card flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-olive text-[#FFFDF5] flex items-center justify-center font-serif-title font-bold text-3xl shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-serif-title text-xl font-bold text-olive-dark">
              {user.name}
            </h3>
            <p className="text-xs text-olive-dark/60 mt-0.5">{user.email}</p>
          </div>

          <div className="pt-1">
            <Badge variant={user.role === 'ADMIN' ? 'terracotta' : 'olive'}>
              {user.role === 'ADMIN' ? 'Store Administrator' : 'Customer Account'}
            </Badge>
          </div>

          <div className="w-full pt-4 border-t border-sand-border/60">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4 text-terracotta" />}
              className="text-terracotta hover:bg-[#FFF5F2]"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Right Column: Edit Profile Form & Address Shortcuts */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Information Form */}
          <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-2xl p-6 shadow-card space-y-4">
            <h4 className="font-serif-title text-lg font-bold text-olive-dark pb-2 border-b border-sand-border/60">
              Personal Information
            </h4>

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startIcon={<UserIcon className="w-4 h-4" />}
                required
              />

              <Input
                label="Email Address"
                value={user.email}
                disabled
                helperText="Email address cannot be changed."
                startIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                startIcon={<Phone className="w-4 h-4" />}
                required
              />

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isUpdating}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Saved Addresses Summary Widget */}
          <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand-border/60">
              <h4 className="font-serif-title text-lg font-bold text-olive-dark flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive" />
                <span>Delivery Addresses</span>
              </h4>
              <Link
                to="/addresses"
                className="text-xs font-semibold text-olive underline hover:text-olive-dark"
              >
                Manage All ({user.addresses.length})
              </Link>
            </div>

            {defaultAddr ? (
              <div className="p-3.5 bg-sand/30 rounded-xl border border-sand-border/60 text-xs sm:text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-olive-dark">
                    Default Address [{defaultAddr.label}]
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-olive-dark/80">
                  {defaultAddr.street}, {defaultAddr.city}, {defaultAddr.state} {defaultAddr.zipCode}
                </p>
              </div>
            ) : (
              <div className="text-xs text-olive-dark/70 py-2">
                No delivery addresses added yet.{' '}
                <Link to="/addresses" className="text-olive underline font-medium">
                  Add one now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
