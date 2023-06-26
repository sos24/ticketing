import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if order not founded', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const resp = await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(404);
});
it('returns 401 if user not provided', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const resp = await request(app).get(`/api/orders/${id}`).send().expect(401);
});
it('returns ticket', async () => {
  const secondUser = global.signup();
  const ticket3 = await global.makeTicket('title', 20);
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', secondUser)
    .send({
      ticketId: ticket3.id,
    });
  await request(app)
    .get(`/api/orders/${response.body.order.id}`)
    .set('Cookie', secondUser)
    .send()
    .expect(404);
});
