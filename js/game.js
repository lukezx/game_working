class Game extends Phaser.Scene{
    constructor()
    {
        super({key: "Game"});
    }
    
    preload()
    {
        
    }

    create()
    {
        this.add.image(400,400,"heart_drop").setScale(2).setDepth(100);

        this.score = 0;
        this.iFrames = false;
        this.timeDamageTaken = this.game.getTime();
        this.lives = settings.maxLives;
        this.scoreTxt = this.add.text(this.game.renderer.width - 10, 10, `Score: ${this.score}`).setOrigin(1,0);

        this.floor = this.add.image(0, this.game.renderer.height, "floor");
        this.floor.setOrigin(0, 1);

        this.display_typing = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - this.floor.height - 10, "", {font: "40px Impact"}).setOrigin(0.5, 1);

        let cache = this.cache.text;
        let words = cache.get('dict');
        this.word_arr = words.split('\n');
        console.log(this.word_arr.length);

        this.used_words = [];
        this.currentWord = '';

        //Make Player
        this.player = this.physics.add.sprite(20, this.game.renderer.height / 2, "slime_run");
        this.player.setScale(2);
        this.player.setCollideWorldBounds();

        //anims
        this.anims.create({
            key: "player_anim",
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames("slime_run", {
                frames: [0,1,2,3,4,5]
            })
        });
        this.anims.create({
            key: "goblin_anim",
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames("goblin_run", {
                frames: [0,1,2,3,4,5]
            })
        });
        this.anims.create({
            key: "bat_anim",
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames("fly_idle", {
                frames: [0,1,2,3,4,5]
            })
        });


        this.player.play("player_anim");
        this.physics.world.enableBody(this.player);

        this.goblins = this.physics.add.group();
        for (let i = 0; i < 5; i++)
        {
            this.goblins.add(this.makeGoblin());
        }
        // for (let i = 0; i < 3; i++)
        // {
        //     this.enemies.add(this.makeBat());
        // }

        this.makeHealthBar();

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyboard = this.input.keyboard.addKeys("A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Backspace");

        this.input.keyboard.on("keydown", event => this.keyTyped(event));
        
    }

    makeHealthBar()
    {
       this.healthBarGUI = this.add.image(10, 10, "health_bar").setOrigin(0,0).setScale(2).setDepth(100);
       this.healthBar = this.add.graphics({
           fillStyle: {
               color: "0xff0000"
           }
       }).fillRect(this.healthBarGUI.x + 25, this.healthBarGUI.y + 5, 130, 17); //4 = 130, 3 = 100, 2 = 70, 1 = 30
    }

    keyTyped(event)
    {
        //list of keys that need to be ignored
        let keysToIgnore = ["Shift", "Control", "Alt", "AltGraph", "Unidentified", "Escape", "OS"];
        if (event.keyCode > 36 && event.keyCode < 41) //ignore arrow keys
            return;
        if (keysToIgnore.findIndex((key, i) => key == event.key) != -1) 
            return;
        console.log(event);
        let key = event.key;
        if (key == "Backspace" && this.currentWord.length > 0)
        {
            this.currentWord = this.currentWord.slice(0, -1);
        }
        else if (key == "Enter")
        {
            this.currentWord = "";
            this.display_typing.text = this.currentWord;
        }
        else if (key != "Backspace")
        {
            this.currentWord += key;
        }
        this.display_typing.text = this.currentWord;
        this.checkWordHasBeenTyped();
    }

    checkWordHasBeenTyped()
    {
        if (this.used_words.indexOf(this.currentWord) != -1) //word has been typed
        {
            this.enemyKilled(this.currentWord);
        }
    }

    enemyKilled(enemyWord)
    {
        console.log("killed");
        //Clear the typed word
        this.currentWord = ""; 
        this.display_typing.text = this.currentWord;

        //Play a sound

        //remove enemy
        let enemyArr = this.goblins.getChildren();
        for (let i = 0; i < enemyArr.length; i++) {
            if (enemyArr[i].list[0].word == enemyWord)
            {
                enemyArr[i].destroy();
            }
        }

        //increase the score and update the display
        this.addToScore(100);

    }

    addToScore(amount)
    {
        this.score += amount;
        this.scoreTxt.setText(`Score: ${this.score}`);
    }

    makeGoblin()
    {
        let word = this.selectWord();
        let goblin = new Enemy(this, 0, 0, "goblin_run", 0, word);//this.add.sprite(0,0,"goblin_idle").setScale(2);
        goblin.play("goblin_anim");
        this.used_words.push(word);
        let enemy_txt = this.add.text(0, -15, word, {font: "15px Impact", backgroundColor: "0x000000"}).setOrigin(0.5);

        let x = Math.floor(Math.random() * this.game.renderer.width);
        let y = Math.floor(Math.random() * this.game.renderer.height);

        this.enemy = this.add.container(x,y, [goblin, enemy_txt]);

        this.enemy.setSize(20,25);
        this.physics.world.enableBody(this.enemy);

        this.physics.world.addCollider(this.player, this.enemy, (player, enemy) => {
            this.takeDamage();
        });
        for(let i = 0; i < this.goblins.getChildren().length; i++)
        {
            this.physics.world.addCollider(this.goblins.getChildren()[i], this.enemy, (player, enemy) => {
                console.log("Collision!!!");
            });
        }
        return this.enemy;
    }

    makeBat()
    {
        let word = this.selectWord();
        let goblin = new Enemy(this, 0, 0, "fly_idle", 0, word).setScale(3);//this.add.sprite(0,0,"goblin_idle").setScale(2);
        this.used_words.push(word);
        let enemy_txt = this.add.text(0,-15,word).setOrigin(0.5);

        let x = Math.floor(Math.random() * this.game.renderer.width);
        let y = Math.floor(Math.random() * this.game.renderer.height);

        this.enemy = this.add.container(x,y, [goblin, enemy_txt]);

        this.enemy.setSize(20,25);
        this.physics.world.enableBody(this.enemy);

        this.physics.world.addCollider(this.player, this.enemy, (player, enemy) => {
            console.log("Collision!!!");
        });
        return this.enemy;
    }

    selectWord()
    {
        let wordLen = settings.difficulty;
        let word = this.word_arr[Math.floor(Math.random() * this.word_arr.length)];
        word = word.slice(0,-1);
        if (this.used_words.indexOf(word) != -1 || word.length > wordLen)    
            word = this.selectWord();
        return word;
    }

    takeDamage()
    {
        if (!this.iFrames)
        {
            this.iFrames = true
            this.lives --;
            if (this.lives == 0)
                this.gameOver();
            let barWidth = this.lives * 30 + 10;
            this.healthBar.clear().fillRect(this.healthBarGUI.x + 25, this.healthBarGUI.y + 5, barWidth, 17);
            this.timeDamageTaken = this.game.getTime();
        }
    }

    gameOver()
    {
        console.log("Game Over");
        this.scene.pause();
        this.scene.launch("Game_Over");
    }

    update(time, delta)
    {
        //Turn off iFrames once two seconds has passed since damage was taken
        if (time - 2000 > this.timeDamageTaken)
            this.iFrames = false; 

        //Make enemies move towards player
        for (let i = 0; i < this.goblins.getChildren().length; i++) {
            this.physics.moveToObject(this.goblins.getChildren()[i], this.player, 30);
            if (this.goblins.getChildren()[i].body.x > this.player.x){
                this.goblins.getChildren()[i].list[0].setFlipX(true);
            }
            else {
                this.goblins.getChildren()[i].list[0].setFlipX(false);
            }
        }
        

        let right = this.cursorKeys.right.isDown;
        let left = this.cursorKeys.left.isDown;
        let up = this.cursorKeys.up.isDown
        let down = this.cursorKeys.down.isDown
        if (right)
        {
            this.player.setVelocityX(64);
            this.player.setFlipX(false);
        }
        if (left)
        {
            this.player.setVelocityX(-64);
            this.player.setFlipX(true);
        }
        if (up)
        {
            if (this.player.y > this.game.renderer.height - this.floor.height)
            {
                this.player.setVelocityY(-64);
            }
            else 
            {
                this.player.setVelocityY(0);
            }
        }
        if (down)
        {
            this.player.setVelocityY(64);
        }
        if (!left && !right)
        {
            this.player.setVelocityX(0);
        }
        if (!up && !down)
        {
            this.player.setVelocityY(0);
        }
    }
}