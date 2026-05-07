import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import restaurantRoutes from './modules/restaurants/restaurant.routes';
import menuRoutes from './modules/menu/menu.routes';
import orderRoutes from './modules/orders/order.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
