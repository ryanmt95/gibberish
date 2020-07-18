// const assert = require('assert');
const Player = require("../../models/player")
const roomModel = require("../../models/room")
const chai = require('chai')

const { assert } = require('chai')

const player1 = new Player("Ryan", 0, 0);
const player2 = new Player("Kerryn", 0, 0);
const room1 = new roomModel.Room(123456789);
const jsonOfRoom1 = {
    roomId: 123456789,
    gameState: "GAME_WAITING",
    currentRound: 0,
    players: [],
    startedTime: null
}
const num_rounds = 10


describe('Test of player room', function () {
    describe('toJSON()', function () {
        it('should return the correct json of a room without any player', function () {

            var room1_json = room1.toJSON()
            assert.propertyVal(room1_json, 'roomId', jsonOfRoom1['roomId'])
            assert.propertyVal(room1_json, 'gameState', jsonOfRoom1['gameState'])
            assert.propertyVal(room1_json, 'currentRound', jsonOfRoom1['currentRound'])
            assert.deepPropertyVal(room1_json, 'players', jsonOfRoom1['players'])
            assert.propertyVal(room1_json, 'startedTime', jsonOfRoom1['startedTime'])
            assert.lengthOf(room1.qna, num_rounds)

        });
    });

    describe('start()', function () {
        it('room state should be changed correctly', function () {

            room1.start()
            var room1_json = room1.toJSON()
            assert.propertyVal(room1_json, 'gameState', 'ROUND_LOADING')
            assert.isNotNull(room1_json['startedTime'])
        })
    })

    describe('nextState()', function () {
        it('ensure next state function executes correctly based on time', function () {

            // initially room1's game state = ROUND_LOADING
            // state should not be allowed to change unless 3secs have passed
            room1.nextState()
            assert.propertyVal(room1.toJSON(), 'gameState', 'ROUND_LOADING')
            // after 3 seconds next state will allow state to be changed
            delay(function () {
                room1.nextState()
                assert.propertyVal(room1.toJSON(), 'gameState', 'ROUND_ONGOING')
            }, 3000).delay(function () {
                room1.nextState()
                assert.propertyVal(room1.toJSON(), 'gameState', 'ROUND_ENDED')

                console.log('nextState() test has ended')
            }, 10000);

        })
    })

    describe('addPlayer()', function () {
        it('should add players to the gamestate', function () {
            room1.addPlayer(player1['name'])
            room1.addPlayer(player2['name'])
            assert.deepPropertyVal(room1.toJSON(), 'players', [player1, player2])
        })
    })
});


function delay(fn, t) {
    // private instance variables
    var queue = [], self, timer;

    function schedule(fn, t) {
        timer = setTimeout(function () {
            timer = null;
            fn();
            if (queue.length) {
                var item = queue.shift();
                schedule(item.fn, item.t);
            }
        }, t);
    }
    self = {
        delay: function (fn, t) {
            // if already queuing things or running a timer, 
            //   then just add to the queue
            if (queue.length || timer) {
                queue.push({ fn: fn, t: t });
            } else {
                // no queue or timer yet, so schedule the timer
                schedule(fn, t);
            }
            return self;
        },
        cancel: function () {
            clearTimeout(timer);
            queue = [];
            return self;
        }
    };
    return self.delay(fn, t);
}
