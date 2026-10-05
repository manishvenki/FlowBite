import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';
import { sendSuccess, sendError } from '../utils/response';

export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrdersCount,
      pendingOrdersCount,
      totalOrders,
      totalCustomers,
      recentOrders,
      restaurants,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ orderStatus: { $in: ['PLACED', 'ACCEPTED', 'PREPARING'] } }),
      Order.find({ orderStatus: { $ne: 'CANCELLED' } }).select('totalAmount orderStatus createdAt items'),
      User.countDocuments({ role: 'USER' }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('restaurantId', 'name image')
        .populate('userId', 'name email'),
      Restaurant.find().select('name isOpen cuisine rating'),
    ]);

    const totalRevenue = totalOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Calculate popular items
    const itemMap = new Map<string, { name: string; count: number; revenue: number }>();
    totalOrders.forEach((ord) => {
      ord.items?.forEach((item) => {
        const key = item.name;
        const existing = itemMap.get(key) || { name: key, count: 0, revenue: 0 };
        existing.count += item.quantity;
        existing.revenue += item.price * item.quantity;
        itemMap.set(key, existing);
      });
    });

    const popularItems = Array.from(itemMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Orders by status
    const statusCounts: Record<string, number> = {
      PLACED: 0,
      ACCEPTED: 0,
      PREPARING: 0,
      READY: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    totalOrders.forEach((ord) => {
      if (statusCounts[ord.orderStatus] !== undefined) {
        statusCounts[ord.orderStatus]++;
      }
    });

    sendSuccess(res, 'Admin dashboard statistics retrieved successfully', {
      kpi: {
        todayOrders: todayOrdersCount,
        pendingOrders: pendingOrdersCount,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalCustomers,
      },
      recentOrders,
      popularItems,
      restaurants,
      statusCounts,
      totalOrdersCount: totalOrders.length,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to retrieve admin dashboard data', null, 500);
  }
};

export const getAdminCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: 'USER' })
      .select('-password')
      .sort({ createdAt: -1 });

    const customerStats = await Promise.all(
      customers.map(async (cust) => {
        const orders = await Order.find({ userId: cust._id, orderStatus: { $ne: 'CANCELLED' } }).select('totalAmount');
        const orderCount = orders.length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        return {
          _id: cust._id,
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          addressesCount: cust.addresses?.length || 0,
          orderCount,
          totalSpent: Number(totalSpent.toFixed(2)),
          createdAt: cust.createdAt,
        };
      })
    );

    sendSuccess(res, 'Customers list retrieved successfully', customerStats);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to retrieve customers', null, 500);
  }
};
