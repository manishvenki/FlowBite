import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';
import categoryRoutes from './routes/category.routes';
import foodRoutes from './routes/food.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import { notFound, errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configurable production-safe CORS with LAN and Vercel deployment support
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const envAllowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = [...defaultAllowedOrigins, ...envAllowedOrigins];

const isAllowedOrigin = (origin: string): boolean => {
  // Direct match against configured origins
  if (allowedOrigins.includes(origin)) return true;

  // BiteFlow Vercel frontend deployments (production, branch, and preview deployments)
  if (/^https:\/\/(flow-bite|biteflow)[a-z0-9-]*\.vercel\.app$/i.test(origin)) {
    return true;
  }

  // Local development: localhost, 127.0.0.1, and private LAN IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  const isLocalOrLan = /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|localhost|127\.0\.0\.1)(:\d+)?$/.test(
    origin
  );
  if (isLocalOrLan) return true;

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or server-to-server health checks)
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin '${origin}' not permitted by BiteFlow CORS policy`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BiteFlow API is operating smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
  console.log(`[BiteFlow Server] Running on http://${HOST}:${PORT}`);
  console.log(`[BiteFlow Server] Local access: http://localhost:${PORT}`);
  console.log(`[BiteFlow Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
