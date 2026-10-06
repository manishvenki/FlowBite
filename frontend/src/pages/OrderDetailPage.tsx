import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Receipt,
  Phone,
  AlertTriangle,
  ChefHat,
  PackageCheck,
  Bike,
  Sparkles,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types/order';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency } from '../utils/formatters';
import { getFoodImage, DEFAULT_FOOD_FALLBACK } from '../utils/foodImage';
import { useOrderRealtime } from '../hooks/useOrderRealtime';

const TIMELINE_STEPS: Array<{
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    status: 'PLACED',
    label: 'Order Placed',
    description: 'We have received your meal request.',
    icon: ShoppingBag,
  },
  {
    status: 'ACCEPTED',
    label: 'Accepted',
    description: 'The kitchen has accepted your order.',
    icon: CheckCircle2,
  },
  {
    status: 'PREPARING',
    label: 'Preparing',
    description: 'Chef is cooking your fresh dishes.',
    icon: ChefHat,
  },
  {
    status: 'READY',
    label: 'Ready',
    description: 'Order packed in eco-friendly warm bags.',
    icon: PackageCheck,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    description: 'Courier is heading towards your location.',
    icon: Bike,
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Enjoy your warm artisanal dining experience!',
    icon: Sparkles,
  },
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = async (isManualRefresh = false) => {
    if (!id) return;
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // Real-time live status updates via SSE + smart fallback polling
  useOrderRealtime(id, order?.orderStatus, (updatedOrder) => {
    setOrder(updatedOrder);
  });

  if (loading) {
    return <Loader fullScreen text="Something delicious is on the way..." />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Order Not Found"
        message={error || 'Unable to locate order details.'}
        onRetry={() => fetchOrderDetail(true)}
      />
    );
  }

  const restaurant = typeof order.restaurantId === 'object' ? (order.restaurantId as any) : null;
  const isCancelled = order.orderStatus === 'CANCELLED';

  // Find step index in timeline
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.status === order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title={`Order #${order.orderNumber}`}
        subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`}
        showBack
        backTo="/orders"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrderDetail(true)}
            isLoading={isRefreshing}
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh Status
          </Button>
        }
      />

      {/* Cancelled Banner if applicable */}
      {isCancelled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-terracotta/15 border border-terracotta/30 flex items-start gap-3 text-terracotta-dark">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Order Cancelled</h4>
            <p className="text-xs text-olive-dark/80 mt-0.5">
              This order has been cancelled by the kitchen or store administrator.
            </p>
          </div>
        </div>
      )}

      {/* Visual Order Timeline Tracker */}
      {!isCancelled && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
            <h3 className="font-serif-title font-bold text-lg sm:text-xl text-olive-dark">
              Live Order Journey
            </h3>
            <Badge variant="olive">
              Status: {order.orderStatus.replace(/_/g, ' ')}
            </Badge>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pt-2 pb-4">
            <div className="hidden sm:block absolute top-7 left-6 right-6 h-1 bg-sand/80 -z-0" />
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 sm:gap-2 relative z-10">
              {TIMELINE_STEPS.map((step, index) => {
                const isPassed = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-olive text-[#FFFDF5] ring-4 ring-olive/20 scale-110 shadow-card'
                          : isPassed
                          ? 'bg-olive text-[#FFFDF5]'
                          : 'bg-[#FFFDF5] border-2 border-sand-border text-olive-dark/40'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isCurrent
                            ? 'text-olive underline underline-offset-4 decoration-2 decoration-olive'
                            : isPassed
                            ? 'text-olive-dark'
                            : 'text-olive-dark/50'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="hidden md:block text-[10px] text-olive-dark/60 mt-1 max-w-[110px] leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Details Grid: Kitchen, Destination, Receipt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kitchen Info */}
        <Card className="p-5 space-y-3">
          <h4 className="font-serif-title font-bold text-base text-olive-dark flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-olive" />
            <span>Kitchen</span>
          </h4>

          <div className="space-y-1.5 text-xs sm:text-sm">
            <p className="font-serif-title font-bold text-olive-dark text-base">
              {restaurant?.name || 'Artisanal Kitchen'}
            </p>
            <p className="text-olive-dark/70 text-xs">{restaurant?.cuisine}</p>
            <p className="text-olive-dark/80 text-xs flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-olive shrink-0" />
              <span>{restaurant?.address || 'Kitchen address'}</span>
            </p>
            {restaurant?.phone && (
              <p className="text-olive-dark/80 text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-olive shrink-0" />
                <span>{restaurant.phone}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Delivery Address */}
        <Card className="p-5 space-y-3">
          <h4 className="font-serif-title font-bold text-base text-olive-dark flex items-center gap-2">
            <MapPin className="w-4 h-4 text-olive" />
            <span>Delivering To</span>
          </h4>

          <div className="space-y-1.5 text-xs sm:text-sm">
            <span className="font-bold text-olive-dark text-xs uppercase tracking-wider bg-sand/50 px-2 py-0.5 rounded-full inline-block">
              {order.deliveryAddress.label || 'Home'}
            </span>
            <p className="text-olive-dark font-medium pt-1">
              {order.deliveryAddress.street}
            </p>
            <p className="text-olive-dark/70 text-xs">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
            </p>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="p-5 space-y-3">
          <h4 className="font-serif-title font-bold text-base text-olive-dark flex items-center gap-2">
            <Receipt className="w-4 h-4 text-olive" />
            <span>Payment</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-olive-dark/70">Method</span>
              <span className="font-semibold text-olive-dark">Instant Demo Pay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-olive-dark/70">Payment Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {order.paymentStatus}
              </span>
            </div>
            {order.transactionId && (
              <div className="flex justify-between">
                <span className="text-olive-dark/70">Txn ID</span>
                <span className="font-mono text-olive-deep">{order.transactionId}</span>
              </div>
            )}
            <div className="pt-2 border-t border-sand-border/60 flex justify-between font-bold text-sm text-olive-dark">
              <span>Total Paid</span>
              <span className="text-olive text-base font-serif-title">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Itemized Order Receipt */}
      <Card className="p-6 space-y-4">
        <h4 className="font-serif-title font-bold text-lg text-olive-dark pb-2 border-b border-sand-border/60">
          Items Receipt
        </h4>

        <div className="divide-y divide-sand-border/50">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getFoodImage(item)}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover border border-sand-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_FOOD_FALLBACK;
                  }}
                />
                <div>
                  <p className="font-semibold text-olive-dark">{item.name}</p>
                  <p className="text-xs text-olive-dark/60">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <span className="font-bold text-olive-dark">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-sand-border/70 space-y-2 text-xs sm:text-sm text-olive-dark/80 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-medium text-olive-dark">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-medium text-olive-dark">
              {order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="font-medium text-olive-dark">{formatCurrency(order.platformFee)}</span>
          </div>
          <div className="pt-2 border-t border-sand-border/60 flex justify-between font-bold text-base text-olive-dark">
            <span className="font-serif-title">Total</span>
            <span className="font-serif-title text-xl text-olive">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
