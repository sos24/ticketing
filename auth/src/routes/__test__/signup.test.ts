import request from 'supertest';
import { app } from '../../app';

it('returns 201 on signup', async () =>{
    return request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns 400 on signup for used email', async () =>{
    await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    return request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('returns 400 on signup with invalid email', async () =>{
    return request(app).post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
});

it('returns 400 on signup with invalid password', async () =>{
    return request(app).post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'pas'
        })
        .expect(400);
});

it('returns 400 on signup with empty fields', async () =>{
    await request(app).post('/api/users/signup')
        .send({
            password: 'pas'
        })
        .expect(400);
    await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400);
    await request(app).post('/api/users/signup')
        .send({})
        .expect(400);
});

it('sets cookie after success', async () =>{
    const response = await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
});