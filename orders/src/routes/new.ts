import express, { Request, Response } from 'express';

import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@tickets-sosghazaryan/common';

import { Order, expiresTime } from '../models/Order';
import { Ticket } from '../models/Ticket';
import { OrderCreatedPublisher } from '../events/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').trim().not().isEmpty().withMessage('ticket id')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket reserved');
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresTime);
    const order = await Order.build({
      userId: req.currentUser!.id,
      ticket: ticket,
      expiresAt: expiresAt,
      status: OrderStatus.Created,
    }).save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    return res.status(201).send({
      order,
    });
  }
);

export { router as createOrderRouter };
