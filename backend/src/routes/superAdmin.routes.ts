import { Router } from 'express';
import { SuperAdminController } from '../controllers/superAdmin.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { sekolahSchema } from '../validators';

const router = Router();
const superAdminController = new SuperAdminController();

/**
 * @route   GET /api/superadmin/dashboard
 * @desc    Get dashboard statistik keseluruhan
 * @access  Private (SUPER_ADMIN only)
 */
router.get('/dashboard', authenticate, authorize('SUPER_ADMIN'), (req, res) =>
  superAdminController.getDashboard(req, res)
);

/**
 * @route   GET /api/superadmin/pendaftaran
 * @desc    Get semua pendaftaran
 * @access  Private (SUPER_ADMIN only)
 */
router.get(
  '/pendaftaran',
  authenticate,
  authorize('SUPER_ADMIN'),
  (req, res) => superAdminController.getAllPendaftaran(req, res)
);

/**
 * @route   GET /api/superadmin/pendaftaran/:id
 * @desc    Get detail pendaftaran by ID
 * @access  Private (SUPER_ADMIN only)
 */
router.get(
  '/pendaftaran/:id',
  authenticate,
  authorize('SUPER_ADMIN'),
  (req, res) => superAdminController.getPendaftaranDetail(req, res)
);

/**
 * @route   PATCH /api/superadmin/validasi/:id
 * @desc    Validasi hasil akhir (publish)
 * @access  Private (SUPER_ADMIN only)
 */
router.patch(
  '/validasi/:id',
  authenticate,
  authorize('SUPER_ADMIN'),
  (req, res) => superAdminController.validasiHasil(req, res)
);

/**
 * @route   GET /api/superadmin/sekolah
 * @desc    Get semua sekolah
 * @access  Private (SUPER_ADMIN only)
 */
router.get('/sekolah', authenticate, authorize('SUPER_ADMIN'), (req, res) =>
  superAdminController.getAllSekolah(req, res)
);

/**
 * @route   POST /api/superadmin/sekolah
 * @desc    Create sekolah baru
 * @access  Private (SUPER_ADMIN only)
 */
router.post(
  '/sekolah',
  authenticate,
  authorize('SUPER_ADMIN'),
  validate(sekolahSchema),
  (req, res) => superAdminController.createSekolah(req, res)
);

/**
 * @route   POST /api/superadmin/admin
 * @desc    Create admin sekolah baru
 * @access  Private (SUPER_ADMIN only)
 */
router.post('/admin', authenticate, authorize('SUPER_ADMIN'), (req, res) =>
  superAdminController.createAdminSekolah(req, res)
);

/**
 * @route   GET /api/superadmin/laporan/:id
 * @desc    Get laporan per sekolah
 * @access  Private (SUPER_ADMIN only)
 */
router.get(
  '/laporan/:id',
  authenticate,
  authorize('SUPER_ADMIN'),
  (req, res) => superAdminController.getLaporanSekolah(req, res)
);

export default router;