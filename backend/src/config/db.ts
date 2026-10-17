import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/biteflow';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[BiteFlow DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[BiteFlow DB] Connection error:', error);
    // In serverless environments (Vercel), calling process.exit(1) terminates the Node container,
    // causing Vercel to return HTTP 500 FUNCTION_INVOCATION_FAILED without CORS headers.
  }
};

