class Player {
    constructor(name, totalScore=0, lastScore=0, lastPolled=Date.now()) {
        this.name = name;
        this.totalScore = totalScore;
        this.lastScore = lastScore;
        this.lastPolled = lastPolled
    }

    toJSON() {
        return {
            name:  this.name,
            totalScore:  this.totalScore,
            lastScore:   this.lastScore,
            lastPolled:  this.lastPolled
        };
    }

    updateScore(newScore) {
        this.totalScore += newScore;
        this.lastScore = newScore;
    }

    updateLastPolled() {
        this.lastPolled = Date.now()
    }

    resetScore() {
        this.totalScore = 0;
        this.lastScore = 0;
    }

    static deserializePlayer(jsonPlayer) {
        let p = new Player(
            jsonPlayer.name,
            jsonPlayer.totalScore,
            jsonPlayer.lastScore,
            jsonPlayer.lastPolled
        );
        return p;
    }
}

module.exports = Player;
