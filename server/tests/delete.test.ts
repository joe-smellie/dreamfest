import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest'

import { connection } from '../db'
import server from '../server'
import request from 'supertest'


beforeAll(async() => {
    await connection.migrate.latest()
})

beforeEach(async () => {
    await connection.seed.run()
})

afterAll(async () => {
    await connection.destroy()
})

describe('it should delete an event', () => {
    it ('deletes an event', async () => {

        //before
        const original = await request(server).get('/api/v1/schedule/friday')
        console.log('What is original here' , original.body )
        
        //catch ya later
        const res = await request(server).delete('/api/v1/events/1')
        console.log('Where are ya res', res.status) // 500 error

        //after
        const after = await request(server).get('/api/v1/schedule/friday')
        console.log('What is happening here?' , after.body)

        expect(original.body.length).toBeGreaterThan(after.body.length)
        expect(res.status).toBe(204)
    })
})

