import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import { formatCurrency } from '../utils/formatters';
import { getFoodImage, DEFAULT_FOOD_FALLBACK } from '../utils/foodImage';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totals,
    currentRestaurantName,
    currentRestaurantId,
  } = useCart();
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const defaultAddress = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login?redirect=/cart');
      return;
    }
    setOrderPlaced(true);
    success('Order dispatched to kitchen successfully!');
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="py-12">
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you haven't added anything yet. Explore our curated kitchens and discover fresh, mindful dishes."
          actionText="Browse Restaurants"
          onAction={() => navigate('/restaurants')}
        />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-olive/15 text-olive flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="font-serif-title text-3xl font-bold text-olive-dark">
          Order Confirmed!
        </h2>
        <p className="text-sm text-olive-dark/75 leading-relaxed">
          Thank you! Your simulated meal request has been sent to{' '}
          <strong className="text-olive-dark">{currentRestaurantName || 'the kitchen'}</strong>. Full checkout and real-time live order tracking will unlock in Phase 2.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => {
              setOrderPlaced(false);
              navigate('/');
            }}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setOrderPlaced(false);
              navigate('/restaurants');
            }}
          >
            Explore More Food
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Dining Cart"
        subtitle={`Items from ${currentRestaurantName || 'Artisanal Kitchen'}`}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClearModalOpen(true)}
            icon={<Trash2 className="w-4 h-4 text-terracotta" />}
            className="text-terracotta hover:bg-[#FFF5F2]"
          >
            Clear Cart
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-2xl p-4 sm:p-6 shadow-card divide-y divide-sand-border/60">
            {items.map((item) => (
              <div
                key={item.food._id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                {/* Food Thumbnail & Name */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={getFoodImage(item.food)}
                    alt={item.food.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sand-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FOOD_FALLBACK;
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif-title font-bold text-base text-olive-dark truncate">
                      {item.food.name}
                    </h4>
                    <p className="text-xs text-olive-dark/60 font-medium">
                      {formatCurrency(item.food.price)} each
                    </p>
                  </div>
                </div>

                {/* Quantity & Item Subtotal */}
                <div className="flex items-center gap-4 shrink-0">
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrement={() => updateQuantity(item.food._id, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.food._id, item.quantity - 1)}
                    size="sm"
                  />

                  <span className="font-bold text-sm text-olive-dark w-16 text-right">
                    {formatCurrency(item.food.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.food._id)}
                    className="p-1.5 text-olive-dark/40 hover:text-terracotta rounded-lg hover:bg-sand/40 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more items link */}
          {currentRestaurantId && (
            <div className="flex justify-end">
              <Link
                to={`/restaurants/${currentRestaurantId}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-olive hover:text-olive-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add more items from this kitchen</span>
              </Link>
            </div>
          )}

          {/* Delivery Address Card */}
          <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif-title font-bold text-base text-olive-dark flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive" />
                <span>Delivery Address</span>
              </h4>
              <Link
                to={user ? "/addresses" : "/login?redirect=/cart"}
                className="text-xs font-semibold text-olive underline hover:text-olive-dark"
              >
                {user ? 'Change' : 'Sign in to add'}
              </Link>
            </div>

            {user ? (
              defaultAddress ? (
                <div className="text-xs sm:text-sm text-olive-dark/80 bg-sand/30 p-3 rounded-xl border border-sand-border/60">
                  <span className="font-bold text-olive-deep mr-2">[{defaultAddress.label}]</span>
                  <span>{defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}</span>
                </div>
              ) : (
                <div className="text-xs text-olive-dark/70">
                  No address saved yet.{' '}
                  <Link to="/addresses" className="text-olive underline font-medium">
                    Add delivery address
                  </Link>
                </div>
              )
            ) : (
              <div className="text-xs text-olive-dark/70">
                You are currently ordering as a guest.{' '}
                <Link to="/login?redirect=/cart" className="text-olive underline font-medium">
                  Log in
                </Link>{' '}
                to use your saved addresses.
              </div>
            )}
          </div>
        </div>

        {/* Order Bill Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-2xl p-6 shadow-card space-y-5">
            <h3 className="font-serif-title text-xl font-bold text-olive-dark pb-3 border-b border-sand-border/60">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-olive-dark/80">
              <div className="flex justify-between">
                <span>Items Subtotal ({totals.itemCount})</span>
                <span className="font-medium text-olive-dark">
                  {formatCurrency(totals.itemTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Delivery Fee</span>
                  <span className="text-[11px] text-olive-dark/50">(Kitchen direct)</span>
                </span>
                <span className="font-medium text-olive-dark">
                  {totals.deliveryFee === 0 ? 'Free' : formatCurrency(totals.deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Platform Fee</span>
                  <span className="text-[11px] text-olive-dark/50">(Packaging & tech)</span>
                </span>
                <span className="font-medium text-olive-dark">
                  {formatCurrency(totals.platformFee)}
                </span>
              </div>

              <div className="pt-4 border-t border-sand-border/60 flex justify-between items-baseline">
                <span className="font-serif-title text-lg font-bold text-olive-dark">
                  Grand Total
                </span>
                <span className="font-serif-title text-2xl font-bold text-olive">
                  {formatCurrency(totals.grandTotal)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (!user) {
                  navigate('/login?redirect=/checkout');
                } else {
                  navigate('/checkout');
                }
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-olive-dark/60 text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-olive" />
              <span>Safe & contactless delivery guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear your cart?"
        description="Are you sure you want to remove all items from this kitchen? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setClearModalOpen(false)}>
            Keep Items
          </Button>
          <Button
            variant="terracotta"
            onClick={() => {
              clearCart();
              setClearModalOpen(false);
            }}
          >
            Yes, Clear Cart
          </Button>
        </div>
      </Modal>

      {/* Order Review & Place Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Confirm Dining Order"
        description="Please confirm your meal items and destination before dispatching to the kitchen."
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div className="bg-sand/30 p-3.5 rounded-xl border border-sand-border/60 text-xs space-y-1">
            <p className="font-semibold text-olive-dark">
              Kitchen: <span className="font-normal">{currentRestaurantName}</span>
            </p>
            <p className="font-semibold text-olive-dark">
              Delivery to:{' '}
              <span className="font-normal">
                {defaultAddress
                  ? `${defaultAddress.street}, ${defaultAddress.city}`
                  : 'Customer Address on Record'}
              </span>
            </p>
            <p className="font-semibold text-olive-dark">
              Estimated Time: <span className="font-normal text-olive">25-35 minutes</span>
            </p>
          </div>

          <div className="text-sm font-semibold flex justify-between pt-2 border-t border-sand-border/60">
            <span>Total Payable Amount</span>
            <span className="text-olive font-bold text-lg">
              {formatCurrency(totals.grandTotal)}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setCheckoutModalOpen(false);
                handlePlaceOrder();
              }}
            >
              Dispatch Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
