import { Order, IOrder, OrderStatus, IOrderItem, IDeliveryAddress } from '../models/Order';
import { Restaurant } from '../models/Restaurant';
import { Food } from '../models/Food';
import { User } from '../models/User';
import { dispatchStatusEmailIfNew } from './email.service';
import { orderEvents } from '../utils/orderEvents';

export interface CreateOrderDTO {
  restaurantId: string;
  items: Array<{
    foodId: string;
    quantity: number;
  }>;
  deliveryAddress: IDeliveryAddress;
  transactionId?: string;
}

export const createOrderService = async (
  userId: string,
  data: CreateOrderDTO
): Promise<IOrder> => {
  const restaurant = await Restaurant.findById(data.restaurantId);
  if (!restaurant || !restaurant.isActive) {
    throw new Error('Restaurant not found or inactive');
  }

  if (!data.items || data.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Fetch foods to verify actual prices from database (never trust client prices)
  const populatedItems: IOrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const item of data.items) {
    const food = await Food.findById(item.foodId);
    if (!food) {
      throw new Error(`Food item not found with ID ${item.foodId}`);
    }
    if (!food.isAvailable) {
      throw new Error(`Item "${food.name}" is currently unavailable`);
    }

    const itemPrice = food.price;
    const quantity = Math.max(1, item.quantity);
    calculatedSubtotal += itemPrice * quantity;

    populatedItems.push({
      foodId: food._id as any,
      name: food.name,
      price: itemPrice,
      quantity,
      image: food.image,
      isVeg: food.isVeg,
    });
  }

  const deliveryFee = restaurant.deliveryFee || 0;
  const platformFee = 10;
  const totalAmount = Math.round(calculatedSubtotal + deliveryFee + platformFee);

  // Generate unique order number
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `BF-${randomSuffix}`;

  // Generate demo transaction ID if not provided
  const transactionId =
    data.transactionId ||
    `DEMO-TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const order = await Order.create({
    orderNumber,
    userId,
    restaurantId: restaurant._id,
    items: populatedItems,
    subtotal: calculatedSubtotal,
    deliveryFee,
    platformFee,
    totalAmount,
    deliveryAddress: data.deliveryAddress,
    paymentStatus: 'PAID',
    paymentMethod: 'DEMO_PAYMENT',
    transactionId,
    orderStatus: 'PLACED',
    sentEmailStatuses: [],
  });

  const populatedOrder = await order.populate('restaurantId', 'name image address phone cuisine');

  // Emit real-time event for admin dashboard
  orderEvents.emit('new_order', populatedOrder);

  // Trigger placed email asynchronously
  User.findById(userId)
    .then((user) => {
      if (user) {
        dispatchStatusEmailIfNew(populatedOrder, user, 'PLACED').catch((err) =>
          console.error('[BiteFlow Email Error]:', err)
        );
      }
    })
    .catch((err) => console.error('[BiteFlow Email User Error]:', err));

  return populatedOrder;
};

export const getUserOrdersService = async (userId: string): Promise<IOrder[]> => {
  return await Order.find({ userId })
    .sort({ createdAt: -1 })
    .populate('restaurantId', 'name image address cuisine');
};

export const getOrderByIdService = async (
  orderId: string,
  userId?: string,
  isAdmin: boolean = false
): Promise<IOrder | null> => {
  const order = await Order.findById(orderId)
    .populate('restaurantId', 'name image address phone cuisine')
    .populate('userId', 'name email phone');

  if (!order) {
    return null;
  }

  // If normal user, check ownership
  if (!isAdmin && userId && order.userId._id.toString() !== userId.toString()) {
    throw new Error('Not authorized to view this order');
  }

  return order;
};

export const getAllOrdersService = async (status?: string): Promise<IOrder[]> => {
  const query: any = {};
  if (status && status !== 'ALL') {
    query.orderStatus = status;
  }

  return await Order.find(query)
    .sort({ createdAt: -1 })
    .populate('restaurantId', 'name image')
    .populate('userId', 'name email phone');
};

export const updateOrderStatusService = async (
  orderId: string,
  orderStatus: OrderStatus
): Promise<IOrder | null> => {
  const validStatuses: OrderStatus[] = [
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  if (!validStatuses.includes(orderStatus)) {
    throw new Error(`Invalid order status: ${orderStatus}`);
  }

  const order = await Order.findById(orderId);
  if (!order) return null;

  order.orderStatus = orderStatus;
  await order.save();

  const populatedOrder = await Order.findById(orderId)
    .populate('restaurantId', 'name image address phone cuisine')
    .populate('userId', 'name email phone');

  if (populatedOrder && populatedOrder.userId) {
    // Emit real-time event for customer live tracking and admin updates
    orderEvents.emit('status_update', populatedOrder);

    dispatchStatusEmailIfNew(populatedOrder, populatedOrder.userId as any, orderStatus).catch((err) =>
      console.error('[BiteFlow Email Error on Status Update]:', err)
    );
  }

  return populatedOrder;
};
