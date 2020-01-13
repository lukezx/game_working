class Pause extends Phaser.Scene
{
    constructor()
    {
        super({key: "Pause"});
    }

    create()
    {
        this.add.graphics({
            fillStyle: {
                color: 0x000000
            }
        }).fillRect(this.game.renderer.width / 2 - 100, this.game.renderer.height / 2 - 100, 200, 200);
        this.add.text(this.game.renderer.width / 2,this.game.renderer.height / 2 - 95, "Paused", {font: "50px Impact"}).setOrigin(0.5, 0);
        this.add.text(this.game.renderer.width / 2,this.game.renderer.height / 2 - 20, "[R]estart", {font: "30px Impact"}).setOrigin(0.5, 0);
        this.add.text(this.game.renderer.width / 2,this.game.renderer.height / 2 + 10, "[M]enu", {font: "30px Impact"}).setOrigin(0.5, 0); 

        this.input.keyboard.on("keydown", (event) => {
            if (event.key == "Escape")
            {
                console.log("Unpause");
                this.scene.stop()
                this.scene.resume("Game");
            }
            else if (event.key == "m")
            {
                this.sound.stopAll();
                this.scene.stop();
                this.scene.stop("Game");
                this.scene.launch("Menu");
            }
            else if (event.key == "r")
            {
                this.scene.stop();
                this.scene.launch("Game");
            }
        });
    }
}