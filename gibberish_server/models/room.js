import uid from 'uid';


class Room {
    constructor() {
        this.id = uid();
        this.round = 0;
        this.players = [];
        this.remainingTime = 0;
    }

    startRound() {
        this.round++
        this.remainingTime = 10;
        setTimeout(function run() {
            this.remainingTime--;
            console.log(this.remainingTime);
            if(this.remainingTime > 0) {
                setTimeout(run, 1000);
            }
        }, 1000);
    }

    addPlayer(newPlayer) {
        this.players.push(newPlayer);
    }
}
