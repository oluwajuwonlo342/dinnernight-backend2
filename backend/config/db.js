const mongoose = require('mongoose');

let isConnecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (isConnecting) return isConnecting;

  isConnecting = mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      isConnecting = null;
      return conn.connection;
    })
    .catch((err) => {
      isConnecting = null;
      throw err;
    });

  return isConnecting;
};

module.exports = connectDB;
