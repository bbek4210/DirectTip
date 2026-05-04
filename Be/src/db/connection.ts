import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected');
      if (!process.env.MONGO_URI) {
        console.log(`🔗 In-memory DB URI: ${mongoUri}`);
      }
    } else {
      console.warn('⚠️ MONGO_URI not set and not in development mode');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit in dev if it fails, maybe try again later or just log
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
