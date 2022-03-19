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

    const id = req.params.id
    const name = body.name
    const destination = body.destination
    const speed = body.speed
    const coordinates = body.coordinates
    //const { name, destination, speed, coordinates } = body

    //Checking if name, destionation, speed and coordinates exist
    if (!name || !destination || !speed || !coordinates ) {
        return res.status(400).send({ error: 'Missing name, destination, speed or coordinates' })
    }

    //Jonkinsortin tarkistus että valuet ovat ok pitäis tehdä
    const newTrain = { //tästä vois jättää id: yms. pois ja laittaa vain id, name, ...
        id: id,
        name: name,
        destination: destination,
        speed: speed,
        coordinates: coordinates
    }
    
    //If train exists, updating it, if it does not exist, creating a new one
    const wantedTrain = trainData.find(train => train.id === id)
    if (wantedTrain) {
        const replacebleIndex = trainData.indexOf(wantedTrain)
        trainData[replacebleIndex] = newTrain
    } else {
        trainData.push(newTrain)
    }

    //Returning the trainlist and broadcasting it using websocket
    broadCast(JSON.stringify(trainData))
    res.status(201).send(trainData)
})

//Listing train data, used for debugging purposes
trainRouter.get('/', (req, res) => {
    res.send(trainData)
})