import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

import { natsWrapper } from '../../nats-wrapper';

it('it has a route handler lsitening to /api/tickets for post request',async () => {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(404)
});

it('it can only be accesed if user is auth-ed',async () => {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).toEqual(401)
});

it('returns other than 401 if user is authed',async () => {
    const response = await request(app).post('/api/tickets')
        .set('Cookie', global.signup()).send({});
    expect(response.status).not.toEqual(401);
});

it('returns error if title is invalid',async () => {
     await request(app).post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: "",
            price: 10,
        }).expect(400)
});

it('returns error if price is invalid',async () => {
    await request(app).post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: "dsasdsadsads",
            price: 0,
        }).expect(400)
});

it('its creats ticket with valid data',async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0)
    await request(app).post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: "dsasdsadsads",
            price: 10,
        }).expect(201)
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1)
});


it('publishes an event', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0)
    await request(app).post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: "dsasdsadsads",
            price: 10,
        }).expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})