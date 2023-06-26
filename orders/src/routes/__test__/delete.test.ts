import request from 'supertest';
import { app } from '../../app';
import { OrderStatus } from '@tickets-sosghazaryan/common';
import { Order } from '../../models/Order';
import { natsWrapper } from '../../nats-wrapper';

it('updates order',async () => {
    const secondUser = global.signup(); 
    const ticket3 = await global.makeTicket('title', 20);
    const response = await request(app).post('/api/orders')
        .set('Cookie', secondUser)
        .send({
            ticketId:ticket3.id
        });
    const updateResponse = await request(app).delete(`/api/orders/${response.body.order.id}`)
        .set('Cookie', secondUser)
        .send()
        .expect(204);
    const order = await Order.findById(response.body.order.id)
    expect(order?.status).toEqual(OrderStatus.Canceled);
});

it('emit order canceled',async () => {
    const secondUser = global.signup(); 
    const ticket3 = await global.makeTicket('title', 20);
    const response = await request(app).post('/api/orders')
        .set('Cookie', secondUser)
        .send({
            ticketId:ticket3.id
        });
    const updateResponse = await request(app).delete(`/api/orders/${response.body.order.id}`)
        .set('Cookie', secondUser)
        .send()
        .expect(204);
    const order = await Order.findById(response.body.order.id)
    expect(order?.status).toEqual(OrderStatus.Canceled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})