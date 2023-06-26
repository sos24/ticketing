import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


import { natsWrapper } from '../../nats-wrapper';

it('404 if id not provided', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'aaaaa',
            price: 20
        })
        .expect(404);
})

it('401 if user not authed', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`)
        .send({
            title: 'aaaaa',
            price: 20
        })
        .expect(401);
})

it('401 if user not owner', async () => {
    const cookie = global.signup();
    const resp = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'title 2',
            price: 20
        })
        .expect(201);
    const id = resp.body.ticket.id;
    const updateResponse = await request(app).put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'aaaaa',
            price: 10
        })
        .expect(401);
})

it('400 if provided input not valid data', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'aaaaa',
            price: 0
        })
        .expect(400);
})

it('200 if provided input is valid data', async () => {
    const cookie = global.signup();
    const resp = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'title 2',
            price: 20
        })
        .expect(201);
    const id = resp.body.ticket.id;
    const updateResponse = await request(app).put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'aaaaa',
            price: 10
        })
        .expect(200);
})

it('publishes an event', async () => {
    const cookie = global.signup();
    const resp = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'title 2',
            price: 20
        })
        .expect(201);
    const id = resp.body.ticket.id;
    const updateResponse = await request(app).put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'aaaaa',
            price: 10
        })
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})