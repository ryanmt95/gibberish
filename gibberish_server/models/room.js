const uid = require("uid");
const Player = require("../models/player")


const STATE = {
    "GAME_WAITING":"GAME_WAITING",
    "ROUND_LOADING":"ROUND_LOADING",
    "ROUND_ONGOING":"ROUND_ONGOING",
    "ROUND_ENDED":"ROUND_ENDED",
    "GAME_ENDED":"GAME_ENDED"
}
Object.freeze(STATE);
const ROUND_NUMBER = 10;
Object.freeze(ROUND_NUMBER);

class Room {
    constructor(id=uid(), state=STATE.GAME_WAITING, round=0, players=[]) {
        this.id = id;
        this.state = state;
        this.round = round;
        this.players = players;
        this.startedTime = null;
    }

    toJSON() {
        let players = []
        for (let player of this.players) {
            players.push(JSON.stringify(player));
        }
        return {
            roomId:        this.id,
            gameState:     this.state,
            currentRound:  this.round,
            players:       players,
        };
    }

    nextState() {
        let now = new Date();
        switch(this.state) {
            case STATE.GAME_WAITING:
                this.state = STATE.ROUND_LOADING;
                this.startedTime = now;
                break;
            case STATE.ROUND_LOADING:
                if (now - this.startedTime >= 3000) {
                    this.state = STATE.ROUND_ONGOING;
                    this.startedTime = now;
                }
                break;
            case STATE.ROUND_ONGOING:
                if (now - this.startedTime >= 10000) {
                    this.state = STATE.ROUND_ENDED;
                    this.startedTime = now;
                }
                break;
            case STATE.ROUND_ENDED:
                if (now - this.startedTime >= 5000) {
                    if (this.round < ROUND_NUMBER) {
                        this.state = STATE.ROUND_LOADING;
                        this.startedTime = now;
                    } else {
                        this.state = STATE.GAME_ENDED;
                    }
                }
                break;
            case STATE.GAME_ENDED:
                break;
        }
    }

    addPlayer(newPlayer) {
        this.players.push(newPlayer);
    }
}

function newRoom() {
    let r = new Room();
    return saveRoom(r);
}

function getRoomInfoAsJson(roomId) {
    client.get(roomId, function (error, result) {
        if (error) {
            console.error(error);
            return {};
        }
        console.log('GET result ->' + result);
        return JSON.parse(result);
    }
}

function updateState(roomId) {
    let r = deserializeRoom(getRoomInfoAsJson(roomId));
    r.nextState();
    return saveRoom(r);
}

function saveRoom(roomObject) {
    client.set(roomObject.id, JSON.stringify(roomObject), redis.print);
    return roomObject.id;
}

function deserializeRoom(jsonRoom) {
    let players = [];
    for (let player of jsonRoom.players) {
        players.push(Player.deserializePlayer(JSON.parse(player)));
    }
    let r = new Room(
        id=jsonRoom.roomId,
        state=jsonRoom.gameState,
        round=jsonRoom.currentRound,
        players=players
    );
    return r;
}

module.exports = {
    newRoom: newRoom,
    getRoomInfoAsJson: getRoomInfoAsJson,
    updateState: updateState
}
