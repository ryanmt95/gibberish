class Player {
    constructor(id, name, totalScore=0, lastScore=0) {
        this.id = id
        this.name = name;
        this.totalScore = totalScore;
        this.lastScore = lastScore
    }

    toJSON() {
        return {
            id:          this.id,
            name:        this.name,
            totalScore:  this.totalScore,
            lastScore:   this.lastScore
        };
    }

    updateScore(newScore) {
        this.totalScore += newScore;
        this.lastScore = newScore;
    }

    resetLastScore() {
        this.lastScore = 0
    }

    resetScore() {
        this.totalScore = 0;
        this.lastScore = 0;
    }

    static deserializePlayer(jsonPlayer) {
        let p = new Player(
            jsonPlayer.id,
            jsonPlayer.name,
            jsonPlayer.totalScore,
            jsonPlayer.lastScore
        );
        return p;
    }
}

module.exports = Player;
