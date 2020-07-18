class Player {
    constructor(name, totalScore=0, lastScore=0) {
        this.name = name;
        this.totalScore = totalScore;
        this.lastScore = lastScore;
    }

    toJSON() {
        return {
            playerName: this.name,
            totalScore:  this.totalScore,
            lastScore:   this.lastScore
        };
    }

    updateScore(newScore) {
        this.totalScore += newScore;
        this.lastScore = newScore;
    }

    resetScore() {
        this.totalScore = 0;
        this.lastScore = 0;
    }

    static deserializePlayer(jsonPlayer) {
        let p = new Player(
            jsonPlayer.playerName,
            jsonPlayer.totalScore,
            jsonPlayer.lastScore
        );
        return p;
    }
}

module.exports = Player;
