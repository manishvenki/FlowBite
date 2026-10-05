import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/biteflow';
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[BiteFlow DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[BiteFlow DB] Connection error:', error);
    process.exit(1);
  }
};
