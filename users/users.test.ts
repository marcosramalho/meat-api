import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { User } from './users.model';
import { usersRouter } from './users.router';
import { environment } from './../common/environment';

let address: string
let server: Server

beforeAll(() => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test'
  environment.server.port = process.env.SERVER_PORT || 3001
  address = `http://localhost:${environment.server.port}`
  server = new Server()
  return server.bootstrap([usersRouter]).then(() => User.remove({}).exec()).catch(console.error)
})

test('GET /users', () => {
  return request(address).get('/users')
  .then(response => {
    expect(response.status).toBe(200)
    expect(response.body.items).toBeInstanceOf(Array)

  }).catch(fail)
})

test('POST /users', () => {
  return request(address).post('/users')
  .send({
    name: 'usuario1',
    email: 'usuario1@gmail.com',
    password: '123456',
    cpf: '512.417.212-62'
  }).then(response => {
    expect(response.status).toBe(200)
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toBe('usuario1')
    expect(response.body.email).toBe('usuario1@gmail.com')
    expect(response.body.cpf).toBe('512.417.212-62') 
    expect(response.body.password).toBeUndefined()
  }).catch(fail)
})

afterAll(() => {
  return server.shutdown()
})