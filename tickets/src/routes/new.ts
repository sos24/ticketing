import express, {Request, Response} from 'express';

import { body } from 'express-validator';
import { requireAuth,validateRequest } from '@tickets-sosghazaryan/common';
import { Ticket } from '../models/Ticket';

import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/tickets',
     requireAuth, 
     [
        body('title')
            .trim()
            .not()
            .isEmpty()
            .withMessage('title'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('price'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
        const {
            price, 
            title
        } = req.body;

        const ticket = await Ticket.build({
                            price,
                            title,
                            userId: req.currentUser!.id
                        })
                        .save();
        await (new TicketCreatedPublisher(natsWrapper.client!)).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
        });
        res.status(201).send({
           ticket
        });
    }
)

export {router as createTicketRouter};