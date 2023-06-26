import request from 'supertest';
import { app } from '../../app';

it('returns 400 on signin when email not exists', async () =>{
    return request(app).post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('returns 200 on signin when email exists', async () =>{
    await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    return request(app).post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
});

it('returns 400 if wrong password ', async () =>{
    await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
        return request(app).post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'passwo'
        })
        .expect(400);
});

it('returns 400 if wrong email ', async () =>{
    await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
        return request(app).post('/api/users/signin')
        .send({
            email: 'test@test2.com',
            password: 'passwo'
        })
        .expect(400);
});

it('sets cookie after success', async () =>{
    await request(app).post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    const response = await request(app).post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});