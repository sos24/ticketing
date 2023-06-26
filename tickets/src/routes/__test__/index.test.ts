import request from 'supertest';
import { app } from '../../app';

it('it returns tickets',async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title',
            price: 10
        })
        .expect(201);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title 2',
            price: 20
        })
        .expect(201);
    const resp = await request(app)
        .get('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title 2',
            price: 20
        })
        expect(resp.body.tickets.length > 0);
})