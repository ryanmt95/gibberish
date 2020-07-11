class player {
    constructor(name) {
        this.name = name;
        this.totalScore = 0;
        this.lastScore = 0;
    }

    updateScore(newScore) {
        this.totalScore += newScore;
        this.lastScore = newScore;
    }
}
