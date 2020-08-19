const crypto = require('crypto');
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
const ROUND_NUMBER = 5;
Object.freeze(ROUND_NUMBER);

const ROUND_LOADING_TIMER = 3
const ROUND_ONGOING_TIMER = 25
const ROUND_ENDED_TIMER = 5

class Room {
    constructor(id = uid(), state = STATE.GAME_WAITING, round = 0, players = [], theme = this.initialiseTheme(), qna = this.generateQuestions(0), oldQna = new Set(), timer = 0, gameNumber = 0) {
        this.id = id;
        this.state = state;
        this.round = round;
        this.players = players;
        this.theme = theme;
        this.qna = qna;
        this.oldQna = oldQna;
        this.timer = timer;
        this.gameNumber = gameNumber;
    }

    initialiseTheme() {
        return questions[0]['theme'];
    }

    generateQuestions(gameNum) {
        let qna = new Set();
        const numOfThemes = questions.length;
        const themeQuestions = questions[gameNum%numOfThemes];
        const theme = themeQuestions['theme'];
        this.theme = theme;
        const questionList = themeQuestions['questionList'];
        while (qna.size < ROUND_NUMBER) {
            const r = Math.floor(Math.random() * questionList.length);
            let randomQuestion = questionList[r];
            const cleanedAns = randomQuestion.answer.toLowerCase().trim();
            const hashedAns = crypto.createHash('md5').update(cleanedAns).digest('hex');
            randomQuestion.answer = hashedAns;
            if (!this.oldQna || (this.oldQna && !this.oldQna.has(randomQuestion))) {
                qna.add(randomQuestion);
            }
        }
        return Array.from(qna)
    }

    toJSON() {
        return {
            roomId: this.id,
            gameState: this.state,
            currentRound: this.round,
            players: this.players,
            qna: this.qna,
            oldQna: Array.from(this.oldQna),
            timer: this.timer,
            theme: this.theme,
            gameNumber: this.gameNumber
        };
    }

    start() {
        if (this.state == STATE.GAME_WAITING) {
            this.state = STATE.ROUND_LOADING;
            this.timer = 3
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

    tick() {
        this.timer--;
    }

    nextState() {
        switch (this.state) {
            case STATE.ROUND_LOADING:
                this.state = STATE.ROUND_ONGOING;
                this.timer = ROUND_ONGOING_TIMER;
                break;
            case STATE.ROUND_ONGOING:
                this.state = STATE.ROUND_ENDED;
                this.timer = ROUND_ENDED_TIMER
                break;
            case STATE.ROUND_ENDED:
                if (this.round < ROUND_NUMBER) {
                    // reset lastScores
                    for(var i = 0; i < this.players.length; i++) {
                        this.players[i].resetLastScore()
                    }
                    this.state = STATE.ROUND_LOADING;
                    this.timer = ROUND_LOADING_TIMER
                    this.round++
                } else {
                    this.state = STATE.GAME_ENDED;
                }
                break;
        }
    }

    restart() {
        this.state = STATE.GAME_WAITING;
        this.round = 0;
        this.startedTime = null;
        this.gameNumber += 1;
    
        for (let qnaObj of this.qna) {
            this.oldQna.add(qnaObj);
        }
        this.qna = this.generateQuestions(this.gameNumber);
        
        this.timer = Math.floor((new Date() - new Date(this.startedTime))/1000);

        let players = [];
        for (let player of this.players) {
            player.resetScore();
            players.push(player);
        }
        this.players = players;
    }

    addPlayer(playerId, nickname) {
        const player = new Player(playerId, nickname)
        this.players.push(player);
    }

    containsPlayer(playerId) {
        return this.players.findIndex(player => player.id === playerId)
    }

    removePlayer(index, playerId) {
        if(this.players[index]['id'] === playerId) {
            this.players.splice(index, 1)
        }
    }

    isEmpty() {
        return this.players.length === 0
    }

    hasAllAnswered() {
        var allAnswered = true
        for(let player of this.players) {
            if(player['lastScore'] === 0) {
                allAnswered = false
            }
        }
        return allAnswered
    }

    static deserializeRoom(jsonRoom) {
        let players = [];
        for (let player of jsonRoom.players) {
            const p = Player.deserializePlayer(player)
            players.push(p); // convert to player
        }
        let oldQna = new Set();
        for (const oldQnaObj of jsonRoom.oldQna) {
            oldQna.add(oldQnaObj);
        }
        let r = new Room(jsonRoom.roomId, jsonRoom.gameState, jsonRoom.currentRound, players, jsonRoom.theme, jsonRoom.qna, oldQna, jsonRoom.timer, jsonRoom.gameNumber);
        return r;
    }
}

function getAllRoomId() {
    return new Promise((res, rej) => {
        client.keys('*', function (error, result) {
            if (error) {
                console.error(error);
                rej({});
            } else {
                // console.log('GET result ->' + result);
                res(result);
            }
        })
    })
}

function deleteRoom(roomId) {
    return new Promise((res, rej) => {
        client.del(roomId, (err, res) => {
            if(err) {
                console.error(error)
            } else {
                console.log(roomId + ' deleted')
            }
        })
    })
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
    client.set(roomObject.id, JSON.stringify(roomObject));
    return roomObject.id;
}

function clearDB() {
    return new Promise((res, rej) => {
        client.flushall()
    })
}

module.exports = {
    Room: Room,
    getAllRoomId: getAllRoomId,
    getRoomInfoAsJson: getRoomInfoAsJson,
    getRoomInfoAsObject: getRoomInfoAsObject,
    saveRoom: saveRoom,
    deleteRoom: deleteRoom,
    clearDB: clearDB,
    STATE: STATE
}
