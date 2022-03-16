const axios = require('axios')
const router = require('express').Router()

//Getting train numbers from 
router.get('/numbers', async (req, res) => {
    let trainNumbers = []
    //Getting trains which are on running currently and which are either long-distance trains or commuter trains.
    //Unless this is done, there are a lot more trains than commuter ones and long-distance ones.
    const response = await axios.get('https://rata.digitraffic.fi/api/v1/live-trains', {headers: {'Accept-encoding' : 'deflate, gzip;q=1.0, *;q=0.5'}})
    const data = response.data
    const trains = data.filter(train => (train.runningCurrently && (train.trainCategory === "Long-distance" || train.trainCategory === "Commuter")))
    //const trains = data.filter(train => train.runningCurrently) //If wanted to get the all the trains which are on move
    trains.forEach(train => trainNumbers.push(train.trainNumber))
    res.send(trainNumbers)
})

module.exports = router