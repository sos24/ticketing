import request from 'supertest';
import { app } from '../../app';

it('returns response with user', async () => {
  const cookie = await signup();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(400);
  expect(response.body.user.email).toEqual('test@test.com');
});

it('returns response with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send({})
    .expect(200);
  expect(response.body.user).toEqual(null);
});
