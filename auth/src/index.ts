import { app } from './app';
import mongoose from 'mongoose';

const start = async () => {
  console.log('Starting up');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not set');
  }
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGO_URI}:27017/${process.env.MONGO_DB_NAME}`
    );
    console.log('auth connected to db');
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log('auth started');
  });
};

start();
