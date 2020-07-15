const Player = require("../models/player")
const roomModel = require("../models/Room")


class RoomController {
    static getRoomData(req, res) {
        return roomModel.getRoomInfoAsObject(req.params["roomId"])
            .then(result => res.send(result))
    }

    static async createNewRoom(req, res) {
        let r = new roomModel.Room();
        r.addPlayer(req.body.nickname)
        roomModel.saveRoom(r);
        roomModel.getRoomInfoAsJson(r.id)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(404).send(error);
            })
    }

    static joinRoom(req, res) {
        // TODO: race conditionSTATE.GAME_WAITING
        const nickname = req.body.nickname
        const roomId = req.body.roomId
        roomModel.getRoomInfoAsJson(roomId)
            .then(result => {
                let r = roomModel.Room.deserializeRoom(result)
                if (r.state != roomModel.STATE.GAME_WAITING) return "";
                for (let p in r.players) {
                    if (p.name == nickname) {
                        return "";
                    }
                }
                r.addPlayer(nickname)
                roomModel.saveRoom(r);
                res.send(r);
            })
        
    }

    static startGame(req, res) {
        let roomId = req.body.roomId;
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                room.start()
                roomModel.saveRoom(room)
                res.send(room)
            })
    }

    static submitAnswer(req, res) {
        let roomId = req.body.roomId;
        let nickname = req.body.nickname;
        let r = roomModel.getRoomInfoAsObject(roomId);
        let score = new Date() - r.startedTime;
        for (let p in r.playes) {
            if (p.name == nickname) {
                p.updateScore(score);
                return
            }
        }
    }
}
module.exports = RoomController;
