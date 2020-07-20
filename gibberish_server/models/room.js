const uid = require("uid");
const Player = require("../models/player")
const questions = require('../sample_questions')

const redis = require("redis");
let port = 6379
let host = "127.0.0.1"
const client = redis.createClient(port, host);

client.on('connect', function () {
    console.error('Redis client connected');
});

client.on('error', function (err) {
    console.error('Something went wrong ' + err);
});


const STATE = {
    "GAME_WAITING": "GAME_WAITING",
    "ROUND_LOADING": "ROUND_LOADING",
    "ROUND_ONGOING": "ROUND_ONGOING",
    "ROUND_ENDED": "ROUND_ENDED",
    "GAME_ENDED": "GAME_ENDED"
}
Object.freeze(STATE);
const ROUND_NUMBER = 10;
Object.freeze(ROUND_NUMBER);

const DISCONNECT_MS = 1500

class Room {
    constructor(id = uid(), state = STATE.GAME_WAITING, round = 0, players = [], startedTime = null, qna = this.generateQuestions()) {
        this.id = id;
        this.state = state;
        this.round = round;
        this.players = players;
        this.startedTime = startedTime;
        this.qna = qna
        this.timer = Math.floor((new Date() - new Date(this.startedTime)) / 1000)
    }

    generateQuestions() {
        let qna = new Set()
        while (qna.size < ROUND_NUMBER) {
            const r = Math.floor(Math.random() * questions.length)
            qna.add(questions[r])
        }
        return Array.from(qna)
    }

    toJSON() {
        return {
            roomId: this.id,
            gameState: this.state,
            currentRound: this.round,
            players: this.players,
            startedTime: this.startedTime,
            qna: this.qna,
            timer: this.timer
        };
    }

    start() {
        if (this.state == STATE.GAME_WAITING) {
            this.state = STATE.ROUND_LOADING;
            this.startedTime = new Date();
            this.round++
        }
    }

    updatePlayers(nickname) {
        var index = -1
        for(var i = 0; i < this.players.length; i++) {
            index = this.players[i]['name'] === nickname ? i : index

            // check if player disconnected
            const player = this.players[i]
            if(Date.now() - player['lastPolled'] > DISCONNECT_MS) {
                this.players.splice(i, 1)
            }
        }
        if(index === -1) {
            const newPlayer = new Player(nickname)
            this.players.push(newPlayer)
        } else {
            this.players[index].updateLastPolled()
        }
    }

    nextState() {
        let now = new Date();
        let startTime = new Date(this.startedTime)
        switch (this.state) {
            case STATE.GAME_WAITING:
                break;
            case STATE.ROUND_LOADING:
                if (now - startTime > 3000) {
                    this.state = STATE.ROUND_ONGOING;
                    this.startedTime = now;
                }
                break;
            case STATE.ROUND_ONGOING:
                if (now - startTime > 10000) {
                    this.state = STATE.ROUND_ENDED;
                    this.startedTime = now;
                }
                break;
            case STATE.ROUND_ENDED:
                if (now - startTime > 5000) {
                    // reset last score
                    for (var i = 0; i < this.players.length; i++) {
                        this.players[i]['lastScore'] = 0
                    }
                    if (this.round < ROUND_NUMBER) {
                        this.state = STATE.ROUND_LOADING;
                        this.startedTime = now;
                        this.round++
                    } else {
                        this.state = STATE.GAME_ENDED;
                    }
                }
                break;
            case STATE.GAME_ENDED:
                break;
        }
    }

    restart() {
        this.state = STATE.GAME_WAITING;
        this.round = 0;
        this.startedTime = null;
        this.qna = this.generateQuestions();
        this.timer = Math.floor((new Date() - new Date(this.startedTime))/1000);

        let players = [];
        for (let player of this.players) {
            player.resetScore();
            players.push(player);
        }
        this.players = players;
    }

    addPlayer(nickname) {
        const player = new Player(nickname)
        this.players.push(player);
    }

    static deserializeRoom(jsonRoom) {
        let players = [];
        for (let player of jsonRoom.players) {
            const p = Player.deserializePlayer(player)
            players.push(p); // convert to player
        }
        let r = new Room(jsonRoom.roomId, jsonRoom.gameState, jsonRoom.currentRound, players, jsonRoom.startedTime, jsonRoom.qna);
        return r;
    }
}

function getRoomInfoAsJson(roomId) {
    return new Promise((res, rej) => {
        client.get(roomId, function (error, result) {
            if (error) {
                console.error(error);
                rej({});
            } else {
                // console.log('GET result ->' + result);
                res(JSON.parse(result));
            }
        })
    })
}

function getRoomInfoAsObject(roomId) {
    return getRoomInfoAsJson(roomId).then(room => {
        return Room.deserializeRoom(room)
    })
}

function saveRoom(roomObject) {
    client.set(roomObject.id, JSON.stringify(roomObject), redis.print);
    return roomObject.id;
}

module.exports = {
    Room: Room,
    getRoomInfoAsJson: getRoomInfoAsJson,
    getRoomInfoAsObject: getRoomInfoAsObject,
    saveRoom: saveRoom,
    STATE: STATE
}
