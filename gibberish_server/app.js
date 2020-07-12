const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose')
require('dotenv').config()

const questionbank = require("./mongo_models/question_bank");

const app = express();
const server = http.createServer(app);
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
require('./routes.js')(app);

module.exports = app;
