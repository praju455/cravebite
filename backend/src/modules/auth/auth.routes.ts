import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/send-otp', authLimiter, AuthController.sendOtp);
router.post('/verify-otp', authLimiter, AuthController.verifyOtp);

export default router;
