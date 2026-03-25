const mongoose = require('mongoose');
const User = require('./models/User');

async function run() {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    
    console.log("Connected");
    const user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password123'
    });
    
    await user.save();
    console.log("Saved successfully");
    process.exit(0);
  } catch (err) {
    console.error("FULL ERROR STACK:");
    console.error(err.stack);
    process.exit(1);
  }
}

run();
