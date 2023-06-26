import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/Order';

it('returns 404 if not order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'dsadasds',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 if order not belongs to user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'dsadasds',
      orderId: order._id,
    })
    .expect(401);
});

it('returns 400 if order canceled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId: userId,
    status: OrderStatus.Canceled,
    version: 0,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'dsadasds',
      orderId: order._id,
    })
    .expect(400);
});
