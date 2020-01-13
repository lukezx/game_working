
class Load extends Phaser.Scene{
    constructor()
    {
        super({key: "Load"});
    }

    preload()
    {
        this.loadAssets();
        //loading bar 
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2 - 25, this.game.renderer.width * percent, 50);
        });
    }

    create()
    {
        this.scene.start("Menu");
    }

    update()
    {
        
    }

    loadAssets()
    {
        for (let i = 0; i < spritesheets.length; i++)
        {
            this.load.spritesheet(spritesheets[i].key, spritesheets[i].path, {frameHeight: spritesheets[i].h, frameWidth: spritesheets[i].w});
        }
        for (let i = 0; i < audio.length; i++)
        {
            this.load.audio(audio[i].key, audio[i].path);
        }
        for (let i = 0; i < images.length; i++)
        {
            this.load.image(images[i].key, images[i].path);
        }
        for (let i = 0; i < text.length; i++)
        {
            this.load.text(text[i].key, text[i].path);
        }
    }
}