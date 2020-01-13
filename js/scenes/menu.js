
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
        let backgroundImg = this.add.image(0,0, "menu_background").setOrigin(0).setDisplaySize(800,600);
        //title
        this.title = this.add.text(this.game.renderer.width / 2 ,this.game.renderer.height / 3,"Sticky Keys", {font: "40px Impact"}).setOrigin(0.5);

        //play button
        this.addPlayBtn();

        //options button
        this.addOptionsBtn();

        this.addHiScoreBtn()
        
        //Mute button
        this.addSoundToggle();

        this.addButtonSelectCursor();

        this.sound.play("title_music", {
            loop: true,
            volume: "0.3"
        });
    }

    positionBtnText(txt, btn)
    {
        btn.setScale(2);
        txt.setX(txt.x - txt.width / 2);
        txt.setY(txt.y - txt.height / 2);
        btn.setInteractive();
        btn.on('pointerover', () => {
            console.log("pointerover");
            this.slimeSprite.setPosition(btn.x - btn.width - this.slimeSprite.width, btn.y);
            this.slimeSprite.setVisible(true);
        });
        btn.on("pointerout", () => {
            this.slimeSprite.setVisible(false);
        });
    }

    addHiScoreBtn()
    {
        this.hiScore_btn = this.add.image(this.game.renderer.width / 2, (this.game.renderer.height / 2)  + 2*(this.play_btn.height*2 + 10), "menu_btn");
        this.hiScore_txt = this.add.text(this.hiScore_btn.x, this.hiScore_btn.y, "High Scores", {font: "25px Impact"});
        this.positionBtnText(this.hiScore_txt, this.hiScore_btn)

        this.hiScore_btn.on("pointerup", () => {
            this.scene.run("HighScores");
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
        this.play_txt = this.add.text(this.play_btn.x, this.play_btn.y, "Play", {font: "25px Impact"});
        this.positionBtnText(this.play_txt, this.play_btn);

        this.play_btn.on("pointerup", () => {
            this.scene.start("Game");
        });
    }

    addOptionsBtn()
    {
        this.options_btn = this.add.image(this.game.renderer.width / 2, (this.game.renderer.height / 2) + this.play_btn.height*2 + 10, "menu_btn");
        this.options_txt = this.add.text(this.options_btn.x, this.options_btn.y, "Options", {font: "25px Impact"});
        this.positionBtnText(this.options_txt, this.options_btn);
        
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
        let soundToggle = new SoundToggle(this);
        soundToggle.addSoundToggle();
    }

    updtate()
    {

    }
}