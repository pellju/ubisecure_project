//File contains registration and login functions

//Importing necessaries
import bcrypt from 'bcrypt'
import { Router } from 'express'
export const userRouter = Router()
import { User } from '../models/user.js'

import jwt from 'jsonwebtoken'

//Setting a some kind of requirements for user details
const minPasswordLengthRequirement = 1
const minUsernameLengthRequirement = 1
const minNameLengthRequirement = 1
const saltRounds = 10

//Function for registering an user
userRouter.post('/register', async (req, res) => {
    const body = req.body
    //Checking that password, username and name meets given requirements (exists and length is at least 1)
    if (body.password === undefined || body.username === undefined || body.name === undefined || body.email === undefined) {
        return res.status(400).send({ error: 'Username or password or name not defined'})
    } else if (body.password.length < minPasswordLengthRequirement || body.username.length < minUsernameLengthRequirement || body.name.length < minNameLengthRequirement || !body.email.includes('@')) {
        return res.status(400).send({ error: 'Length of username or password or name is invalid'})
    } else {
        const checkingIfUserExists = await User.findOne({ username: body.username })
        if (checkingIfUserExists !== null) {
            return res.status(400).send({ error: 'Username already found, please use another one'})
        }

        //Hashing the user-given password and creating a new user
        const pwHash = await bcrypt.hash(body.password, saltRounds)
        const user = new User ({
            username: body.username,
            email: body.email,
            name: body.name,
            hashedPassword: pwHash
        })

        //Adding a new user to the database
        const addedUser = await user.save()
        res.json(addedUser)
    }
})

//Function for logging in
userRouter.post('/login', async( req,res) => {
    const body = req.body

    //Checking if user exists
    const userChecking = await User.findOne({ username: body.username })
    if (userChecking === undefined || body.password === undefined || body.password === '' || userChecking === null) {
        return res.status(400).send({ error: 'Undefined username or password' })
    } else {

        //In case user exists, checking that password is correct
        const isPasswordCorrect = await bcrypt.compare(body.password, userChecking.hashedPassword)
        if (!isPasswordCorrect) {
            return res.status(401).send({ error: 'Incorrect username or password' })
        }

        //Creating token (necessary?)
        const tokenData = {
            username: userChecking.username,
            email: userChecking.email,
            id: userChecking.id
        }

        //Sending token and info to the user
        const token = jwt.sign(tokenData, process.env.SECRET)
        res.status(200).send({ token, username: userChecking.username, email: userChecking.email, name: userChecking.name })
    }
})

//Used for debugging purposes
userRouter.get('/login', (req, res) => {
    res.send('Login')
})

userRouter.get('/register', (req, res) => {
    res.send('Register')
})