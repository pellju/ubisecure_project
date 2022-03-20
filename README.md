# Nodejs + express -based backend for program showing trains on the map.

This application is backend for showing train data, which is given to the software using `HTTP PUT`-requests.
The backend also handles the user management (registration and logging in), which are used in the frontend to see the trains.

The data sent for this server (users and trains) are stored in arrays, so restarting the server removes them.
The server communicates with front-end using websocket, so due to the lack of SSL (and time), they have to be run on the same instance.

The server runs on port `3001`, and the websocket server is running on port `8082`.

## Installation and usage:

0.) Install nodejs and clone the project

1.) Go to the root directory of the project and install the required packages by `npm install`

2.) The project can be run by `npm run start`

3.) Trains are added and updated by sending a `HTTP PUT`-request to `http://localhost:3001/trains/<trainid>/location` (for example `http://localhost:3001/trains/10/location` updates the train whose ID is 10).
The body used for train is following:
`{
    name: 'name of the train',
    destination: 'somewhere',
    speed: 100,
    coordinates: [60, 21]
}`

Note that the type of *name* and *destination* has to be **string**, the type of *speed* has to be **integer** and the type of *coordinates* has to be number-Array, whose length is 2.
If incorrect values are used, the backend will return error code *400*.

4.) Users are added by `HTTP POST`-request, which is sent to `http://localhost:3001/api/register`. There are some requirements for the user, for example, email has to contain *@*, and the length of password, name and username has to be at least 1 (these can be changed on *controllers/userhandling.js*).
The body used for registration is following:
`{
    username: 'test-user',
    name: 'Test User',
    email: 'test@user.com',
    password: '123456'
}`

If incorrect values are used, the backend will return error code *400*.

5.) Login is meant to be done through frontend, but is possible through backend, too. Users can login by `HTTP POST`-request, which is sent to `http://localhost:3001/api/login`. The body used is following:
`{
    username: 'test-user',
    password: '123456'
}`

If incorrect username or password is used, it will result as error-code *401*.

### Testing

There are a few integration tests related userhandling (registering and loggining in) and trains (how to software will behave when adding new trains or customizing existing ones). Also, there are tests for error-case-scenarios, such as missing or incorrect-typed values based on the example, which was given on exercise.

Tests are done using `mocha`, `chai` and `supertest`.

These tests can be run by `npm test`. After testing, the test has to be closed using `Ctrl+C`.
