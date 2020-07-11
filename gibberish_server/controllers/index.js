const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = 4000;

server.listen(PORT)

// Log requests to the console.
app.use(logger('dev'));
app.use(cors({
    origin: 'localhost:4000'
}));
// extract the body of an incoming request and parse into Json object
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}));

//Routes for application
require('./routes')(app);

module.exports = app;
