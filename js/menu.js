
class Menu extends Phaser.Scene{
    constructor()
    {
        super({key: "Menu"});
    }

    init()
    {
        console.log("hello");
    }

    preload()
    {
    }

    create()
    {
        //title
        this.title = this.add.text(this.game.renderer.width / 2 ,this.game.renderer.height / 3.5,"TITLE", {font:"40px Impact"}).setOrigin(0.5);

        //play button
        this.addPlayBtn();

        //options button
        this.addOptionsBtn();

        //Mute button
        this.addSoundToggle();

        this.addButtonSelectCursor();

        this.sound.play("title_music", {
            loop: true,
            volume: "0.5"
        });
    }

    addButtonSelectCursor()
    {
        this.slimeSprite = this.add.sprite(100, 100, "slime_idle"); //Sprite to show the currently selected menu item
        this.slimeSprite.setScale(2);
        this.anims.create({
            key: "slime_idle_anim",
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames("slime_idle", {
                frames: [0,1,2,3,4,5]
            })
        });

        this.slimeSprite.play("slime_idle_anim");
        this.slimeSprite.setVisible(false);
    }

    addPlayBtn()
    {
        this.play_btn = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "menu_btn");
        this.play_btn.setScale(2);
        this.play_txt = this.add.text(this.play_btn.x, this.play_btn.y, "Play");
        this.play_txt.setScale(2);
        this.play_txt.setX(this.play_txt.x - this.play_txt.width);
        this.play_txt.setY(this.play_txt.y - this.play_txt.height);
        this.play_btn.setInteractive();

        this.play_btn.on('pointerover', () => {
            console.log("pointerover");
            this.slimeSprite.setPosition(this.play_btn.x - this.play_btn.width - this.slimeSprite.width, this.play_btn.y);
            this.slimeSprite.setVisible(true);
        });
        this.play_btn.on("pointerout", () => {
            this.slimeSprite.setVisible(false);
        });
        this.play_btn.on("pointerup", () => {
            this.scene.start("Game");
        });
    }

    addOptionsBtn()
    {
        this.options_btn = this.add.image(this.game.renderer.width / 2, (this.game.renderer.height / 2) + this.play_btn.height*2 + 10, "menu_btn");
        this.options_btn.setScale(2);
        this.options_txt = this.add.text(this.options_btn.x, this.options_btn.y, "Options");
        this.options_txt.setScale(2);
        this.options_txt.setX(this.options_txt.x - this.options_txt.width);
        this.options_txt.setY(this.options_txt.y - this.options_txt.height);
        this.options_btn.setInteractive();
        this.options_btn.on('pointerover', () => {
            console.log("pointerover");
            this.slimeSprite.setPosition(this.options_btn.x - this.options_btn.width - this.slimeSprite.width, this.options_btn.y);
            this.slimeSprite.setVisible(true);
        });
        this.options_btn.on("pointerout", () => {
            this.slimeSprite.setVisible(false);
        });
        this.options_btn.on("pointerup", () => {
            // this.scene.start("Options");
            this.openOptionsMenu();
        });
    }

    openOptionsMenu()
    {
        this.scene.run("Options");
        this.play_btn.setActive(false)
        this.options_btn.setActive(false);
    }

    closeOptionsMenu()
    {
        this.play_btn.setActive(true);
        this.options_btn.setActive(true);
    }

    addSoundToggle()
    {
        let soundScale = 0.5;

        this.sound_playing = this.add.image(0,0,"sound_playing");
        this.sound_playing.setScale(soundScale);
        this.sound_playing.setOrigin(0,1);
        this.sound_playing.setPosition(0, this.game.renderer.height);
        this.sound_playing.setInteractive();
        
        this.sound_mute = this.add.image(0,0,"sound_mute");
        this.sound_mute.setVisible(false);
        this.sound_mute.setScale(soundScale);
        this.sound_mute.setOrigin(0,1);
        this.sound_mute.setPosition(0, this.game.renderer.height);
        this.sound_mute.setInteractive();

        this.sound_playing.on("pointerup", () => {
            this.sound.mute = true;
            this.sound_playing.setVisible(false);
            this.sound_mute.setVisible(true);
        });
        
        this.sound_mute.on("pointerup", () => {
            this.sound.mute = false;
            this.sound_playing.setVisible(true);
            this.sound_mute.setVisible(false);
        });
    }

    updtate()
    {

    }
}