import app from '../server.js'
import request from 'supertest';

describe('POST /phone/data', () => {

  it('should return 200 if prefix exists', async () => {
    const response = await request(app)
      .post('/phone/data')
      .send({ phone_number: '111' });

    expect(response.status).toBe(200);
    expect(response.body.prefix).toBe(1);
  });

  it('should return 400 if invalid input (letters, chars, etc)', async () => {
    const response = await request(app)
    .post('/phone/data')
    .send({ phone_number: 'abc' });

  expect(response.status).toBe(400);
  });

});