import { app } from './app';
import mongoose from 'mongoose';

import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCanceledListener } from './events/listeners/order-canceled-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not set');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID not set');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not set');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL not set');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      process.exit();
    });
    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERm', () => {
      natsWrapper.client.close();
    });
    await mongoose.connect(
      `mongodb://${process.env.MONGO_URI}:27017/${process.env.MONGO_DB_NAME}`
    );

    console.log('auth connected to db');
  } catch (e) {
    console.error(e);
  }
  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCanceledListener(natsWrapper.client).listen();
  app.listen(3000, () => {
    console.log('auth started');
  });
};

start();
