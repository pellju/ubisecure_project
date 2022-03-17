const router = require('express').Router()

const trainData = []

router.put('/:id/location', async (req, res) => {
    const body = req.body

    const id = req.params.id
    const name = body.name
    const destination = body.destination
    const speed = body.speed
    const coordinates = body.coordinates

    if (!name || !destination || !speed || !coordinates ) {
        return res.status(400).send({ error: 'Missing name, destination, speed or coordinates' })
    }

    const newTrain = {
        id: id,
        name: name,
        destination: destination,
        speed: speed,
        coordinates: coordinates
    }
    
    const wantedTrain = trainData.find(train => train.id === id)
    if (wantedTrain) {
        const replacebleIndex = trainData.indexOf(wantedTrain)
        trainData[replacebleIndex] = newTrain
    } else {
        trainData.push(newTrain)
    }

    res.status(201).send(trainData)
})

router.get('/', (req, res) => {
    res.send(trainData)
})

module.exports = router