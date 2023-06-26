import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order,OrderStatus } from '../../models/Order';

import { natsWrapper } from '../../nats-wrapper';

it('return an error if ticket is not valid',async () => {
    await request(app).post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId: new mongoose.Types.ObjectId(),
        }).expect(404);
});

it('return an error if ticket is reserved',async () => {
    const ticket = await global.makeTicket('title', 20);
    const order = Order.build({
        ticket,
        userId: 'fdsfsdf',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save();

    await request(app).post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId:ticket.id
        }).expect(400);
});

it('return an error if ticket is reserved',async () => {
    const ticket = await global.makeTicket('title', 20);
    await ticket.save();
    await request(app).post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId:ticket.id
        }).expect(201);
});

it('must emit order created event', async function () {
    const ticket = await global.makeTicket('title', 20);
    await ticket.save();
    await request(app).post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId:ticket.id
        }).expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});