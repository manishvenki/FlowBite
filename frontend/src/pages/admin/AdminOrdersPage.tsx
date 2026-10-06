import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Search,
  MapPin,
  Phone,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types/order';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatters';
import { useAdminRealtime } from '../../hooks/useAdminRealtime';

const STATUS_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PLACED', label: 'New (Placed)' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'READY', label: 'Ready' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export const AdminOrdersPage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders(selectedFilter);
      setOrders(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedFilter]);

  // Real-time listener for incoming orders and status transitions
  useAdminRealtime(fetchOrders);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      success(`Order #${orderId.slice(-6)} moved to ${status}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: status } : null));
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const customer = typeof o.userId === 'object' ? (o.userId as any)?.name?.toLowerCase() : '';
    const restaurant = typeof o.restaurantId === 'object' ? (o.restaurantId as any)?.name?.toLowerCase() : '';
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      customer.includes(term) ||
      restaurant.includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Order Management"
        subtitle="Process kitchen orders, accept incoming tickets, and advance order delivery states."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        }
      />

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedFilter === f.key
                  ? 'bg-olive text-[#FFFDF5] shadow-sm'
                  : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/60 border border-sand-border/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer..."
            className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl py-2 pl-3 pr-8 text-xs focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
          />
          <Search className="w-3.5 h-3.5 text-olive-dark/50 absolute right-3 top-3" />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-olive-dark/70">
            No orders found matching this filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-border text-olive-dark/70 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Kitchen</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/50">
                {filteredOrders.map((ord: any) => {
                  const isNew = ord.orderStatus === 'PLACED';
                  const customer = typeof ord.userId === 'object' ? ord.userId : null;
                  const restaurant = typeof ord.restaurantId === 'object' ? ord.restaurantId : null;

                  return (
                    <tr
                      key={ord._id}
                      className={`hover:bg-sand/20 transition-colors ${
                        isNew ? 'bg-amber-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-olive-deep">
                        #{ord.orderNumber}
                        {isNew && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-olive text-white uppercase tracking-wider">
                            NEW
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-olive-dark block">
                          {customer?.name || 'Customer'}
                        </span>
                        <span className="text-[10px] text-olive-dark/60 block">
                          {customer?.phone || ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-olive-dark/80">
                        {restaurant?.name || 'Kitchen'}
                      </td>
                      <td className="py-3.5 px-4 text-olive-dark/80 max-w-[150px] truncate">
                        {ord.items.map((i: any) => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-olive-dark">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-olive-dark/60 whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick workflow buttons depending on current status */}
                          {ord.orderStatus === 'PLACED' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(ord._id, 'ACCEPTED')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs"
                                title="Accept Order"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(ord._id, 'CANCELLED')}
                                className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                                title="Reject Order"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {ord.orderStatus === 'ACCEPTED' && (
                            <button
                              onClick={() => handleUpdateStatus(ord._id, 'PREPARING')}
                              className="px-2.5 py-1 rounded-lg bg-sand hover:bg-sand-dark text-olive-dark font-bold text-xs"
                            >
                              Cook
                            </button>
                          )}

                          {ord.orderStatus === 'PREPARING' && (
                            <button
                              onClick={() => handleUpdateStatus(ord._id, 'READY')}
                              className="px-2.5 py-1 rounded-lg bg-sand hover:bg-sand-dark text-olive-dark font-bold text-xs"
                            >
                              Ready
                            </button>
                          )}

                          {ord.orderStatus === 'READY' && (
                            <button
                              onClick={() => handleUpdateStatus(ord._id, 'OUT_FOR_DELIVERY')}
                              className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-xs"
                            >
                              Dispatch
                            </button>
                          )}

                          {ord.orderStatus === 'OUT_FOR_DELIVERY' && (
                            <button
                              onClick={() => handleUpdateStatus(ord._id, 'DELIVERED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs"
                            >
                              Delivered
                            </button>
                          )}

                          {/* View Detail Modal Trigger */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1 rounded-lg text-olive-dark/60 hover:text-olive hover:bg-sand/40"
                            title="View full order details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          description={`Customer: ${(selectedOrder.userId as any)?.name || 'Guest'} • Status: ${selectedOrder.orderStatus}`}
          maxWidth="lg"
        >
          <div className="space-y-4 pt-2 text-xs">
            {/* Delivery address & Kitchen */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-sand/30 border border-sand-border/70">
              <div>
                <p className="font-bold text-olive-dark">Destination:</p>
                <p className="text-olive-dark/80">{selectedOrder.deliveryAddress.street}</p>
                <p className="text-olive-dark/60">
                  {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.zipCode}
                </p>
              </div>
              <div>
                <p className="font-bold text-olive-dark">Payment Details:</p>
                <p className="text-olive-dark/80">Method: {selectedOrder.paymentMethod}</p>
                <p className="font-mono text-olive-deep">Txn: {selectedOrder.transactionId}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="font-bold text-olive-dark uppercase tracking-wider text-[11px]">
                Ordered Dishes:
              </p>
              <div className="divide-y divide-sand-border/50 bg-[#FAF7EE] p-3 rounded-xl border border-sand-border">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between">
                    <span>
                      {i.quantity}× {i.name}
                    </span>
                    <span className="font-bold">{formatCurrency(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between font-bold text-sm text-olive">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Status Change Selector */}
            <div className="pt-2 border-t border-sand-border/60 flex items-center justify-between">
              <span className="font-semibold text-olive-dark">Advance Status:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'PLACED',
                  'ACCEPTED',
                  'PREPARING',
                  'READY',
                  'OUT_FOR_DELIVERY',
                  'DELIVERED',
                  'CANCELLED',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder._id, st as OrderStatus)}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                      selectedOrder.orderStatus === st
                        ? 'bg-olive text-white ring-2 ring-olive/30'
                        : 'bg-sand/60 text-olive-dark hover:bg-sand-dark'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
