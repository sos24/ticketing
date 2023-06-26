import {
  Listener,
  OrdeCanceledEvent,
  OrderStatus,
  Subjects,
} from '@tickets-sosghazaryan/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class OrderCanceledListener extends Listener<OrdeCanceledEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  async onMessage(
    data: OrdeCanceledEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, version } = data;
    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });
    if (!order) {
      console.log('order not found');
      return;
    }

    order.set({
      status: OrderStatus.Canceled,
    });
    await order.save();
    msg.ack();
  }
}
