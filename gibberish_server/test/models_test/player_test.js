const assert = require('assert');
const Player = require("../../models/player")

const player1 = new Player("Ryan");
const player2 = new Player("Ryan", 1300, 705);
const jsonOfPlayer2 = {
    playerName: "Ryan",
    totalScore: "1300",
    lastScore: 705
};


describe('Test of player model', function () {
    describe('toJSON()', function () {
        it('should return the correct json of a player', function () {
            assert.deepEqual(player2.toJSON(), jsonOfPlayer2);
        });
    });

    describe('updateScore(newScore)', function () {
        it('should return the correct score value', function () {
            player1.updateScore(595)
            player1.updateScore(705)
            assert.deepEqual(player1, player2);
        });
    });
});
