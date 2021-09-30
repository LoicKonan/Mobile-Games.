/*****************************************************************************
*
*    Author:           Loic Konan
*    Email:            loickonan.lk@gmail.com
*    Label:            Game 1
*    Title:            Souls Crusher
*    Course:           CMPS 4443
*    Semester:         Summer 2021
*    Description:
*
*
*       The goal of this game is to click on the monsters and collect as 
*       many souls as you can and move to the next levels.
*       
*       1 # Added over 100 differents Monsters, and human.
*       2 # Added a more descriptive game Title.
*       3 # Added New sound when you click the door to exit/save.
*       4 # Added New background picture to the intro of the game.
*       5 # Added a New sound when you click the lighting power.
*       6 # Added a background Music.
*       7 # Added a nice cloud background picture.
*       8 # Added a new kool sword for power up.
*       9 # Added New Levels.
*      10 # Added a Green HealthBar. 
*
*    Files:
*         MainScene.js
*         Game.js
*         Monsters.js
*         Phaser.js
*         TitleScene.js
*         index.html
*
*    Usage:
*           - Click the left Mouse.
*
******************************************************************************/

class MainScene extends Phaser.Scene 
{
    // This is where we define data members
    constructor() 
    {
        super("MainScene");
        
         // player level text
         this.playerlvltxt = null;
         this.leveluptext = null;
        // player level
        this.playerlvl = 
        {
            level: 1,
            totalSouls: 0
        }

        // Monster variables
        this.monsterImage = null;
        this.hp = 5;
        this.hpText = null;
        this.soulsText = null;
        this.souls = 0;

        // Levels in upgrades
        this.levels = 
        {
            bolt: 0,
        }
        // Status of monster
        this.alive = false;

        this.healthBar = null;
    }

    // Runs before entering the scene, LOAD IMAGES AND SOUND HERE
    preload() 
    {
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('sword', './assets/sword.png');

        // Loop through monster configuration and load each image
        for (let i = 0; i < MONSTERS.length; i++) 
        {
            this.load.image(MONSTERS[i].name, `./assets/${MONSTERS[i].image}`);
        }
        this.load.image('bolt', './assets/bolt.png');
        this.load.image('door', './assets/door.png');

        // Load sound effects
        this.load.audio('BigHit_Layer06', './assets/BigHit_Layer06.wav')
        this.load.audio('hit', './assets/hit_001.wav');
        this.load.audio('song', './assets/song.wav');
        this.load.audio('Win', './assets/Win.wav');
        this.load.audio('Sound', './assets/Sound.wav');
    }

    // Runs when we first enter this scene
    create() 
    {
        let GameMusic = this.sound.add('Sound', {volume: 0.1});
        GameMusic.play(
        {
            loop: true
        })

        // Add background
        let background = this.add.image(225,400,'clouds');
        background.setScale(3);

        // Load game data
        this.loadGame();

        // Set the starting monster
        let index = Math.floor(Math.random() * MONSTERS.length);
        this.setMonster(MONSTERS[index]);

        // Create hp text
        this.hpText = this.add.text(225, 700, " ");
        
        // Create the souls text
        this.soulsText = this.add.text(50, 50, "Souls: 0", 
        {
            fontSize: '24px',
            color: 'red'
        });

         // Create the souls text
         this.playerlvltxt = this.add.text(50, 80, "Level: 0", 
         {
             fontSize: '24px',
             color: 'green'
         });
 
        // Health Bar with a color green.
        this.healthBar = this.add.rectangle(230, 150, 90, 20, 0x00FF00);

        // Create an upgrade icon for the bolt upgrade
        let bolt = this.add.image(400, 50, 'bolt');
        bolt.setScale(3);
        bolt.setInteractive();
        bolt.on('pointerdown', () => 
        {
            // If we have enough money
            if (this.souls >= 5) 
            {
                 // Play a hit sound
                 this.sound.play('Win', 
                 {
                     volume: 0.6
                 });
                // pay the money
                this.souls -= 5;

                // gain a level
                this.levels.bolt++;
            }
        });

        // Create an upgrade icon for the sword upgrade
        let sword = this.add.image(325, 50, 'sword');
        sword.setScale(2.5);
        sword.setInteractive();
        sword.on('pointerdown', () => 
        {
            // If we have more than 15 souls.
           if (this.souls >= 15) 
           {
                // pay the money in souls
                this.souls -= 10;

                // gain a level
                this.levels.sword++;
                this.sound.play('BigHit_Layer06', 
                {
                    volume: 0.6
                });
           }
        });

        // Create an interval to use bolt damage
        let interval = setInterval(() => 
        {
            this.damage(this.levels.bolt);
        }, 1000);

        // Save button
        let door = this.add.image(50, 750, 'door');
        door.setScale(3);
        door.setInteractive();
        door.on('pointerdown', () => 
        {
            this.saveGame();
            this.scene.start("TitleScene");
            GameMusic.stop();
        });

        // Save every 60s
        setInterval(() => 
        {
            this.saveGame();
        }, 60000);

        // Save once on startup, to set the time
        this.saveGame();
    }

