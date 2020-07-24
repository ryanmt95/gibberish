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

var rooms = []

io.on('connection', socket => {
    socket.on('joinRoom', ({nickname, roomId}) => {
        var index = rooms.findIndex(room => room['id'] === roomId)
        if(index === -1) {
            // room not created
            index = rooms.length
            rooms.push({
                id: roomId,
                players: [
                    {id: socket.id, name: nickname, lastScore: 0, totalScore: 0}
                ],
                gamestate: 'GAME_WAITING',
                currentRound: 0
            })
        } else {
            rooms[index]['players'].push({id: socket.id, name: nickname, lastScore: 0, totalScore: 0})
        }
        socket.join(roomId)
        io.to(roomId).emit('updateRoom', rooms[index])
    })
    socket.on('disconnect', () => {
        for(var i = 0; i < rooms.length; i++) {
            const index = rooms[i]['players'].findIndex(player => player.id === socket.id)
            if(index !== -1) {
                rooms[i]['players'].splice(index, 1)
            }
            console.log(rooms[i])
            io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
        }

    })

    socket.on('transitionState', ({roomId, nextState}) => {
        const index = rooms.findIndex(room => room['id'] === roomId)
        if(index === -1) {
            //invalid room
        } else {
            rooms[index]['state'] = nextState
        }
        io.to(roomId).emit('updateRoom', rooms[index])
    })
})

setInterval(() => {
    io.emit('tick', 'tick')
}, 1000)

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

//Routes for application
require('./routes.js')(app);

module.exports = app;
