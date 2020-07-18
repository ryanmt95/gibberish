const assert = require('assert');
const Player = require("../../models/player")
const roomModel = require("../../models/room")

const player1 = new Player("Ryan", 1300, 705);
const player2 = new Player("Kerryn", 1690, 600);
const room1 = new roomModel.Room(123456789);
const jsonOfRoom1 = {
    roomId: 123456789,
    gameState: "GAME_WAITING",
    currentRound: 0,
    players: [],
}


describe('Test of player room', function () {
    describe('toJSON()', function () {
        it('should return the correct json of a room without any player', function () {
            assert.deepEqual(room1.toJSON(), jsonOfRoom1);
        });
    });
});