    // Runs every frame
    update() 
    {
        if (this.hp > 0) 
        {
            this.hpText.setText(`${this.hp}`);
            this.healthBar.setScale(this.hp/5, 1);
        }
        else 
        {
            this.hpText.setText("0");
            this.healthBar.setScale(0);
        }
        this.soulsText.setText(`Souls: ${this.souls}`);
        this.playerlvltxt.setText(`Level: ${this.playerlvl.level}`);
    }

    // Function handling the damage of the hp.
    damage(amount) 
    {
        // Lower the hp of the current monster
        this.hp -= amount;

        // Check if monster is dead
        if (this.hp <= 0 && this.alive) 
        {
            console.log("You killed the monster!");
            
            // Set monster to no longer be alive
            this.alive = false;

            // Play a death animation
            this.tweens.add(
                {
                // List of things to affect
                targets: [this.monsterImage],

                // Duration of animation in ms
                duration: 750,

                // Alpha is transparency, 0 means invisible
                alpha: 0,

                // Scale the image down during animation
                scale: 0.1,

                // Set the angle
                angle: 359,

                // Runs once the death animation is finsihed
                onComplete:
                    () => 
                    {
                        // Choose a random new monster to replace the dead one
                        let index = Math.floor(Math.random() * MONSTERS.length);
                        this.setMonster(MONSTERS[index]);

                        // Gain a soul
                        this.souls++;
                         // display the total amount of souls
                         console.log("Total Souls: " + ((this.playerlvl.totalSouls)+1));
                         this.playerlvl.totalSouls++;
                         
                         // Every 10 souls you can level Up.
                         if (this.playerlvl.totalSouls % 10 == 0) 
                         {
                             this.playerlvl.level++;
                             console.log("LEVEL UP");
                         }

                        // Save game (and soul gained)
                        this.saveGame();
                    }

            });
        }
    }

    // Function to load the game with the save data or new data.
    loadGame() 
    {
        const data = loadObjectFromLocal();
        if(data != null)
        {
            this.souls = data.souls;
            this.totalSouls = data.totalSouls;
            this.levels = data.levels;
            this.playerlvl = data.playerlvl;
            const lastPlayed = data.lastPlayed;
            const now = new Date().getTime();
            const seconds = (now - lastPlayed) / 1000;
            let soulsGained = Math.floor(seconds / 3000);
            this.souls += soulsGained;
        }
    }

    // Saving the game Data.
    saveGame() 
    {
        const data = 
        {
            lastPlayed: new Date().getTime(),
            souls: this.souls,
            playerlvl: this.playerlvl,
            totalSouls: this.totalSouls,
            levels: this.levels
        }
        saveObjectToLocal(data);
    }

    // Function that set up the monster configuration.
    setMonster(monsterConfig) 
    {
        // Destroy the old monster's game object
        if (this.monsterImage != null) this.monsterImage.destroy();

        // Reset hp of the monster
        this.hp = monsterConfig.hp;
        this.alive = true;

        // Create a image of monster at position x:225,y:400
        this.monsterImage = this.add.image(225, 400, monsterConfig.name);

        // Set the size of the monster
        this.monsterImage.setScale(1);

        // Make the monster clickable
        this.monsterImage.setInteractive();

        // Handler/callback for the 'pointer down' event
        this.monsterImage.on('pointerdown',
            () => 
            {
                // Play a hit sound
                this.sound.play('hit', 
                {
                    volume: 0.2
                });
                this.damage(1);
            });
    }
}