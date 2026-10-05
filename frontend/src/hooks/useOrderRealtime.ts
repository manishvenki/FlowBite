import { useEffect, useRef } from 'react';
import { orderService } from '../services/orderService';
import { API_BASE_URL } from '../services/api';
import { Order, OrderStatus } from '../types/order';
import { useToast } from './useToast';

export const useOrderRealtime = (
  orderId: string | undefined,
  currentStatus: OrderStatus | undefined,
  onOrderUpdate: (order: Order) => void
) => {
  const { showToast, info, success, error } = useToast();
  const lastStatusRef = useRef<OrderStatus | undefined>(currentStatus);

  useEffect(() => {
    lastStatusRef.current = currentStatus;
  }, [currentStatus]);

  useEffect(() => {
    if (!orderId) return;

    // Do not poll if already completed or cancelled
    if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') {
      return;
    }

    const token = localStorage.getItem('biteflow_token');
    const apiBase = API_BASE_URL;

    // 1. Try Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${apiBase}/orders/${orderId}/live?token=${token}`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'STATUS_UPDATE' && payload.order) {
            handleStatusTransition(payload.order);
          }
        } catch (e) {
          // ignore parsing error
        }
      };
    } catch (e) {
      // EventSource not supported or failed to connect
    }

    // 2. Reliable smart polling fallback (every 4.5 seconds while order is active)
    const pollInterval = setInterval(() => {
      orderService
        .getOrderById(orderId)
        .then((fetchedOrder) => {
          if (fetchedOrder && fetchedOrder.orderStatus !== lastStatusRef.current) {
            handleStatusTransition(fetchedOrder);
          }
        })
        .catch(() => {});
    }, 4500);

    const handleStatusTransition = (updatedOrder: Order) => {
      const prev = lastStatusRef.current;
      const next = updatedOrder.orderStatus;

      if (prev !== next) {
        lastStatusRef.current = next;
        onOrderUpdate(updatedOrder);

        // Toast notifications for customer lifecycle events
        switch (next) {
          case 'ACCEPTED':
            success('Your order has been accepted by the kitchen! 🧑‍🍳');
            break;
          case 'PREPARING':
            info('The chef is now preparing your fresh food! 🔥');
            break;
          case 'READY':
            info('Your order is packed and ready for dispatch! 🛍️');
            break;
          case 'OUT_FOR_DELIVERY':
            info('Your courier is out for delivery to your location! 🛵');
            break;
          case 'DELIVERED':
            success('Your order has been delivered! Enjoy your meal. ✨');
            break;
          case 'CANCELLED':
            error('Your order has been cancelled.');
            break;
          default:
            break;
        }
      }
    };

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
    };
  }, [orderId, currentStatus]);
};
