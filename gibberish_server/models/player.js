class Player {
    constructor(name) {
        this.name = name;
        this.totalScore = 0;
        this.lastScore = 0;
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
}

module.exports = Player;
