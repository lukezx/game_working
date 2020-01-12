class Game_Over extends Phaser.Scene
{
    constructor()
    {
        super({key: "Game_Over"});
    }

    preload()
    {

    }

    create()
    {
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, "Game Over!", {font: "30px Impact"}).setOrigin(0.5);
    }
}