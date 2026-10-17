import mongoose from 'mongoose';

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (cachedPromise) {
    try {
      await cachedPromise;
      return;
    } catch {
      cachedPromise = null;
    }
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/biteflow';
  try {
    cachedPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    const conn = await cachedPromise;
    console.log(`[BiteFlow DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    cachedPromise = null;
    console.error('[BiteFlow DB] Connection error:', error);
  }
};


