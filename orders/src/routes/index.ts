import express, { Request, Response } from 'express';
import { Order } from '../models/Order';
import { currentUser, requireAuth } from '@tickets-sosghazaryan/common';

const router = express.Router();

router.get(
  '/api/orders',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');
    return res.status(200).send({
      orders,
    });
  }
);

export { router as indexOrderRouter };
