const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const customUri = process.env.MONGODB_URI;

    if (customUri && customUri.trim() !== '') {
      try {
        console.log(`[Database] Attempting connection to MongoDB at: ${customUri.split('@').pop()}`);
        const conn = await mongoose.connect(customUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`[Database] Custom MONGODB_URI failed (${err.message}). Falling back to MongoMemoryServer...`);
      }
    }

    // Fallback: Use mongodb-memory-server for zero-config, out-of-the-box operation
    console.log('[Database] Starting embedded MongoDB engine (mongodb-memory-server)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'hotelpro'
      }
    });

    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Embedded MongoDB running and connected at: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('[Database] Disconnected gracefully');
  } catch (err) {
    console.error('[Database Disconnect Error]', err);
  }
};

module.exports = { connectDB, disconnectDB };
