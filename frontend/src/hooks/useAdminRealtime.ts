import { useEffect, useRef } from 'react';
import { orderService } from '../services/orderService';
import { API_BASE_URL } from '../services/api';
import { useToast } from './useToast';
import { Order } from '../types/order';
import { formatCurrency } from '../utils/formatters';

export const useAdminRealtime = (onRefreshNeeded: () => void) => {
  const { info, success } = useToast();
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('biteflow_token');
    const apiBase = API_BASE_URL;

    // 1. Initial fetch to establish existing known order IDs
    orderService
      .getAllOrders()
      .then((orders) => {
        orders.forEach((o) => knownOrderIdsRef.current.add(o._id));
        initialLoadRef.current = true;
      })
      .catch(() => {});

    // 2. Connect via SSE
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${apiBase}/orders/live/admin?token=${token}`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_ORDER' && payload.order) {
            handleIncomingOrder(payload.order);
          } else if (payload.type === 'STATUS_UPDATE') {
            onRefreshNeeded();
          }
        } catch (e) {
          // ignore parsing error
        }
      };
    } catch (e) {
      // EventSource fallback
    }

    // 3. Smart polling fallback (every 5 seconds)
    const pollInterval = setInterval(() => {
      orderService
        .getAllOrders()
        .then((orders) => {
          if (!initialLoadRef.current) {
            orders.forEach((o) => knownOrderIdsRef.current.add(o._id));
            initialLoadRef.current = true;
            return;
          }

          let hasNew = false;
          orders.forEach((o) => {
            if (!knownOrderIdsRef.current.has(o._id)) {
              knownOrderIdsRef.current.add(o._id);
              handleIncomingOrder(o);
              hasNew = true;
            }
          });

          if (hasNew) {
            onRefreshNeeded();
          }
        })
        .catch(() => {});
    }, 5000);

    const handleIncomingOrder = (newOrder: Order) => {
      info(`🔔 New order received: #${newOrder.orderNumber} (${formatCurrency(newOrder.totalAmount)})`);
      onRefreshNeeded();
    };

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
    };
  }, [onRefreshNeeded]);
};
