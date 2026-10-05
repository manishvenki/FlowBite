import { Router } from 'express';
import { getAdminDashboard, getAdminCustomers } from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protect all admin routes: token required + ADMIN role required
router.use(protect, authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/customers', getAdminCustomers);

export default router;
