import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { adminService, AdminCustomer } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatters';

export const AdminCustomersPage: React.FC = () => {
  const { toastError } = useToast() as any;

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCustomers();
      setCustomers(data);
    } catch (err: any) {
      if (toastError) toastError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Customer Directory"
        subtitle="View registered patrons, order frequency, total dining expenditure, and registration history."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCustomers}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        }
      />

      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, email or phone..."
            className="w-full bg-[#FFFDF5] border border-sand-border rounded-xl py-2.5 pl-3 pr-8 text-xs focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none"
          />
          <Search className="w-3.5 h-3.5 text-olive-dark/50 absolute right-3 top-3.5" />
        </div>

        <span className="text-xs font-semibold text-olive-dark/60">
          Total Customers: {customers.length}
        </span>
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-olive-dark/60">
            No customers match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-border text-olive-dark/70 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Addresses</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/50">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-olive text-[#FFFDF5] flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-olive-dark text-xs sm:text-sm">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-olive-dark">
                        <Mail className="w-3 h-3 text-olive shrink-0" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-olive-dark/70">
                        <Phone className="w-3 h-3 text-olive shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-olive-dark/80">
                      {c.addressesCount} saved
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-olive-deep bg-sand/50 px-2 py-0.5 rounded-full">
                        {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-olive">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-olive-dark/60">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
