const Player = require("../models/player")
const roomModel = require("../models/Room")


class RoomController {
    static getRoomData(req, res) {
        let r = roomModel.getRoomInfoAsObject(req.params["roomId"]);
        r.nextState();
        roomModel.saveRoom(r);
        return roomModel.getRoomInfoAsJson(req.params["roomId"])
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
        let r = roomModel.Room.deserializeRoom(roomModel.getRoomInfoAsJson(roomId));
        if (r.state != STATE.GAME_WAITING) return "";
        for (let p in r.players) {
            if (p.name == nickname) {
                return "";
            }
        }
        r.players.push(new Player(nickname))
        roomModel.saveRoom(r, client);
        res.sen(r.players[r.length - 1].name);
    }

    static startGame(req, res) {
        let roomId = req.body.roomId;
        let r = roomModel.getRoomInfoAsObject(roomId);
        r.start();
        res.send(roomModel.saveRoom(r));
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
