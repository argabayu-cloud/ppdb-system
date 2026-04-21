import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { seleksiSchema } from '../validators';

const router = Router();
const adminController = new AdminController();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistik admin
 * @access  Private (ADMIN only)
 */
router.get('/dashboard', authenticate, authorize('ADMIN'), (req, res) =>
  adminController.getDashboard(req, res)
);

/**
 * @route   GET /api/admin/pendaftar
 * @desc    Get semua pendaftar yang memilih sekolah ini
 * @access  Private (ADMIN only)
 */
router.get('/pendaftar', authenticate, authorize('ADMIN'), (req, res) =>
  adminController.getPendaftar(req, res)
);

/**
 * @route   GET /api/admin/pendaftar/:id
 * @desc    Get detail pendaftar by ID
 * @access  Private (ADMIN only)
 */
router.get('/pendaftar/:id', authenticate, authorize('ADMIN'), (req, res) =>
  adminController.getPendaftarDetail(req, res)
);

/**
 * @route   PATCH /api/admin/seleksi/:id
 * @desc    Proses seleksi (terima/tolak)
 * @access  Private (ADMIN only)
 */
router.patch(
  '/seleksi/:id',
  authenticate,
  authorize('ADMIN'),
  validate(seleksiSchema),
  (req, res) => adminController.prosesSeleksi(req, res)
);

export default router;