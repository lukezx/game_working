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
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, "Game Over!", {font: "40px Impact"}).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, "[r]estart", {font: "25px Impact"}).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "[m]enu", {font: "25px Impact"}).setOrigin(0.5);

        this.input.keyboard.on("keydown_R", event => {
            this.scene.start("Game");
        });
        this.input.keyboard.on("keydown_M", event => {
            this.sound.stopAll();
            this.scene.stop("Game");
            this.scene.start("Menu");
        });
    }
}