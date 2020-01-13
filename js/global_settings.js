class Global_Settings 
{
    constructor()
    {
        this.mute = false;
        this.vol = 100;
        this.difficulty = 5;
        this.maxDifficulty = 8;
        this.minDifficulty = 3;
        this.maxLives = 4;
        this.maxEnemiesOnScreen = 10;
        this.enemySpeed = 30;
        this.maxEnemySpeed = 45;
        this.maxHeartsOnScreen = 2;
        this.highScores = [];
        this.itemPool = ["shield", "speed_boots", "speed_pot", "violin"];
        this.basePlayerSpeed = 65;
    }
}