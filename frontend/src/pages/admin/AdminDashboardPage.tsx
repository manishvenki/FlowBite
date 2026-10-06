import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Users,
  Store,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Power,
} from 'lucide-react';
import { adminService, AdminDashboardData } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { ErrorState } from '../../components/common/ErrorState';
import { formatCurrency } from '../../utils/formatters';
import { RupeeIcon } from '../../components/common/RupeeIcon';
import { useAdminRealtime } from '../../hooks/useAdminRealtime';

export const AdminDashboardPage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Listen for real-time incoming orders and updates
  useAdminRealtime(fetchDashboard);

  const handleUpdateStatus = async (orderId: string, status: any) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      success(`Order status updated to ${status}`);
      fetchDashboard();
    } catch (err: any) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  const handleToggleRestaurant = async (restaurantId: string, currentOpen: boolean) => {
    try {
      await adminService.updateRestaurant(restaurantId, { isOpen: !currentOpen });
      success(`Restaurant is now ${!currentOpen ? 'OPEN' : 'CLOSED'}`);
      fetchDashboard();
    } catch (err: any) {
      toastError(err.message || 'Failed to toggle restaurant status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Store Dashboard" subtitle="Loading operational performance..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader type="kpi" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          <div className="lg:col-span-2 space-y-4">
            <SkeletonLoader type="table" />
          </div>
          <div className="space-y-4">
            <SkeletonLoader type="card" count={2} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState message={error || 'Failed to load data'} onRetry={fetchDashboard} />;
  }

  const { kpi, recentOrders, popularItems, restaurants, statusCounts, totalOrdersCount } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Store Dashboard"
        subtitle="Real-time order pipeline, store revenue, and kitchen status."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboard}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Link to="/admin/restaurant?new=true">
              <Button
                variant="primary"
                size="sm"
                icon={<Store className="w-4 h-4" />}
              >
                + Add Restaurant
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-olive/15 text-olive flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Today's Orders
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive-dark block mt-0.5">
              {kpi.todayOrders}
            </span>
            <span className="text-[11px] text-olive-dark/60">
              Total lifetime: {totalOrdersCount}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sand text-olive-dark flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive block mt-0.5">
              {kpi.pendingOrders}
            </span>
            <span className="text-[11px] text-olive-dark/60">
              Requires kitchen action
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <RupeeIcon size="lg" className="w-6 h-6 text-xl font-bold" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive-dark block mt-0.5">
              {formatCurrency(kpi.totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Settled culinary revenue
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Total Customers
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive-dark block mt-0.5">
              {kpi.totalCustomers}
            </span>
            <span className="text-[11px] text-olive-dark/60">
              Registered diners
            </span>
          </div>
        </Card>
      </div>

      {/* Middle Row: Kitchen Live Status + Status Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kitchen Status List */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
            <h3 className="font-serif-title font-bold text-lg text-olive-dark flex items-center gap-2">
              <Store className="w-4 h-4 text-olive" />
              <span>Kitchen Status</span>
            </h3>
            <Link
              to="/admin/restaurant"
              className="text-xs font-semibold text-olive underline hover:text-olive-dark"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {restaurants.slice(0, 4).map((rest) => (
              <div
                key={rest._id}
                className="p-3 rounded-xl bg-sand/30 border border-sand-border/70 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-olive-dark truncate max-w-[150px]">
                    {rest.name}
                  </p>
                  <p className="text-[11px] text-olive-dark/60 truncate max-w-[150px]">
                    {rest.cuisine}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleRestaurant(rest._id, rest.isOpen)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                    rest.isOpen
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                      : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                  title="Click to toggle Open / Closed"
                >
                  <Power className="w-3 h-3" />
                  <span>{rest.isOpen ? 'OPEN' : 'CLOSED'}</span>
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Status Distribution Bar Visualisation */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
            <h3 className="font-serif-title font-bold text-lg text-olive-dark flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-olive" />
              <span>Order Pipeline Distribution</span>
            </h3>
            <span className="text-xs font-semibold text-olive-dark/60">
              {totalOrdersCount} Total Records
            </span>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="space-y-3 pt-2">
            {[
              { key: 'PLACED', label: 'Placed (New)', color: 'bg-olive' },
              { key: 'ACCEPTED', label: 'Accepted', color: 'bg-amber-600' },
              { key: 'PREPARING', label: 'Preparing in Kitchen', color: 'bg-amber-500' },
              { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'bg-blue-600' },
              { key: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-600' },
              { key: 'CANCELLED', label: 'Cancelled', color: 'bg-rose-500' },
            ].map((item) => {
              const count = statusCounts[item.key] || 0;
              const percent = totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0;

              return (
                <div key={item.key} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-olive-dark">{item.label}</span>
                    <span className="font-bold text-olive-deep">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-sand/50 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.max(percent, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Row: Recent Orders Table & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
            <h3 className="font-serif-title font-bold text-lg text-olive-dark">
              Recent Incoming Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-olive underline hover:text-olive-dark flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-olive-dark/60 py-4 text-center">
              No orders received yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-sand-border text-olive-dark/60 uppercase font-semibold">
                    <th className="pb-2.5">Order</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Kitchen</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-border/40">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord._id} className="hover:bg-sand/20 transition-colors">
                      <td className="py-3 font-mono font-bold text-olive-deep">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3 font-medium text-olive-dark">
                        {ord.userId?.name || 'Customer'}
                      </td>
                      <td className="py-3 text-olive-dark/80">
                        {ord.restaurantId?.name || 'Kitchen'}
                      </td>
                      <td className="py-3 font-bold text-olive-dark">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            ord.orderStatus === 'PLACED'
                              ? 'olive'
                              : ord.orderStatus === 'DELIVERED'
                              ? 'veg'
                              : ord.orderStatus === 'CANCELLED'
                              ? 'terracotta'
                              : 'sand'
                          }
                          size="sm"
                        >
                          {ord.orderStatus}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        {ord.orderStatus === 'PLACED' ? (
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(ord._id, 'ACCEPTED')}
                              className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                              title="Accept Order"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(ord._id, 'CANCELLED')}
                              className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800"
                              title="Reject Order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <Link
                            to={`/admin/orders`}
                            className="p-1 inline-block text-olive hover:text-olive-dark"
                            title="Manage Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Popular Dishes */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border/60">
            <h3 className="font-serif-title font-bold text-lg text-olive-dark">
              Popular Dishes
            </h3>
            <span className="text-xs text-olive-dark/60 font-semibold">By Volume</span>
          </div>

          {popularItems.length === 0 ? (
            <p className="text-xs text-olive-dark/60 py-4 text-center">
              No sales data accumulated yet.
            </p>
          ) : (
            <div className="space-y-3">
              {popularItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-3 rounded-xl bg-sand/30 border border-sand-border/60"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-olive text-[#FFFDF5] text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-olive-dark truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-olive-deep block">
                      {item.count} orders
                    </span>
                    <span className="text-[11px] text-olive-dark/60">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
