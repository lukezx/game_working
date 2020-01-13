
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
        // let backgroundImg = this.add.image(0,0, "menu_background").setOrigin(0);

        this.backgroundW = this.game.renderer.width * 0.6;
        this.backgroundH = this.game.renderer.height * 0.9;
        let background = this.add.graphics({
            fillStyle: {
                color: 0x7f7f7f
            }
        })
        background.fillRect(this.game.renderer.width / 2 - this.backgroundW / 2, this.game.renderer.height / 2 - this.backgroundH / 2, this.backgroundW, this.backgroundH);

        //title
        this.title = this.add.text(this.game.renderer.width / 2 ,this.game.renderer.height / 3.5,"OPTIONS", {font:"40px Impact"}).setOrigin(0.5);

        //Mute button
        // this.addSoundToggle();

        this.makeVolumeControl();
        this.makeDifficultyControl();
        this.makeBackButton();
    }

    makeVolumeControl()
    {
        let vol_txt = this.add.text(this.game.renderer.width / 2 - this.backgroundW/2 + 10, this.title.y + 50, "Volume", {font:"20px Impact"});
        this.vol_slider = this.add.image(this.game.renderer.width / 2, vol_txt.y, "volume_slider").setOrigin(0.5, 0);
        this.vol_slider_fill = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            },
        });
        this.vol_slider.setInteractive();
        this.vol_slider_fill.fillRect(this.vol_slider.x - this.vol_slider.width / 2, this.vol_slider.y, 3 * settings.vol, this.vol_slider.height-2);

        this.vol_slider.on("pointerup", (event) => {
            this.vol_slider_fill.clear();
            let leftX = this.vol_slider.x - this.vol_slider.width / 2;
            let rightX = this.vol_slider.x + this.vol_slider.width / 2;
            settings.vol =  this.map(event.x, leftX, rightX, 0, 100);
            this.vol_slider_fill.fillRect(leftX, this.vol_slider.y, 3*settings.vol, this.vol_slider.height-2);
            this.sound.volume = settings.vol / 100;
            console.log(this.sound.volume);
        });      

    }

    makeDifficultyControl()
    {
        let difficultyLbl = this.add.text(this.game.renderer.width / 2 - this.backgroundW/2 + 10, this.title.y + 80, "Difficulty", {font:"20px Impact"});

        this.difficultyDown = this.add.image(difficultyLbl.x + difficultyLbl.width + 5, difficultyLbl.y, "menu_btn").setOrigin(0).setScale(0.4, 1);
        this.add.text(this.difficultyDown.x + this.difficultyDown.width*0.4/2, this.difficultyDown.y+this.difficultyDown.height/2, "-", {font:"20px Impact"}).setOrigin(0.5);

        this.difficultyTxt = this.add.text(this.game.renderer.width / 2, this.difficultyDown.y, `${settings.difficulty}`, {font:"25px Impact"}).setOrigin(0.5, 0);

        this.difficultyUp = this.add.image(this.vol_slider.x + this.vol_slider.width / 2, difficultyLbl.y, "menu_btn").setOrigin(1, 0).setScale(0.4, 1);
        this.add.text(this.difficultyUp.x - this.difficultyUp.width * 0.4  + this.difficultyUp.width*0.4/2, this.difficultyUp.y+this.difficultyUp.height/2, "+", {font:"20px Impact"}).setOrigin(0.5);
        this.addDifficultyControlListeners();
    }

    addDifficultyControlListeners()
    {
        this.difficultyDown.setInteractive();
        this.difficultyUp.setInteractive();

        this.difficultyDown.on("pointerup", () => {
            if (settings.difficulty > settings.minDifficulty)
            {
                settings.difficulty --;
                this.difficultyTxt.setText(`${settings.difficulty}`);
            }
        });
        this.difficultyUp.on("pointerup", () => {
            if (settings.difficulty < settings.maxDifficulty)
            {
                settings.difficulty ++;
                this.difficultyTxt.setText(`${settings.difficulty}`);
            }
        });
    }

    makeBackButton()
    {
        this.backBtn = this.add.image(this.game.renderer.width / 2, this.game.renderer.height - 50, "menu_btn").setOrigin(0.5, 1);
        this.add.text(this.game.renderer.width / 2, this.backBtn.y - this.backBtn.height / 2, "Back", {font: "18px Impact"}).setOrigin(0.5);
        this.backBtn.setInteractive();
        this.backBtn.on("pointerup", () => {
            this.scene.stop(this);
        });
    }
    
    //Map value from between startRangeLower and startRangeHigher to a value between targetRangeLower and targetRangeHigher
    map(value, startRangeLower, startRangeHigher, targetRangeLower, targetRangeHigher)
    {
        let startSpan = startRangeHigher - startRangeLower;
        let targetSpan = targetRangeHigher - targetRangeLower;
        return (((value - startRangeLower) / startSpan) * targetSpan) + targetRangeLower;
    }

    update()
    {
    }
}