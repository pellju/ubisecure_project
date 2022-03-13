//File contains registration and login functions
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//Defining some variables with used for registration
const minPasswordLengthRequirement = 1
const minUsernameLengthRequirement = 1
const minNameLengthRequirement = 1
const saltRounds = 10

//Function for registering an user
router.post('/register', async (req, res) => {
    const body = req.body

    //Checking that password, username and name meets given requirements (exists and length is at least 1)
    if (body.password === undefined || body.username === undefined || body.name === undefined || body.email === undefined) {
        return res.status(400).send({ error: 'Username or password or name not defined'})
    } else if (body.password.length < minPasswordLengthRequirement || body.username.length < minUsernameLengthRequirement || body.name.length < minNameLengthRequirement || !body.email.contains('@')) {
        return res.status(400).send({ error: 'Length of username or password or name is invalid'})
    } else {
        const checkingIfUserExists = User.findOne({ username: body.username })
        if (checkingIfUserExists !== null) {
            return res.status(400).send({ error: 'Username already found, please use another one'})
        }

        //Hashing the user-given password
        const pwHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User ({
            username: body.username,
            email: body.email,
            name: body.name,
            hashedPassword: pwHash
        })

        const addedUser = await user.save()
        res.json(addedUser)
    }
})

//Function for logging in
router.post('/login', async(req,res) => {
    const body = req.body

    const userChecking = await User.findOne({ username: body.username })

    if (userChecking === undefined || body.password === undefined) {
        return res.status(400).send({ error: 'Undefined username or password' })
    } else {
        const isPasswordCorrect = bcrypt.compare(body.password, userChecking.hashedPassword)
        if (!isPasswordCorrect) {
            return res.status(401).send({ error: 'Incorrect username or password' })
        }

        const tokenData = {
            username: userChecking.username,
            email: userChecking.email,
            id: userChecking.id
        }

        const token = jwt.sign(tokenData, process.env.SECRET)
        res.status(200).send({ token, username: userChecking.username, email: userChecking.email, name: userChecking.name })
    }
})