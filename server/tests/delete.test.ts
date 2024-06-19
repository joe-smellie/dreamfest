import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
} from 'vitest'

import { connection } from '../db'
import server from '../server'


beforeAll(async() => {
    await connection.migrate.latest()
})

beforeEach(async () => {
    await connection.seed.run()
})

describe('it should delete an event', () => {
    it ('deletes an event', async () => {

    })
})

expect().toBe