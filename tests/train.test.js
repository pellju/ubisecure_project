import supertest from "supertest"
import { expect } from "chai"
import { app } from '../app.js'

const trainTesting = supertest(app)

describe('Testing train-related methods', function() {

    const correctData = {
        name: 'Test train',
        destination: 'Somewhere',
        speed: 200,
        coordinates: [60.3, 21.3]
    }

    it('/trains should return 200 ', async () => {
        await trainTesting.get('/trains').expect(200)
    })

    it('Putting valid data to /trains/:id/location should return 201', async () => {
        await trainTesting.put('/trains/10/location').set('Content-Type', 'application/json; charset=utf-8').send(correctData).expect(201)
    })

    it('Testing that the correct data is found /trains', async () => {
        const afterAddingId = {id: "10", ...correctData} //The id has been defined in the test above
        const response = await trainTesting.get('/trains').expect(200)
        expect(response.body[0]).to.eql(afterAddingId)
    })

    it('Testing that changing the data of existing train should update its object', async () => {
        const updatedTrain = {
            name: 'Test train',
            destination: 'Not sure',
            speed: 120,
            coordinates: [60.5, 21.5]
        }
        const afterUpdate = {id: "10", ...updatedTrain}
        await trainTesting.put('/trains/10/location').set('Content-Type', 'application/json; charset=utf-8').send(updatedTrain).expect(201)
        const response = await trainTesting.get('/trains').expect(200)
        expect(response.body[0]).to.eql(afterUpdate)
    })

    it('Testing that adding a new train returns a two trains', async () => {
        const newTrain = {
            name: 'Train 2',
            destination: 'Helsinki',
            speed: 120,
            coordinates: [59.9, 22]
        }
        await trainTesting.put('/trains/2/location').set('Content-Type', 'application/json; charset=utf-8').send(newTrain).expect(201)
        const check = await trainTesting.get('/trains').expect(200)
        expect(check.body).to.have.length(2)
    })

    it ('Putting incorrect train data should return 400', async () => {
        const incorrectData = {
            name: 'Incorrect',
            destination: 'Somewhere',
            speed: 100,
            coordinates: [60]
        }

        await trainTesting.put('/trains/42/location').set('Content-Type', 'application/json; charset=utf-8').send(incorrectData).expect(400)
    })

    it ('Missing values when putting train-data should return 400', async () => {
        const missingData = {
            'name': 'does not work'
        }
        await trainTesting.put('/trains/100/location').set('Content-Type', 'application/json; charset=utf-8').send(missingData).expect(400)
    })
})
    