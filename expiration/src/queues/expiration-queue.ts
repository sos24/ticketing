import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue
  .process(function (job, done) {
    try {
      new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
      });
      done();
    } catch (e) {
      console.log(e);
    }
  })
  .catch((error) => console.log(error));

export { expirationQueue };
