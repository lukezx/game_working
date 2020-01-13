class GameInstanceVars
{
    constructor()
    {
        this.itemPool = settings.itemPool;
        this.playerSpeed = settings.basePlayerSpeed;
        this.soundToggle = new SoundToggle(this);
        this.score = 0; //Keeps track of the score
        this.iFrames = false; //Whether the player has IFrames or not
        this.timeDamageTaken = this.game.getTime(); //The game time when damage was last taken - used to turn off iFrames 
        this.lives = settings.maxLives; //The starting amount of lives
        this.shields = 0;
        this.wave = 1;
        this.enemySpeed = settings.enemySpeed;
        this.droppedHearts = 0; //keeps track of the amount of hearts in the world
    }
    
}