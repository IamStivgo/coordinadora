import supertest from 'supertest';
import { app, server, initConnections, finishConnections } from '../src/server';

const api = supertest(app);
let adminToken:string;

beforeAll(async () => {
  await initConnections();
  
  const adminResponse = await api
    .post('/v1/users/sign-in')
    .send({
      email: 'admin@coordinadora.com',
      password: 'admin',
    });
  
  adminToken = adminResponse.body.token;
});

// test /v1/users/sign-up
// body params : email, password, firstName, lastName, phoneNumber

test('POST /v1/users/sign-up', async () => {
  const response = await api
    .post('/v1/users/sign-up')
    .send({
      email: 'test1@coordinadora.com',
      password: '12345678',
      firstName: 'Test1',
      lastName: 'Test1',
      phoneNumber: '1234567890',
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.message).toEqual('User created successfully');
});

// test User already exists
test('POST /v1/users/sign-up when user already exists', async () => {
  const response = await api
    .post('/v1/users/sign-up')
    .send({
      email: 'test1@coordinadora.com',
      password: '12345678',
      firstName: 'Test1',
      lastName: 'Test1',
      phoneNumber: '1234567890',
    })
    .expect(409)
    .expect('Content-Type', /application\/json/);

  expect(response.body.message).toEqual('User already exists');
});

// test /v1/users/sign-in
// body params : email, password

test('POST /v1/users/sign-in with normal user', async () => {
  const response = await api
    .post('/v1/users/sign-in')
    .send({
      email: 'test1@coordinadora.com',
      password: '12345678',
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveProperty('token');
});

test('Admin token should be available after beforeAll', () => {
  expect(adminToken).toBeDefined();
  expect(typeof adminToken).toBe('string');
});

// create driver with admin token
test('POST /v1/drivers', async () => {
  const driver = {
    firstName: "driver",
    lastName: "driver1",
    phoneNumber: "3003001010",
    email: "driver1@coordinadora.com",
    password: "coordinadora",
    currentLocation: "Bogota"
  };

  const responseDriver = await api
    .post('/v1/drivers')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(driver)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(responseDriver.body.message).toEqual('Driver created successfully');
});

//test get drivers with admin token
test('GET /v1/drivers', async () => {
  const responseDriver = await api
    .get('/v1/drivers')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(responseDriver.body.data.length).toBeGreaterThan(0);
});

afterAll(async() => {
  await finishConnections();
  server.close();
});
