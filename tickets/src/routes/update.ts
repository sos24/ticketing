import express, { Request, Response } from 'express';

import {
  BadRequestError,
  NotAuthorized,
  NotFoundError,
} from '@tickets-sosghazaryan/common';
import { Ticket } from '../models/Ticket';
import mongoose from 'mongoose';
import { requireAuth, validateRequest } from '@tickets-sosghazaryan/common';
import { body } from 'express-validator';

import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('title'),
    body('price').isFloat({ gt: 0 }).withMessage('price'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    if (!req.params.id) {
      throw new NotFoundError();
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new NotFoundError();
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Ticket reserved');
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    ticket.set({
      price,
      title,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client!).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
    res.status(200).send({
      ticket,
    });
  }
);

export { router as updateTicketRouter };
