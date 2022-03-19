//User-format

//Importing mongodb-connections
import mongoose from 'mongoose'
import mongooseValidator from 'mongoose-unique-validator'

//Creating the user-type (username, name, password (hashed))
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    name: String,
    hashedPassword: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.hashedPassword
    }
})

userSchema.plugin(mongooseValidator)
export const User = mongoose.model('User', userSchema)