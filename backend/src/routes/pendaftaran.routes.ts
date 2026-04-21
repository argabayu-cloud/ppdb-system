import { Router } from 'express';
import { PendaftaranController } from '../controllers/pendaftaran.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { pendaftaranSchema } from '../validators';

const router = Router();
const pendaftaranController = new PendaftaranController();

/**
 * @route   POST /api/pendaftaran
 * @desc    Submit pendaftaran baru
 * @access  Private (USER only)
 */
router.post(
  '/',
  authenticate,
  authorize('USER'),
  validate(pendaftaranSchema),
  (req, res) => pendaftaranController.create(req, res)
);

/**
 * @route   GET /api/pendaftaran/my
 * @desc    Get pendaftaran milik user yang login
 * @access  Private (USER only)
 */
router.get('/my', authenticate, authorize('USER'), (req, res) =>
  pendaftaranController.getMyPendaftaran(req, res)
);

/**
 * @route   GET /api/pendaftaran/status
 * @desc    Cek status pendaftaran
 * @access  Private (USER only)
 */
router.get('/status', authenticate, authorize('USER'), (req, res) =>
  pendaftaranController.getStatus(req, res)
);

export default router;