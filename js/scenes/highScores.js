class HighScores extends Phaser.Scene
{
    constructor()
    {
        super({key: "HighScores"});
    }

    create()
    {
        this.backgroundW = this.game.renderer.width * 0.6;
        this.backgroundH = this.game.renderer.height * 0.9;
        let background = this.add.graphics({
            fillStyle: {
                color: 0x7f7f7f
            }
        })
        background.fillRect(this.game.renderer.width / 2 - this.backgroundW / 2, this.game.renderer.height / 2 - this.backgroundH / 2, this.backgroundW, this.backgroundH);

        let scoreList = settings.highScores;
        scoreList.sort((a,b)=>b-a);
        let top = 100
        let label = this.add.text(this.game.renderer.width / 2, top, "High Scores", {font: "40px Impact"}).setOrigin(0.5);
        for (let i = 0; i < 15; i++)
        {
            let score = 0;
            if (i < scoreList.length)
                score = scoreList[i]
            this.add.text(this.game.renderer.width / 2 - label.width / 2, top + 50 + (i * 20), `${i+1}. ${score}`, {font: "20px Impact"}).setOrigin(0);
        }
        this.makeBackButton();
    }

    
    makeBackButton()
    {
        this.backBtn = this.add.image(this.game.renderer.width / 2, this.game.renderer.height - 50, "menu_btn").setOrigin(0.5, 1);
        this.add.text(this.game.renderer.width / 2, this.backBtn.y - this.backBtn.height / 2, "Back", {font: "18px Impact"}).setOrigin(0.5);
        this.backBtn.setInteractive();
        this.backBtn.on("pointerup", () => {
            this.scene.stop(this);
        })
    }
}