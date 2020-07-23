class Player {
    constructor(name, totalScore=0, lastScore=0, lastPolled=Date.now(), answered=false) {
        this.name = name;
        this.totalScore = totalScore;
        this.lastScore = lastScore;
        this.lastPolled = lastPolled;
        this.answered = answered;
    }

    toJSON() {
        return {
            name:        this.name,
            totalScore:  this.totalScore,
            lastScore:   this.lastScore,
            lastPolled:  this.lastPolled,
            answered:    this.answered
        };
    }

    updateScore(newScore) {
        this.totalScore += newScore;
        this.lastScore = newScore;
        this.answered = true
    }

    updateLastPolled() {
        this.lastPolled = Date.now()
    }

    resetLastScore() {
        this.lastScore = 0
        this.answered = false
    }

    resetScore() {
        this.totalScore = 0;
        this.lastScore = 0;
        this.answered = false
    }

    static deserializePlayer(jsonPlayer) {
        let p = new Player(
            jsonPlayer.name,
            jsonPlayer.totalScore,
            jsonPlayer.lastScore,
            jsonPlayer.lastPolled,
            jsonPlayer.answered
        );
        return p;
    }
}

module.exports = Player;
