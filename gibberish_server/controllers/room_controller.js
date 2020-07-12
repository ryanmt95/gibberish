const Player = require("../models/player")
const roomModel = require("../models/Room")


class RoomController {
    static getRoomData(req, res) {
        let r = roomModel.getRoomInfoAsObject(req.params["roomId"]);
        r.nextState();
        roomModel.saveRoom(r);
        return roomModel.getRoomInfoAsJson(req.params["roomId"])
    }

    static createNewRoom(req, res) {
        let r = new roomModel.Room();
        roomModel.saveRoom(r);
        res.send(roomModel.getRoomInfoAsJson(r.id));
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
        res.sen(r.players[r.length-1].name);
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
