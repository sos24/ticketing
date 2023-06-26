import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if ticket not founded',async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const resp = await request(app).get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('returns ticket',async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title',
            price: 10
        })
        .expect(201);
    await request(app).get(`/api/tickets/${response.body.ticket.id}`)
        .send()
        .expect(200);
});