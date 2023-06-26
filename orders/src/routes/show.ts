import express, {Request, Response} from 'express';

import { NotAuthorized, NotFoundError, currentUser, requireAuth } from '@tickets-sosghazaryan/common';
import mongoose from 'mongoose';

import { Order } from '../models/Order';

const router = express.Router();

router.get(
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

        res.status(200).send({
            order
        });
    }
)

export {router as showOrderRouter};