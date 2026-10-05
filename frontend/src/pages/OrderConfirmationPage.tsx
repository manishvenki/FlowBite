import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ShoppingBag,
  MapPin,
  Clock,
  ArrowRight,
  Receipt,
  Truck,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types/order';
import { Loader } from '../components/common/Loader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/formatters';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    orderService
      .getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message || 'Failed to load order confirmation'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loader fullScreen text="Finalizing your dining order confirmation..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="font-serif-title text-2xl font-bold text-olive-dark">
          Order Confirmation Not Found
        </h2>
        <p className="text-sm text-olive-dark/70">
          {error || 'Unable to load confirmation.'}
        </p>
        <Button variant="primary" onClick={() => navigate('/orders')}>
          View My Orders
        </Button>
      </div>
    );
  }

  const restaurant = typeof order.restaurantId === 'object' ? (order.restaurantId as any) : null;

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Celebration */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-subtle animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment Successful
        </span>

        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-olive-dark">
          Order Received!
        </h1>

        <p className="text-sm text-olive-dark/75 max-w-md mx-auto leading-relaxed">
          Your order has been placed with{' '}
          <strong className="text-olive-dark">{restaurant?.name || 'the kitchen'}</strong>. The kitchen is reviewing your meal request.
        </p>
      </div>

      {/* Confirmation Summary Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Order Identifiers Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-sand-border/70 text-xs sm:text-sm">
          <div>
            <span className="text-olive-dark/60 font-semibold block text-[11px] uppercase tracking-wider">
              Order Number
            </span>
            <span className="font-serif-title text-lg font-bold text-olive-dark mt-0.5 block">
              {order.orderNumber}
            </span>
          </div>

          <div>
            <span className="text-olive-dark/60 font-semibold block text-[11px] uppercase tracking-wider">
              Transaction ID
            </span>
            <span className="font-mono text-xs font-bold text-olive-deep mt-1 block">
              {order.transactionId || 'DEMO-TXN-N/A'}
            </span>
          </div>

          <div>
            <span className="text-olive-dark/60 font-semibold block text-[11px] uppercase tracking-wider">
              Order Status
            </span>
            <div className="mt-1">
              <Badge variant="olive" size="md">
                {order.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Restaurant & Delivery Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-sand/30 border border-sand-border/70 space-y-1">
            <span className="font-bold text-olive-dark flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5 text-olive" />
              Kitchen
            </span>
            <p className="font-serif-title font-bold text-base text-olive-dark">
              {restaurant?.name || 'Artisanal Kitchen'}
            </p>
            <p className="text-olive-dark/70 text-xs">
              {restaurant?.address || 'Kitchen address'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sand/30 border border-sand-border/70 space-y-1">
            <span className="font-bold text-olive-dark flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-olive" />
              Delivery Destination
            </span>
            <p className="font-bold text-olive-dark text-xs sm:text-sm">
              [{order.deliveryAddress.label || 'Destination'}] {order.deliveryAddress.street}
            </p>
            <p className="text-olive-dark/70 text-xs">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
            </p>
          </div>
        </div>

        {/* Ordered Food Items */}
        <div className="space-y-3">
          <h4 className="font-serif-title font-bold text-base text-olive-dark flex items-center gap-2">
            <Receipt className="w-4 h-4 text-olive" />
            <span>Items Ordered</span>
          </h4>

          <div className="divide-y divide-sand-border/50 bg-[#FAF7EE] rounded-xl p-4 border border-sand-border/70">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-sand flex items-center justify-center font-bold text-xs text-olive-dark">
                    {item.quantity}×
                  </span>
                  <span className="font-medium text-olive-dark">{item.name}</span>
                </div>
                <span className="font-bold text-olive-dark">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="pt-3 mt-2 flex justify-between font-bold text-sm sm:text-base text-olive-deep border-t border-sand-border/60">
              <span>Grand Total Paid</span>
              <span className="text-olive text-lg">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/orders/${order._id}`)}
            icon={<Truck className="w-5 h-5" />}
          >
            Track Order
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};
