import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorized,
  OrderStatus,
} from '@tickets-sosghazaryan/common';

import { Order } from '../models/Order';
import { stripe, currency, normalizePrice } from '../stripe';
import { Payment } from '../models/Payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').trim().not().isEmpty(),
    body('orderId').trim().not().isEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError('Order canceled');
    }

    const response = await stripe.charges.create({
      currency,
      amount: normalizePrice(order.price),
      source: token,
    });
    const payemnt = Payment.build({
      orderId,
      stripeId: response.id,
    });
    await payemnt.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payemnt.id,
      orderId: payemnt.orderId,
      stripeId: payemnt.stripeId,
    });
    res.send({
      success: true,
    });
  }
);

export { router as createChargeRouter };
