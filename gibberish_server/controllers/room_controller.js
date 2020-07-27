const roomModel = require("../models/room")


class RoomController {
    static async getRoomData(req, res) {
        roomModel.getRoomInfoAsObject(req.params["roomId"])
            .then(result => {
                const nickname = req.params["playerId"]
                const {id, state, round, players, timer} = result
                result.updatePlayers(nickname)
                result.nextState()
                roomModel.saveRoom(result)
                res.json({id, state, round, players, timer})
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static async getRoomQna(req, res) {
        roomModel.getRoomInfoAsObject(req.params['roomId'])
            .then(result => {
                res.json({ qna: result.qna })
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }

    static async createNewRoom() {
        let r = new roomModel.Room();
        roomModel.saveRoom(r);
        return roomModel.getRoomInfoAsObject(r.id)
    }

    static async joinRoom(playerId, nickname, roomId) {
        return roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                if(room.state != roomModel.STATE.GAME_WAITING) {
                    return ['err', 'Game has started']
                }
                const index = room.players.findIndex(player => player.name == nickname)
                if(index !== -1) {
                    return ['err', 'Nickname exists']
                }
                room.addPlayer(playerId, nickname)
                roomModel.saveRoom(room)
                return ['updateRoom', room]
            })
            .catch(error => {
                return ['err', error]
            })
    }

    static startGame(io, roomId) {
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                room.start()
                roomModel.saveRoom(room)
                io.to(room['id']).emit('updateRoom', room)
            })
            .catch(err => console.log(err))
    }

    static submitAnswer(io, roomId, playerId) {
        roomModel.getRoomInfoAsObject(roomId)
            .then(room => {
                const index = room['players'].findIndex(player => player.id === playerId)
                if(index !== -1) {
                    const score = room['timer']
                    room['players'][index].updateScore(score)
                    roomModel.saveRoom(room)
                    io.to(room['id']).emit('updateRoom', room)
                }
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

    static playerLeave(io, playerId) {
        roomModel.getAllRoomId().then(ids => {
            console.log(ids)
            for(let id of ids) {
                roomModel.getRoomInfoAsObject(id).then(room => {
                    const index = room.containsPlayer(playerId)
                    if(index !== -1) {
                        room.removePlayer(index, playerId)
                        roomModel.saveRoom(room)
                        if(room.isEmpty()) {
                            roomModel.deleteRoom(id)
                        }
                        io.to(room['id']).emit('updateRoom', room)
                    }
                })
            }
        })
    }

    static timerTick(io) {
        roomModel.getAllRoomId().then(ids => {
            for(let id of ids) {
                roomModel.getRoomInfoAsObject(id).then(room => {
                    if(room['timer'] > 0) {
                        room.tick()
                    } else {
                        room.nextState()
                    }
                    roomModel.saveRoom(room)
                    io.to(room['id']).emit('updateRoom', room)
                })
            }
        })
    }
}
module.exports = RoomController;
