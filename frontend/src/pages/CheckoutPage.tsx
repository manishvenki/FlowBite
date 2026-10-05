import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { orderService } from '../services/orderService';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { formatCurrency } from '../utils/formatters';
import { Address } from '../types/user';

export const CheckoutPage: React.FC = () => {
  const { items, totals, currentRestaurantId, currentRestaurantName, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Selected delivery address
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false);

  // New address form state
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [zipCode, setZipCode] = useState('');

  // Payment processing state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'PROCESSING' | 'SUCCESS'>('PROCESSING');
  const [demoTxnId, setDemoTxnId] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [items, user, navigate]);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      toastError('Please fill out all address fields');
      return;
    }

    try {
      const updatedAddresses = await addAddress({
        label,
        street,
        city,
        state,
        zipCode,
        isDefault: !user?.addresses?.length,
      });

      const newlyAdded = updatedAddresses[updatedAddresses.length - 1];
      setSelectedAddress(newlyAdded);
      setNewAddressModalOpen(false);
      setStreet('');
      setCity('Bengaluru');
      setState('Karnataka');
      setZipCode('');
      success('Delivery address added');
    } catch (err: any) {
      toastError(err.message || 'Failed to add address');
    }
  };

  const handlePayNow = () => {
    if (!selectedAddress) {
      toastError('Please select or add a delivery address');
      return;
    }

    // Generate random demo transaction ID
    const txn = `DEMO-TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setDemoTxnId(txn);
    setPaymentStep('PROCESSING');
    setProcessingProgress(0);
    setPaymentModalOpen(true);

    // Wait exactly ~5 seconds with progress animation
    const startTime = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProcessingProgress(progress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setPaymentStep('SUCCESS');

        // Submit order to backend
        orderService
          .createOrder({
            restaurantId: currentRestaurantId!,
            items: items.map((i) => ({
              foodId: i.food._id,
              quantity: i.quantity,
            })),
            deliveryAddress: {
              label: selectedAddress.label,
              street: selectedAddress.street,
              city: selectedAddress.city,
              state: selectedAddress.state,
              zipCode: selectedAddress.pincode || selectedAddress.zipCode || '560038',
            },
            transactionId: txn,
          })
          .then((createdOrder) => {
            clearCart();
            setTimeout(() => {
              navigate(`/orders/confirmation/${createdOrder._id}`);
            }, 1200);
          })
          .catch((err) => {
            setPaymentModalOpen(false);
            toastError(err.message || 'Order creation failed');
          });
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Checkout"
        subtitle={`Completing your order from ${currentRestaurantName || 'Kitchen'}`}
        showBack
        backTo="/cart"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address, Order Items, Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-olive text-[#FFFDF5] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif-title font-bold text-lg text-olive-dark">
                  Delivery Address
                </h3>
              </div>

              {user?.addresses && user.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(true)}
                  className="text-xs font-semibold text-olive underline hover:text-olive-dark"
                >
                  Change Address
                </button>
              )}
            </div>

            {selectedAddress ? (
              <div className="p-4 rounded-xl bg-sand/30 border border-sand-border/80 flex items-start justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-olive shrink-0" />
                    <span className="font-bold text-olive-deep">
                      {selectedAddress.label || 'Home'}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-olive-dark/80 pl-6">{selectedAddress.street}</p>
                  <p className="text-xs text-olive-dark/65 pl-6">
                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-sand-border text-center space-y-3">
                <p className="text-xs text-olive-dark/70">
                  No delivery address selected.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAddressModalOpen(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Delivery Address
                </Button>
              </div>
            )}
          </Card>

          {/* Step 2: Items in Order */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-olive text-[#FFFDF5] text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif-title font-bold text-lg text-olive-dark">
                  Order Items ({totals.itemCount})
                </h3>
              </div>

              <Link
                to="/cart"
                className="text-xs font-semibold text-olive underline hover:text-olive-dark"
              >
                Modify Cart
              </Link>
            </div>

            <div className="divide-y divide-sand-border/50">
              {items.map((item) => (
                <div
                  key={item.food._id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-12 h-12 rounded-lg object-cover border border-sand-border"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-olive-dark leading-tight">
                        {item.food.name}
                      </h4>
                      <p className="text-xs text-olive-dark/60 mt-0.5">
                        Qty: {item.quantity} × {formatCurrency(item.food.price)}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-olive-dark">
                    {formatCurrency(item.food.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Step 3: Payment Method (Demo Payment) */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-sand-border/60">
              <span className="w-6 h-6 rounded-full bg-olive text-[#FFFDF5] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-serif-title font-bold text-lg text-olive-dark">
                Payment Method
              </h3>
            </div>

            <div className="p-4 rounded-xl border-2 border-olive bg-sand/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-olive text-[#FFFDF5]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-olive-dark">
                      BiteFlow Instant Demo Pay
                    </p>
                    <p className="text-xs text-olive-dark/70">
                      Simulated zero-cost test sandbox • Instant authorization
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-olive bg-olive/15 px-2.5 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Order Bill Summary & Pay Button */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="font-serif-title text-xl font-bold text-olive-dark pb-3 border-b border-sand-border/60">
              Bill Details
            </h3>

            <div className="space-y-3 text-sm text-olive-dark/80">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-olive-dark">
                  {formatCurrency(totals.itemTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-olive-dark">
                  {totals.deliveryFee === 0 ? 'Free' : formatCurrency(totals.deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-medium text-olive-dark">
                  {formatCurrency(totals.platformFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-sand-border/60 flex justify-between items-baseline">
                <span className="font-serif-title text-lg font-bold text-olive-dark">
                  To Pay
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
              onClick={handlePayNow}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              PAY NOW ({formatCurrency(totals.grandTotal)})
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-olive-dark/60 text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-olive" />
              <span>Simulated Payment Gateway Environment</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Select Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Select Delivery Address"
        description="Choose where your meal should be delivered"
      >
        <div className="space-y-3 pt-2">
          {user?.addresses?.map((addr) => (
            <div
              key={addr._id}
              onClick={() => {
                setSelectedAddress(addr);
                setAddressModalOpen(false);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedAddress?._id === addr._id
                  ? 'border-olive bg-sand/30 ring-1 ring-olive/20'
                  : 'border-sand-border hover:bg-sand/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-olive-dark">
                  {addr.label || 'Home'}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-olive-dark/80 mt-1">{addr.street}</p>
              <p className="text-[11px] text-olive-dark/60">
                {addr.city}, {addr.state} {addr.zipCode}
              </p>
            </div>
          ))}

          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setAddressModalOpen(false);
              setNewAddressModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Another Address
          </Button>
        </div>
      </Modal>

      {/* Add New Address Modal */}
      <Modal
        isOpen={newAddressModalOpen}
        onClose={() => setNewAddressModalOpen(false)}
        title="Add Delivery Address"
        description="Enter street and destination details"
      >
        <form onSubmit={handleAddNewAddress} className="space-y-3 pt-2">
          <Input
            label="Label (e.g. Home, Work, Office)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
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

          <div className="pt-3 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save & Use
            </Button>
          </div>
        </form>
      </Modal>

      {/* Demo Payment Processing Modal (5-second simulation) */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => {}} // Cannot dismiss during payment processing
        title={paymentStep === 'PROCESSING' ? 'Processing Payment...' : 'Payment Successful!'}
        maxWidth="sm"
      >
        <div className="py-6 flex flex-col items-center text-center space-y-4">
          {paymentStep === 'PROCESSING' ? (
            <>
              {/* Amount to Pay box as per India prompt */}
              <div className="bg-sand/35 border border-sand-border/80 rounded-xl px-4 py-2.5 w-full text-center">
                <span className="text-[11px] uppercase tracking-wider text-olive-dark/60 font-semibold block">
                  Amount to Pay
                </span>
                <span className="font-serif-title text-2xl font-bold text-olive-dark block mt-0.5">
                  {formatCurrency(totals.grandTotal)}
                </span>
              </div>

              <div className="relative w-20 h-20 flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-olive" />
                <span className="absolute text-xs font-bold text-olive-dark">
                  {processingProgress}%
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif-title font-bold text-lg text-olive-dark">
                  Connecting to Demo Gateway
                </h4>
                <p className="text-xs text-olive-dark/70 max-w-xs">
                  Simulating payment authorization with BiteFlow Instant Pay. Please do not close this window...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-sand/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-olive h-2 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif-title font-bold text-xl text-olive-dark">
                  Payment Successful!
                </h4>
                <p className="text-xs text-olive-dark/70 font-mono bg-sand/40 px-3 py-1.5 rounded-lg border border-sand-border">
                  Txn ID: {demoTxnId}
                </p>
                <p className="text-xs text-emerald-800 font-semibold pt-1">
                  Creating order & redirecting to confirmation...
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
