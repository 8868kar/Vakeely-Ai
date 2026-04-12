import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vakeely';

  try {
    // Try connecting to the configured MongoDB URI
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.log(`⚠️  Local MongoDB not available. Starting in-memory database for demo...`);
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`🚀 In-Memory MongoDB Connected (Demo Mode)`);
      console.log(`📝 Note: Data will be lost when server restarts.`);
    } catch (memError: any) {
      console.error(`❌ Failed to start in-memory database: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
