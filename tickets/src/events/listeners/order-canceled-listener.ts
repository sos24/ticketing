import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrdeCanceledEvent,
  NotFoundError,
} from '@tickets-sosghazaryan/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCanceledListener extends Listener<OrdeCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrdeCanceledEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set('orderId', undefined);
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
    });
    msg.ack();
  }
}
