import uid from 'uid';


const STATE = {"stop":"STOPING", "play":"PLAYING", "pause":"PAUSING"}
Object.freeze(STATE)

class Room {
    constructor() {
        this.id = uid();
        this.state = STATE.stop
        this.round = 0;
        this.players = [];
        this.remainingTime = 0;
    }

    startRound() {
        this.round++
        this.remainingTime = 10;
        this.state = STATE.PLAYING
        setTimeout(function run() {
            this.remainingTime--;
            console.log(this.remainingTime);
            if(this.remainingTime > 0) {
                setTimeout(run, 1000);
            } else {
                this.state = STATE.pause
            }
        }, 1000);
    }

    addPlayer(newPlayer) {
        this.players.push(newPlayer);
    }
}
