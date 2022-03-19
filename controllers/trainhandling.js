//File used for handling train-related functions in backend

//Importing Router and the broadcasting function for updating the trainlist 
import { Router } from 'express'
import { broadCast } from '../app.js'

export const trainRouter = Router()

//Initializing trainlist and function returning the train list
const trainData = []
export const getTrainData = () => trainData

//Path used for adding and customizing trains
trainRouter.put('/:id/location', async (req, res) => {
    const body = req.body

    //Getting train id and the details from the body
    const id = req.params.id
    const { name, destination, speed, coordinates } = body

    //Checking if name, destionation, speed and coordinates exist
    if (!name || !destination || !speed || !coordinates ) {
        return res.status(400).send({ error: 'Missing name, destination, speed or coordinates' })
    }

    //Checking that values are ok: name = string, destination = string, speed = number, coordinates = number, size === 2
    //Types are based on the example I recieved with the exercise
    if (typeof name !== 'string' || typeof destination !== 'string' || typeof speed !== 'number' || typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number' || coordinates.length !== 2) {
        return res.status(400).send({ error: 'Incorrect types for values'})
    }
    
    //Creating a new train
    const newTrain = { id, name, destination, speed, coordinates }
    
    //If train exists, updating it, if it does not exist, creating a new one
    const wantedTrain = trainData.find(train => train.id === id)
    if (wantedTrain) {
        const replacebleIndex = trainData.indexOf(wantedTrain)
        trainData[replacebleIndex] = newTrain
    } else {
        trainData.push(newTrain)
    }

    //Returning the trainlist and broadcasting it using websocket
    //Using stringfy because Websocket does not transfer arrays, strings only
    broadCast(JSON.stringify(trainData))
    res.status(201).send(trainData)
})

//Listing train data, used for debugging purposes
trainRouter.get('/', (req, res) => {
    res.send(trainData)
})