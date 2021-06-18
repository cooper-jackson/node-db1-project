const request = require('supertest')
const db = require('../../data/db-config')
const server = require('../server')
const Account = require('./accounts-model')

const account1 = { name: 'account-50', budget: 300.00 }
const account2 = { name: 'account-51', budget: 400.00 }

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('accounts').truncate()
})

afterAll(async () => {
    await db.destroy()
})

it('correct env var', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('Accounts model functions', () => {
    describe('Create Account', () => {
        it('Adds account to the db', async () => {
            let accounts
            await Account.create(account1)
            accounts = await db('accounts')
            expect(accounts).toHaveLength(1)

            await Account.create(account2)
            accounts = await db('accounts')
            expect(accounts).toHaveLength(2)
        })
        it('Inserted name and budget', async () => {
            const account = await Account.create(account1)
            expect(account).toMatchObject({id:1, ...account})
            const name = await account.name
        })
    })
    describe('Delete Account', () => {
        it('Deletes account from db', async () => {
            const [id] = await db('accounts').insert(account1)
            let account = await db('accounts').where({id}).first()
            expect(account).toBeTruthy()
            await request(server).delete('/api/accounts/' + id)
            account = await db('accounts').where({id}).first()
            expect(account).toBeFalsy()
        })
        it('respond with the deleted account', async () => {
            // let accounts
            // await Account.create(account1)
            // accounts = await db('accounts')
            // expect(accounts).toHaveLength(1)
            // let account = await Account.deleteById("1")
            // expect(account.body).toMatchObject(account1)
            // expect(accounts).toHaveLength(1)

            await db('accounts').insert(account1)
            let account = await request(server).delete('/api/accounts/1')
            expect(account.body).toMatchObject(account1)
        })
    })
})