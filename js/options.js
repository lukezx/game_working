
class Options extends Phaser.Scene{
    constructor()
    {
        super({key: "Options"});
    }


    preload()
    {
    }

    create()
    {
        //title
        this.title = this.add.text(this.game.renderer.width / 2 ,this.game.renderer.height / 3.5,"OPTIONS", {font:"40px Impact"}).setOrigin(0.5);

        //Mute button
        this.addSoundToggle();

        //volume slider
        let vol_txt = this.add.text(this.game.renderer.width / 2 - 100, this.title.y + 50, "Volume", {font:"20px Impact"});

        this.vol_slider = this.add.graphics({
            lineStyle: {
                lineWidth: 1,
                color: 0xffffff
            },
        }).strokeRect(vol_txt.x + vol_txt.width + 5, vol_txt.y + 5, 150, vol_txt.height - 10);

        this.vol_slider.setInteractive();
        this.vol_slider.on("pointerover", () => {
            console.log("vol hover");
        });
        this.vol_slider.on("pointerup", (event) => {
            console.log(event.x);
        });

        this.sound.play("title_music", {
            loop: true
        });       

    }

    addSoundToggle()
    {
        let soundScale = 0.5;

        let sound_playing = this.add.image(0,0,"sound_playing");
        sound_playing.setScale(soundScale);
        sound_playing.setOrigin(0,1);
        sound_playing.setPosition(0, this.game.renderer.height);
        sound_playing.setInteractive();
        
        this.sound_mute = this.add.image(0,0,"sound_mute");
        this.sound_mute.setVisible(false);
        this.sound_mute.setScale(soundScale);
        this.sound_mute.setOrigin(0,1);
        this.sound_mute.setPosition(0, this.game.renderer.height);
        this.sound_mute.setInteractive();

        sound_playing.on("pointerup", () => {
            this.sound.mute = true;
            sound_playing.setVisible(false);
            this.sound_mute.setVisible(true);
        });
        
        this.sound_mute.on("pointerup", () => {
            this.sound.mute = false;
            sound_playing.setVisible(true);
            this.sound_mute.setVisible(false);
        });
    }

    update()
    {


    }
}