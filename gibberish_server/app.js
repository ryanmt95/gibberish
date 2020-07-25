const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose')
const socketio = require('socket.io')
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketio(server)
const PORT = 4000;

// connect to mongo database
mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;

connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

app.use(cors())

// Log requests to the console.
app.use(logger('dev'));

// extract the body of an incoming request and parse into Json object
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}));

require('./socket.js')(io)

module.exports = app;
