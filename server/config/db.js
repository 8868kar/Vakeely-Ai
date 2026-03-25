const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB not available locally. Starting in-memory database for demo...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected (Demo Mode)`);
      console.log(`Note: Data will be lost when server restarts.`);
    } catch (memError) {
      console.error(`Failed to start in-memory database: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
