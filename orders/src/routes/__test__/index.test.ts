import request from 'supertest';
import { app } from '../../app';

it('it returns orders',async () => {
    const firstUser = global.signup();
    const secondUser = global.signup(); 

    const ticket = await global.makeTicket('title', 20);;

    await request(app).post('/api/orders')
        .set('Cookie', firstUser)
        .send({
            ticketId:ticket.id
        });


    const ticket2 = await global.makeTicket('title', 20);
    await request(app).post('/api/orders')
        .set('Cookie', secondUser)
        .send({
            ticketId:ticket2.id
        });

    const ticket3 = await global.makeTicket('title', 20);
    await ticket3.save();
    await request(app).post('/api/orders')
        .set('Cookie', secondUser)
        .send({
            ticketId:ticket3.id
        });
    const response = await request(app).get('/api/orders')
        .set('Cookie', secondUser)
        .expect(200);
    expect(response.body.orders.length).toEqual(2);
})