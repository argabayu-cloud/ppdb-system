import { Router } from 'express';
import authRoutes from './auth.routes';
import pendaftaranRoutes from './pendaftaran.routes';
import adminRoutes from './admin.routes';
import superAdminRoutes from './superAdmin.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/pendaftaran', pendaftaranRoutes);
router.use('/admin', adminRoutes);
router.use('/superadmin', superAdminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;