import express, {Request, Response} from 'express';

import { NotAuthorized, NotFoundError, OrderStatus } from '@tickets-sosghazaryan/common';
import mongoose from 'mongoose';
import { requireAuth, currentUser } from '@tickets-sosghazaryan/common';

import { Order } from '../models/Order';
import { OrderCanceledPublisher } from '../events/order-canceled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:id',
    requireAuth,
    currentUser,
    async (req: Request, res: Response) => {
        if (!req.params.id) {
            throw new NotFoundError();
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new NotFoundError();
        }

        const order = await Order.findById(req.params.id).populate('ticket');
        
        if (!order) {
            throw new NotFoundError();
        }
        
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorized();
        }
        order.status = OrderStatus.Canceled;
        await order.save();
        new OrderCanceledPublisher(natsWrapper.client)
            .publish({
                id: order.id,
                version: order.version,
                ticket: {
                    id: order.ticket.id,
                }
            });
        res.status(204).send({
            order
        });
    }
)

export {router as deleteOrderRouter};