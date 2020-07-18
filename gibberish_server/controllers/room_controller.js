const Player = require("../models/player")
const roomModel = require("../models/room")


class RoomController {
    static async getRoomData(req, res) {
        roomModel.getRoomInfoAsObject(req.params["roomId"])
            .then(result => {
                const nickname = req.params["playerId"]
                result.updatePlayers(nickname)
                result.nextState()
                roomModel.saveRoom(result)
                const {id, state, round, players, timer} = result
                res.json({id, state, round, players, timer})
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static async getRoomQna(req, res) {
        roomModel.getRoomInfoAsObject(req.params['roomId'])
            .then(result => {
                res.json({qna: result.qna})
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static async createNewRoom(req, res) {
        let r = new roomModel.Room();
        roomModel.saveRoom(r);
        roomModel.getRoomInfoAsJson(r.id)
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                res.status(404).send(error);
            })
    }

    static joinRoom(req, res) {
        // TODO: race conditionSTATE.GAME_WAITING
        const nickname = req.body.nickname
        const roomId = req.body.roomId
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                if(room.state != roomModel.STATE.GAME_WAITING) res.status(400).send('Game has started')
                const index = room.players.findIndex(player => player.name == nickname)
                if(index !== -1) {
                    res.status(400).send('Nickname already exists. Please choose another nickname!')
                }
                room.addPlayer(nickname)
                roomModel.saveRoom(room)
                res.json(room)
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static startGame(req, res) {
        let roomId = req.body.roomId;
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                room.start()
                roomModel.saveRoom(room)
                res.json(room)
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static submitAnswer(req, res) {
        let roomId = req.body.roomId;
        let nickname = req.body.nickname;
        let score = req.body.score;
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                let index = room.players.findIndex(player => player.name === nickname)
                if(index !== -1) {
                    room.players[index].updateScore(score)
                }
                roomModel.saveRoom(room)
                const {id, state, round, players, timer} = room
                res.json({id, state, round, players, timer})
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static restartGame(req, res) {
        let roomId = req.body.roomId;
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                room.restart()
                roomModel.saveRoom(room)
                res.json(room)
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }
}
module.exports = RoomController;
