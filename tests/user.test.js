import supertest from "supertest"
import { expect } from "chai"
import { app } from '../app.js'

const userTesting = supertest(app)

describe('Testing train-related methods', function() {

    const correctUser = {
        username: 'tester',
        name: 'Test Person',
        email: 'test@tester.net',
        password: '123456'
    }

    it('Registering an user to /api/register should return 200', async () => {
        const response = await userTesting.post('/api/register').set('Content-Type', 'application/json; charset=utf-8').send(correctUser).expect(200)
        expect(response.text).to.eql('Registration ok')
    })

    it('Regisetering an user, which has already been registered using same username or email, results in status 400', async () => {
        const response = await userTesting.post('/api/register').set('Content-Type', 'application/json; charset=utf-8').send(correctUser).expect(400)
        expect(response.text).to.include('Username or email already found, please use another one')
    })

    it('When trying to register with user details, which have less characters than required, resulsts in status 400', async () => {
        const incorrectlyFormattedUser = {
            username: '',
            name: '',
            email: '',
            password: ''
        }

        const response = await userTesting.post('/api/register').set('Content-Type', 'application/json; charset=utf-8').send(incorrectlyFormattedUser).expect(400)
        expect(response.text).to.include('Length of username or password or name or email is invalid')
    })

    it('When trying to register with incorrect email (missing @), result is 400', async () => {
        const incorrectEmail = {
            username: 'test',
            name: 'tester',
            email: 'this is not an email',
            password: '654321'
        }

        const response = await userTesting.post('/api/register').set('Content-Type', 'application/json; charset=utf-8').send(incorrectEmail).expect(400)
        expect(response.text).to.include('Length of username or password or name or email is invalid')
    })

    it('When trying to register without using required values, the result is 400', async () => {
        const notAllValues = {
            username: 'test1'
        }
        const response = await userTesting.post('/api/register').set('Content-Type', 'application/json; charset=utf-8').send(notAllValues).expect(400)
        expect(response.text).to.include('Username or password or name or email not defined')
    })

    it('Logging in works (results in 200)', async () => {
        await userTesting.post('/api/login').set('Content-Type', 'application/json; charset=utf-8').send(correctUser).expect(200)
    })

    it('When trying to log in with incorrect password, the result will be 401', async () => {
        const incorrectPw = {
            username: 'tester',
            password: '654321'
        }

        const response = await userTesting.post('/api/login').set('Content-Type', 'application/json; charset=utf-8').send(incorrectPw).expect(401)
        expect(response.text).to.include('Incorrect username or password')
    })

    it('When trying to log in with non-existing username, the result will be 401', async () => {
        const nonexistingUser = {
            username: 'tester1',
            password: '123456'
        }

        const response = await userTesting.post('/api/login').set('Content-Type', 'application/json; charset=utf-8').send(nonexistingUser).expect(401)
        expect(response.text).to.include('Incorrect username or password')
    })
})