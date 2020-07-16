const Player = require("../models/player")
const roomModel = require("../models/Room")


class RoomController {
    static async getRoomData(req, res) {
        roomModel.getRoomInfoAsObject(req.params["roomId"])
            .then(result => {
                const {id, state, round, players, timer} = result
                result.nextState()
                roomModel.saveRoom(result)
                res.json({id, state, round, players, timer})
            })
    }

    static async getRoomQna(req, res) {
        roomModel.getRoomInfoAsObject(req.params['roomId'])
            .then(result => {
                res.json({qna: result.qna})
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
                const index = room.players.findIndex(player => player.playerName == nickname)
                if(index !== -1) {
                    res.status(400).send('Nickname already exists. Please choose another nickname!')
                }
                room.addPlayer(nickname)
                roomModel.saveRoom(room)
                res.json(room)
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
    }

    static submitAnswer(req, res) {
        let roomId = req.body.roomId;
        let nickname = req.body.nickname;
        let score = req.body.score;
        console.log(nickname)
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                let index = room.players.findIndex(player => player.playerName === nickname)
                if(index !== -1) {
                    room.players[index]['totalScore'] += score
                    room.players[index]['lastScore'] = score
                }
                roomModel.saveRoom(room)
                res.json(room)
            })
    }
}
module.exports = RoomController;
