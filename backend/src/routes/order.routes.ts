import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  streamAdminOrders,
  streamOrderLive,
} from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/all', authorize('ADMIN'), getAllOrders);
router.get('/live/admin', authorize('ADMIN'), streamAdminOrders);
router.get('/:id/live', streamOrderLive);
router.get('/:id', getOrderById);
router.patch('/:id/status', authorize('ADMIN'), updateOrderStatus);

export default router;
