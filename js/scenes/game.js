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
        this.soundToggle = new SoundToggle(this);
        this.soundToggle.addSoundToggle();
        this.initialiseVariables();
        this.floor = this.add.image(0, this.game.renderer.height, "floor").setOrigin(0, 1);
        this.addSpacebarItemSlot()
        this.addUIText();
        this.loadDictionary();
        this.createAnims();
        this.makePlayer();
        this.makeHealthBar();
        this.spawnInitialEnemies();        
        this.addKeyboardListeners();
    }

    addSpacebarItemSlot()
    {
        this.spacebarItem_slot = this.add.image(10, 50, "spacebarItem_box").setOrigin(0,0);
        this.add.text(this.spacebarItem_slot.width + 20, this.spacebarItem_slot.height + 50, "spacebar").setOrigin(0,1);
        this.spacebarItemCharge = this.add.graphics({
            fillStyle: {
                color: "0xffffff"
            }
        })
    }

    //Create all the variables used to manage the game and set them to their initial values 
    initialiseVariables()
    {
        this.itemPool = JSON.parse(JSON.stringify(settings.itemPool));
        this.playerSpeed = settings.basePlayerSpeed;
        this.score = 0; //Keeps track of the score
        this.iFrames = false; //Whether the player has IFrames or not
        this.timeDamageTaken = this.game.getTime(); //The game time when damage was last taken - used to turn off iFrames 
        this.lives = settings.maxLives; //The starting amount of lives
        this.shields = 0;
        this.wave = 1;
        this.enemySpeed = settings.enemySpeed;
        this.droppedHearts = 0; //keeps track of the amount of hearts in the world
        this.used_words = []; //array to store the words currently in use 
        this.currentWord = ''; //the current string that has been typed 
        this.spacebarItem = new SpacebarItem; //string containing the current spacebar item
        this.enemiesFrozen = false;
    }

    //Called on scene creation to spawn the first wave of enemies
    spawnInitialEnemies()
    {
        this.goblins = this.physics.add.group();
        for (let i = 0; i < 5; i++)
        {
            this.goblins.add(this.makeGoblin());
        }
        // for (let i = 0; i < 3; i++)
        // {
        //     this.enemies.add(this.makeBat());
        // }
    }

    //Add listeners to enable typing input
    addKeyboardListeners()
    {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyboard = this.input.keyboard.addKeys("A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Backspace");
        this.input.keyboard.on("keydown", event => this.keyTyped(event));
    }

    //load txt file of words into an array
    loadDictionary()
    {
        let cache = this.cache.text;
        let words = cache.get('dict');
        this.word_arr = words.split('\n');
    }

    //create the player sprite give it world collisions and play its animation
    makePlayer()
    {
        this.player = this.physics.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - this.floor.height + 10, "slime_run");
        this.player.setScale(2);
        this.player.setCollideWorldBounds();
        this.player.play("player_anim");
        this.physics.world.enableBody(this.player);
    }

    //Add user interface text
    addUIText()
    {
        this.waveTxt = this.add.text(this.game.renderer.width / 2, 10, `Wave ${this.wave}`, {font: "40px Impact"}).setOrigin(0.5, 0);

        this.scoreTxt = this.add.text(this.game.renderer.width - 10, 10, `Score: ${this.score}`).setOrigin(1,0); //Game object to display current score
        this.makeHighScoresList();
        this.display_typing = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - this.floor.height - 10, "", {font: "40px Impact"}).setOrigin(0.5, 1);
    }

    //Create all the animation frames and sequences 
    createAnims()
    {
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
        this.anims.create({
            key: "chest_anim",
            frameRate: 4,
            repeat: 1,
            frames: this.anims.generateFrameNames("chest", {
                frames: [0,1,2,3,4,5,6,7]
            })
        });
    }

    //Create the highscore list shown in the top right during game play 
    makeHighScoresList()
    {
        let scoreList = settings.highScores;
        scoreList.sort((a,b)=>b-a);
        let top = 50;
        let label = this.add.text(this.game.renderer.width, top, "High Scores:").setOrigin(1, 0);
        for (let i = 0; i < 5; i++)
        {
            let score = 0;
            if (i < scoreList.length)
                score = scoreList[i]
            this.add.text(this.game.renderer.width - label.width, top + 30 + (i * 15), `${i+1}. ${score}`).setOrigin(0);
        }
    }

    //Create the healthbar ui element 
    makeHealthBar()
    {
       this.healthBarGUI = this.add.image(10, 10, "health_bar").setOrigin(0).setScale(2).setDepth(100);
       this.healthBar = this.add.graphics({
           fillStyle: {
               color: "0xff0000"
           }
       }).fillRect(this.healthBarGUI.x + 25, this.healthBarGUI.y + 5, 130, 17); //4 = 130, 3 = 100, 2 = 70, 1 = 30
       this.shieldCounter = this.add.image(this.healthBarGUI.x + this.healthBarGUI.width * 2 + 5, this.healthBarGUI.y, "shield").setOrigin(0);
       this.shieldCounterTxt = this.add.text(this.shieldCounter.x + this.shieldCounter.width + 5, this.shieldCounter.y, "x0");
    }

    //called after a keypress to handle typing input
    keyTyped(event)
    {
        if (this.timeLastKeyTyped)
        {
            if (this.game.time - this.timeLastKeyTyped < 50)
                return;
        }
        this.timeLastKeyTyped = this.game.getTime();
        //list of keys that need to be ignored
        let keysToIgnore = ["Shift", "Control", "Alt", "AltGraph", "Unidentified", "OS", "CapsLock"];
        if (event.keyCode > 36 && event.keyCode < 41) //ignore arrow keys
            return;
        if (keysToIgnore.findIndex((key, i) => key == event.key) != -1) 
            return;
        let key = event.key;
        if (key == "Backspace" && this.currentWord.length > 0)
        {
            this.currentWord = this.currentWord.slice(0, -1);
            this.addToScore(-5);
        }
        else if (key == "Enter")
        {
            this.currentWord = "";
            this.display_typing.text = this.currentWord;
            this.addToScore(-20);
        }
        else if (key == "Escape")
        {
            this.scene.pause();
            this.scene.run("Pause")
        }
        else if (event.keyCode == 32) //spacebar
        {
            this.useSpacebarItem();
        }
        else if (key != "Backspace")
        {
            this.currentWord += key;
            this.currentWord = this.currentWord.toLowerCase()
        }
        this.display_typing.text = this.currentWord;
        this.checkWordHasBeenTyped();
    }

    //Check if one of the words associated with an enemy has been typed 
    checkWordHasBeenTyped()
    {
        if (this.used_words.indexOf(this.currentWord) != -1) //word has been typed
        {
            this.enemyKilled(this.currentWord);
        }
    }

    //Handle the destruction of an enemy 
    enemyKilled(enemyWord)
    {
        //Clear the typed word
        this.currentWord = ""; 
        this.display_typing.text = this.currentWord;

        //Play a sound
        this.sound.play("goblin_damage");

        //charge spacebar item
        if (this.spacebarItem.item != "")
            this.chargeSpacebarItem();

        //remove enemy
        let enemyArr = this.goblins.getChildren();
        for (let i = 0; i < enemyArr.length; i++) 
        {
            if (enemyArr[i].list[0].word == enemyWord)
            {
                enemyArr[i].destroy();
            }
        }
        //increase the score and update the display
        this.addToScore(100);
        this.checkWaveEnd();
    }

    //Called everytime an enemy is killed to check if the wave is over 
    checkWaveEnd()
    {
        if (this.goblins.getChildren().length == 0) //if no enemies left then wave is over
           this.waveEnded();
    }

    //called if the wave is over 
    waveEnded()
    {
        this.addToScore(1000 * this.wave);
        this.wave ++;
        
        if (this.wave % 3 == 0)
            this.spawnTreasure();
        else {
            this.startWaveCountdown();
        }
    }

    //Called every three waves to spawn a treasure chest
    spawnTreasure()
    {
        let chest = this.physics.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - this.floor.height / 2, "chest").setScale(3);
        chest.setImmovable();
        chest.play("chest_anim");
        this.physics.world.addCollider(this.player, chest, (player, chest) => this.openTreasure(chest));
    }

    openTreasure(chest)
    {
        chest.destroy();
        let openChest = this.physics.add.image(this.game.renderer.width / 2, this.game.renderer.height - this.floor.height / 2, "chest_open").setImmovable().setScale(3);
        this.physics.world.addCollider(this.player, openChest, (player, chest) => {});
        let item = this.showTreasureItem(openChest);
        this.chestTimer = this.time.addEvent({
            delay: 2000,
            callback: () => {
                openChest.destroy();
                item.destroy();
                this.startWaveCountdown();
                this.chestTimer.remove();
            }
        });
    }

    showTreasureItem(openChest)
    {
        let index = Math.floor(Math.random() * this.itemPool.length);
        let chosenItem = this.itemPool[index];
        let item = this.add.image(openChest.x, openChest.y - 20, chosenItem).setScale(1.5);
        switch (chosenItem)
        {
            case "shield":
                this.addShield();
                break;
            case "speed_boots":
                this.playerSpeed += 10;
                this.itemPool.splice(index, 1);
                break;
            case "speed_pot":
                this.playerSpeed += 15;
                this.itemPool.splice(index, 1);
            case "violin": 
                this.addSpacebarItem(chosenItem);
                this.itemPool.splice(index, 1);
                break;
        }
        return item;
    }

    //start the countdown to the next wave 
    startWaveCountdown()
    {
        this.waveCountdownTxt = this.add.text(this.game.renderer.width / 2, 90, "5", {font: "70px Impact"}).setOrigin(0.5);
        this.waveTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.waveCountdownTxt.text = `${this.waveTimer.getRepeatCount()}`;
                if (this.waveTimer.getRepeatCount() == 0)
                {
                    this.waveCountdownTxt.destroy();
                    this.startNextWave();
                    this.waveTimer.remove();
                }
            },
            repeat: 4
        });
    }

    startNextWave()
    {
        this.waveTxt.text = `Wave ${this.wave}`;
        //make enemies faster
        if (this.enemySpeed < settings.maxEnemySpeed)
            this.enemySpeed ++;

        for (let i = 0; i < 5 + this.wave; i++)
        {
            this.goblins.add(this.makeGoblin());
        }
    }

    addShield()
    {
        this.shields++;
        this.shieldCounterTxt.text = `x${this.shields}`;
    }

    loseShield()
    {
        this.shields--;
        this.shieldCounterTxt.text = `x${this.shields}`;
    }

    addSpacebarItem(item)
    {
        this.spacebarItem.item = item;
        let index = settings.spacebarItems.findIndex((val, i) => val.item == item);
        this.spacebarItem.chargeRate = settings.spacebarItems[index].chargeRate;
        this.spacebarItem.charge = 70;
        this.spacebarItemSprite = this.add.image(this.spacebarItem_slot.x + this.spacebarItem_slot.width / 2, this.spacebarItem_slot.y + this.spacebarItem_slot.height / 2, item);
        this.spacebarItemSprite.setScale(2);
        this.spacebarItemCharge.fillRect(this.spacebarItemSprite.x + this.spacebarItemSprite.width + 5, this.spacebarItem_slot.y, 5, 70);
    }

    useSpacebarItem()
    {
        if (this.spacebarItem.charge >= this.spacebarItem.chargeHeight)
        {
            this.spacebarItemCharge.clear();
            switch (this.spacebarItem.item)
            {
                case "":
                    break;
                case "violin":
                    this.freezeEnemies();
                    this.spacebarItem.charge = 0;
            }
        }
    }

    chargeSpacebarItem()
    {
        this.spacebarItemCharge.clear();
        this.spacebarItem.charge += this.spacebarItem.chargeRate;
        if (this.spacebarItem.charge > this.spacebarItem.chargeHeight)
            this.spacebarItem.charge = this.spacebarItem.chargeHeight;
        this.spacebarItemCharge.fillRect(this.spacebarItemSprite.x + this.spacebarItemSprite.width + 5, this.spacebarItem_slot.y + this.spacebarItem.chargeHeight - this.spacebarItem.charge, 5, this.spacebarItem.charge);
    }

    freezeEnemies()
    {
        this.enemiesFrozen = true;
        this.freezeTimer = this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.enemiesFrozen = false;
                this.freezeTimer.destroy();
                for (let i = 0; i < this.goblins.getChildren().length; i++)
                {
                    this.goblins.getChildren()[i].list[0].anims.play();
                }
            }
        })
    }

    addToScore(amount)
    {
        this.score += amount;
        this.scoreTxt.setText(`Score: ${this.score}`);
    }

    generateEnemyPosition()
    {
        let x = Math.floor(Math.random() * this.game.renderer.width);
        let y = Math.floor(Math.random() * this.floor.height) + this.game.renderer.height - this.floor.height;
        //get distance to player from generated point
        let ret = {x: x, y: y};
        if (Math.sqrt(Math.pow(x - this.player.x, 2) + Math.pow(y - this.player.y, 2)) < 120)
            ret = this.generateEnemyPosition();
        return ret;
    }

    makeGoblin()
    {
        let word = this.selectWord();
        let goblin = new Enemy(this, 0, 0, "goblin_run", 0, word, this.enemySpeed);//this.add.sprite(0,0,"goblin_idle").setScale(2);
        goblin.play("goblin_anim");
        this.used_words.push(word);
        let enemy_txt = this.add.text(0, -25, word, {fontSize: "20px", backgroundColor: "0x000000"}).setOrigin(0.5);
        let spawnPos = this.generateEnemyPosition();
        
        this.enemy = this.add.container(spawnPos.x, spawnPos.y, [goblin, enemy_txt]);

        this.enemy.setSize(20,25);
        this.physics.world.enableBody(this.enemy);

        this.physics.world.addCollider(this.player, this.enemy, (player, enemy) => {
            this.takeDamage();
        });
        for(let i = 0; i < this.goblins.getChildren().length; i++)
        {
            this.physics.world.addCollider(this.goblins.getChildren()[i], this.enemy, (player, enemy) => {
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
            this.addToScore(-50);
            if (this.shields > 0)
                this.loseShield();
            else
            {
                this.lives --;
                this.sound.play("slime_damage", {
                    volume: "1"
                })
                if (this.lives == 0)
                    this.gameOver();
                let barWidth = this.lives * 30 + 10;
                this.healthBar.clear().fillRect(this.healthBarGUI.x + 25, this.healthBarGUI.y + 5, barWidth, 17);
                this.timeDamageTaken = this.game.getTime();
            }
        }
    }

    gameOver()
    {
        settings.highScores.push(this.score);
        this.scene.pause();
        this.scene.start("Game_Over");
    }

    createHeart()
    {
        let x = Math.floor(Math.random() * this.game.renderer.width);
        let y = Math.floor(Math.random() * this.floor.height) + (this.game.renderer.height - this.floor.height);
        let newHeart = this.physics.add.image(x, y, "heart_drop").setOrigin(0).setScale(2);
        this.droppedHearts ++;
        this.physics.world.addCollider(this.player, newHeart, (player, heart) => {
            if (this.lives < settings.maxLives)
            {
                heart.destroy();
                this.droppedHearts --;
                this.lives ++;
                let barWidth = this.lives * 30 + 10;
                this.healthBar.clear().fillRect(this.healthBarGUI.x + 25, this.healthBarGUI.y + 5, barWidth, 17);
            }
        });
    }

    update(time, delta)
    {
        //Turn off iFrames once two seconds has passed since damage was taken
        if (time - 2000 > this.timeDamageTaken)
            this.iFrames = false; 

        this.moveEnemies(this.goblins);
        
        this.spawnHearts();

        this.movePlayer();
    }

    spawnEnemies()
    {

    }

    spawnHearts()
    {
        if (this.lives < settings.maxLives && this.droppedHearts < settings.maxHeartsOnScreen)
        {
            let chance = Math.random() * 10000;
            let threshold = Math.pow(5, settings.maxLives - this.lives);
            if (chance < threshold)
                this.createHeart();
        }
    }

    moveEnemies(enemyGroup)
    {
        for (let i = 0; i < enemyGroup.getChildren().length; i++) {
            if (this.enemiesFrozen)
            {
                enemyGroup.getChildren()[i].body.setVelocity(0);
                enemyGroup.getChildren()[i].list[0].anims.pause();
            }
            else
            {
                this.physics.moveToObject(enemyGroup.getChildren()[i], this.player, enemyGroup.getChildren()[i].list[0].speed);
                if (enemyGroup.getChildren()[i].body.x > this.player.x){
                    enemyGroup.getChildren()[i].list[0].setFlipX(true);
                }
                else {
                    enemyGroup.getChildren()[i].list[0].setFlipX(false);
                }
            }
        }
    }

    movePlayer()
    {
        let right = this.cursorKeys.right.isDown;
        let left = this.cursorKeys.left.isDown;
        let up = this.cursorKeys.up.isDown
        let down = this.cursorKeys.down.isDown
        if (right)
        {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
        }
        if (left)
        {
            this.player.setVelocityX(-1 * this.playerSpeed);
            this.player.setFlipX(true);
        }
        if (up)
        {
            if (this.player.y > this.game.renderer.height - this.floor.height)
            {
                this.player.setVelocityY(-1 * this.playerSpeed);
            }
            else 
            {
                this.player.setVelocityY(0);
            }
        }
        if (down)
        {
            this.player.setVelocityY(this.playerSpeed);
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