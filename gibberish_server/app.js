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

const questions = require('./sample_questions')
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
                currentRound: 0, 
                timer: 0,
                qna: questions.slice(0,10)
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
            io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
        }

    })

    socket.on('startGame', ({roomId}) => {
        const index = rooms.findIndex(room => room['id'] === roomId)
        if(index !== -1) {
            rooms[index]['currentRound'] += 1
            rooms[index]['gamestate'] = 'ROUND_LOADING'
            rooms[index]['timer'] = 3
            io.to(roomId).emit('updateRoom', rooms[index])
        }
    })
})

setInterval(() => {
    for(var i = 0; i < rooms.length; i++) {
        if(rooms[i]['timer'] > 0) {
            rooms[i]['timer']--
            io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
        } else {
            if(rooms[i]['gamestate'] === 'ROUND_LOADING') {
                rooms[i]['gamestate'] = 'ROUND_ONGOING'
                rooms[i]['timer'] = 5
                io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
            } else if(rooms[i]['gamestate'] === 'ROUND_ONGOING') {
                rooms[i]['gamestate'] = 'ROUND_ENDED'
                rooms[i]['timer'] = 5
                io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
            } else if(rooms[i]['gamestate'] === 'ROUND_ENDED') {
                if(rooms[i]['currentRound'] < 10) {
                    rooms[i]['currentRound'] += 1
                    rooms[i]['gamestate'] = 'ROUND_LOADING'
                    rooms[i]['timer'] = 3
                    io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
                } else {
                    rooms[i]['gamestate'] = 'GAME_ENDED'
                    io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
                }
            }
            
        }
    }
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
