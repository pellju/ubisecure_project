//Importing basic requirements
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {} from 'dotenv/config'

//Importing websocket server and uuid for generating the id
import { WebSocketServer } from 'ws'
import * as uuid from 'uuid'

//Importing routers and trainList from selfmade files
import { userRouter } from './controllers/userhandling.js'
import { trainRouter, getTrainData } from './controllers/trainhandling.js'

//Creating the express-server, exported for index.js
export const app = express()


//Connecting to the MongoDB database (for user data)
mongoose.connect(process.env.mongodbAddr).then(() => console.log('Connected to mongodb'))
    .catch(e => console.log('Error: ', e))

//Creating a websocket server and initializing the client list
const wss = new WebSocketServer({ port: 8082 })
let webSocketClients = []

//Creating a broadcast function which sends a new message for each of the connected clients
//Used when adding a new train or customizing an existing one 
export const broadCast = (message) => {
    for (let client of webSocketClients) {
        client.send(message)
    }
}

//Handling the websocket server, a new client connected given as a parameter for the function
wss.on('connection', function connection(ws) {
    //A new client is connected
    console.log('Client connected')
    //Sending the list of trains for the first the client first time and randomizing its id 
    ws.send(JSON.stringify(getTrainData()))
    ws.id = uuid.v4()

    webSocketClients.push(ws)

    //When closing the client session, removing the client from the websocket client list
    ws.on('close', function() {
        console.log('Client disconnected')
        webSocketClients = webSocketClients.filter(client => client.id !== ws.id)
    })
})

//Enabling cors and json for the application and enabling paths related to user handling and train handling
app.use(cors())
app.use(express.json())
app.use('/api', userRouter)
app.use('/trains', trainRouter)

app.get('/', (req, res) => {
    res.send('Hello world!')
})