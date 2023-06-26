import { app } from './app';
import mongoose from 'mongoose';

import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/paymen-created-listener';

const start = async () => {
  console.log('Starting orders !!!');

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

    const ticketCreatedListener = new TicketCreatedListener(natsWrapper.client);
    ticketCreatedListener.listen();

    const ticketUpdatedListener = new TicketUpdatedListener(natsWrapper.client);
    ticketUpdatedListener.listen();

    const expirationCompleteListener = new ExpirationCompleteListener(
      natsWrapper.client
    );
    expirationCompleteListener.listen();

    const paymentCreated = new PaymentCreatedListener(natsWrapper.client);
    paymentCreated.listen();

    await mongoose.connect(
      `mongodb://${process.env.MONGO_URI}:27017/${process.env.MONGO_DB_NAME}`
    );

    console.log('auth connected to db !!!!!!!!!!!');
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log('auth started');
  });
};

start();
