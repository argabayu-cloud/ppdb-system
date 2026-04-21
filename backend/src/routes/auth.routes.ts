import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../validators';
import { authenticate } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Register user baru (role USER)
 * @access  Public
 */
router.post('/register', validate(registerSchema), (req, res) =>
  authController.register(req, res)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (USER, ADMIN, SUPER_ADMIN)
 * @access  Public
 */
router.post('/login', validate(loginSchema), (req, res) =>
  authController.login(req, res)
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, (req, res) =>
  authController.getProfile(req, res)
);

export default router;