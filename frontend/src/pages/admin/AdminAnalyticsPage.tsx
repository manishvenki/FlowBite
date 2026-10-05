import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Award,
  RefreshCw,
} from 'lucide-react';
import { adminService, AdminDashboardData } from '../../services/adminService';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { RupeeIcon } from '../../components/common/RupeeIcon';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return <p className="text-xs text-olive-dark/60 py-8 text-center">Loading store analytics...</p>;
  }

  const { kpi, statusCounts, popularItems, totalOrdersCount } = data;
  const avgOrderValue = totalOrdersCount > 0 ? kpi.totalRevenue / totalOrdersCount : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Store Analytics & Insights"
        subtitle="Performance metrics, order pipeline health, and culinary revenue trends."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        }
      />

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <RupeeIcon size="lg" className="w-6 h-6 text-xl font-bold" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Cumulative Revenue
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive-dark block mt-0.5">
              {formatCurrency(kpi.totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">All completed orders</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sand text-olive-dark flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Average Order Value
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive block mt-0.5">
              {formatCurrency(avgOrderValue)}
            </span>
            <span className="text-[11px] text-olive-dark/60">Across all customer carts</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-olive/15 text-olive flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider block">
              Order Fulfillment Rate
            </span>
            <span className="font-serif-title text-2xl font-bold text-olive-dark block mt-0.5">
              {totalOrdersCount > 0
                ? `${Math.round(((statusCounts.DELIVERED || 0) / totalOrdersCount) * 100)}%`
                : '100%'}
            </span>
            <span className="text-[11px] text-olive-dark/60">
              {statusCounts.DELIVERED || 0} delivered safely
            </span>
          </div>
        </Card>
      </div>

      {/* Revenue Breakdown by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-serif-title font-bold text-lg text-olive-dark pb-2 border-b border-sand-border/60">
            Volume by Order Lifecycle
          </h3>

          <div className="space-y-4 pt-2">
            {[
              { status: 'PLACED', label: 'Placed (Awaiting Acceptance)', count: statusCounts.PLACED || 0, color: 'bg-olive' },
              { status: 'ACCEPTED', label: 'Accepted by Kitchen', count: statusCounts.ACCEPTED || 0, color: 'bg-amber-600' },
              { status: 'PREPARING', label: 'Cooking & Preparation', count: statusCounts.PREPARING || 0, color: 'bg-amber-500' },
              { status: 'READY', label: 'Packaged & Ready', count: statusCounts.READY || 0, color: 'bg-emerald-600' },
              { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: statusCounts.OUT_FOR_DELIVERY || 0, color: 'bg-blue-600' },
              { status: 'DELIVERED', label: 'Successfully Delivered', count: statusCounts.DELIVERED || 0, color: 'bg-emerald-700' },
              { status: 'CANCELLED', label: 'Cancelled / Rejected', count: statusCounts.CANCELLED || 0, color: 'bg-rose-500' },
            ].map((st) => {
              const pct = totalOrdersCount > 0 ? Math.round((st.count / totalOrdersCount) * 100) : 0;
              return (
                <div key={st.status} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-olive-dark">{st.label}</span>
                    <span className="font-bold text-olive-deep">
                      {st.count} orders ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-sand/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${st.color} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.max(pct, st.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Culinary Dishes */}
        <Card className="p-6 space-y-4">
          <h3 className="font-serif-title font-bold text-lg text-olive-dark pb-2 border-b border-sand-border/60">
            Top Performing Recipes
          </h3>

          <div className="divide-y divide-sand-border/50 text-xs">
            {popularItems.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-olive/15 text-olive font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-olive-dark">{item.name}</p>
                    <p className="text-[11px] text-olive-dark/60">{item.count} items ordered</p>
                  </div>
                </div>

                <span className="font-bold text-olive-deep text-sm">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
