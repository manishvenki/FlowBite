import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createOrderService,
  getUserOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService,
} from '../services/order.service';
import { sendSuccess, sendError } from '../utils/response';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', null, 401);
      return;
    }

    const { restaurantId, items, deliveryAddress, transactionId } = req.body;
    if (!restaurantId || !items || !items.length || !deliveryAddress) {
      sendError(res, 'Missing required order information', null, 400);
      return;
    }

    const order = await createOrderService(req.user._id.toString(), {
      restaurantId,
      items,
      deliveryAddress,
      transactionId,
    });

    sendSuccess(res, 'Order created successfully', order, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create order', null, 400);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', null, 401);
      return;
    }

    const orders = await getUserOrdersService(req.user._id.toString());
    sendSuccess(res, 'User orders retrieved successfully', orders);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch user orders', null, 500);
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const orders = await getAllOrdersService(status as string);
    sendSuccess(res, 'All orders retrieved successfully', orders);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch orders', null, 500);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const userId = req.user?._id?.toString();
    const isAdmin = req.user?.role === 'ADMIN';

    const order = await getOrderByIdService(id, userId, isAdmin);
    if (!order) {
      sendError(res, 'Order not found', null, 404);
      return;
    }

    sendSuccess(res, 'Order details retrieved successfully', order);
  } catch (error: any) {
    const statusCode = error.message.includes('Not authorized') ? 403 : 500;
    sendError(res, error.message || 'Failed to retrieve order', null, statusCode);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const status = req.body.status || req.body.orderStatus;

    if (!status) {
      sendError(res, 'Order status is required', null, 400);
      return;
    }

    const updatedOrder = await updateOrderStatusService(id, status);
    if (!updatedOrder) {
      sendError(res, 'Order not found', null, 404);
      return;
    }

    sendSuccess(res, `Order status updated to ${status}`, updatedOrder);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update order status', null, 400);
  }
};

export const streamAdminOrders = (req: AuthRequest, res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Admin real-time stream established' })}\n\n`);

  const onNewOrder = (order: any) => {
    res.write(`data: ${JSON.stringify({ type: 'NEW_ORDER', order })}\n\n`);
  };

  const onStatusUpdate = (order: any) => {
    res.write(`data: ${JSON.stringify({ type: 'STATUS_UPDATE', order })}\n\n`);
  };

  const { orderEvents } = require('../utils/orderEvents');
  orderEvents.on('new_order', onNewOrder);
  orderEvents.on('status_update', onStatusUpdate);

  req.on('close', () => {
    orderEvents.off('new_order', onNewOrder);
    orderEvents.off('status_update', onStatusUpdate);
  });
};

export const streamOrderLive = (req: AuthRequest, res: Response): void => {
  const orderId = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', orderId })}\n\n`);

  const onStatusUpdate = (order: any) => {
    if (order._id?.toString() === orderId) {
      res.write(`data: ${JSON.stringify({ type: 'STATUS_UPDATE', order })}\n\n`);
    }
  };

  const { orderEvents } = require('../utils/orderEvents');
  orderEvents.on('status_update', onStatusUpdate);

  req.on('close', () => {
    orderEvents.off('status_update', onStatusUpdate);
  });
};
