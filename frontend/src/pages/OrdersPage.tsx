import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Clock,
  ArrowRight,
  Receipt,
  UtensilsCrossed,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types/order';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency } from '../utils/formatters';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return <Badge variant="olive">Placed</Badge>;
      case 'ACCEPTED':
        return <Badge variant="sand">Accepted</Badge>;
      case 'PREPARING':
        return <Badge variant="olive">Preparing</Badge>;
      case 'READY':
        return <Badge variant="sand">Ready</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="olive">Out for Delivery</Badge>;
      case 'DELIVERED':
        return <Badge variant="veg">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="terracotta">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="My Orders"
        subtitle="Track incoming kitchen deliveries and review your order history."
      />

      {loading ? (
        <div className="space-y-4">
          <SkeletonLoader type="order" count={3} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No Orders Yet"
          description="You haven't placed any orders with BiteFlow yet. Savor freshly prepared dishes from local artisanal kitchens."
          actionText="Explore Restaurants"
          onAction={() => navigate('/restaurants')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const restaurant =
              typeof order.restaurantId === 'object'
                ? (order.restaurantId as any)
                : null;
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Card
                key={order._id}
                className="p-5 sm:p-6 hover:shadow-card-hover transition-all space-y-4"
              >
                {/* Header: Restaurant, Date & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-border/60">
                  <div className="flex items-center gap-3">
                    {restaurant?.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-xl object-cover border border-sand-border shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-sand/60 flex items-center justify-center text-olive shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif-title font-bold text-lg text-olive-dark">
                        {restaurant?.name || 'Artisanal Kitchen'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-olive-dark/60 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-serif-title font-bold text-lg text-olive-dark">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items preview & action footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-semibold text-olive-dark/60">
                      Order #{order.orderNumber}
                    </span>
                    <p className="text-olive-dark/80 line-clamp-1">
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sand/50 hover:bg-olive hover:text-[#FFFDF5] text-olive-dark font-semibold text-xs sm:text-sm border border-sand-border hover:border-olive transition-all shadow-subtle"
                    >
                      <span>View Details & Track</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
