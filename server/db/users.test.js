const knex = require('knex')
const config = require('./knexfile').test
const testDb = knex(config)

const users = require('./users')

beforeAll(() => {
  return testDb.migrate.latest()
})

beforeEach(() => {
  return testDb.seed.run()
})

describe('getUserByName', () => {
  it('returns the correct user', () => {
    return users.getUserByName('admin', testDb)
      .then((user) => {
        expect(user.username).toBe('admin')
        expect(user.isAdmin).toBeTruthy()
        expect(user.gardenId).toBe(1)
        expect(user).toHaveProperty('hash')
        expect(user.email).toBe('admin@outlook.com')
        return null
      })
  })
})

describe('createUser', () => {
  it('creates a new user', () => {
    const user = {
      username: 'newuser',
      password: 'hello',
      gardenId: 3,
      email: 'random@testoutlook.com'
    }
    return users.createUser(user, testDb)
      .then(() => users.getUserByName('newuser', testDb))
      .then((user) => {
        expect(user.username).toBe('newuser')
        expect(user.isAdmin).toBeFalsy()
        expect(user.gardenId).toBe(3)
        expect(user.email).toBe('random@testoutlook.com')
        return null
      })
  })
})

describe('userExists', () => {
  it('returns true if user exists', () => {
    return users.userExists('admin', testDb)
      .then((exists) => {
        expect(exists).toBeTruthy()
        return null
      })
  })
  it('returns false if user not found', () => {
    return users.userExists('other-non-existent-user', testDb)
      .then((exists) => {
        expect(exists).toBeFalsy()
        return null
      })
  })
})

// describe('get users emails by garden', () => {
//   it('returns the emails of the users in that garden', () => {
//     return users.getUserEmailsByGarden('1', testDb)
//       .then((user) => {
//         expect(Array.isArray(user)).toBe(true)
//         expect(user[0]).toBe('test@outlook.com')
//         return null
//       })
//   })
// })
